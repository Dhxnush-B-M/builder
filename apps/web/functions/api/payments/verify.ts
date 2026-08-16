type Env = {
	RAZORPAY_KEY_ID?: string;
	RAZORPAY_KEY_SECRET?: string;
	SUPABASE_URL?: string;
	SUPABASE_SERVICE_ROLE_KEY?: string;
};

type PlanId = "monthly" | "quarterly";

const PLAN_AMOUNTS: Record<PlanId, number> = { monthly: 1100, quarterly: 2000 };

function json(body: unknown, status = 200) {
	return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function basicAuthorization(keyId: string, keySecret: string) {
	return `Basic ${btoa(`${keyId}:${keySecret}`)}`;
}

function matches(actual: string, expected: string) {
	if (actual.length !== expected.length) return false;
	let difference = 0;
	for (let index = 0; index < actual.length; index++)
		difference |= actual.charCodeAt(index) ^ expected.charCodeAt(index);
	return difference === 0;
}

async function signatureFor(value: string, secret: string) {
	const key = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(secret),
		{ name: "HMAC", hash: "SHA-256" },
		false,
		["sign"],
	);
	const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value)));
	return [...bytes].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function provisionSubscription(env: Env, email: string, name: string, plan: PlanId) {
	if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) throw new Error("Subscription storage is not configured.");

	const response = await fetch(`${env.SUPABASE_URL.replace(/\/$/, "")}/rest/v1/user_details?on_conflict=email`, {
		method: "POST",
		headers: {
			apikey: env.SUPABASE_SERVICE_ROLE_KEY,
			Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
			"Content-Type": "application/json",
			Prefer: "resolution=merge-duplicates,return=minimal",
		},
		body: JSON.stringify({ id: email, email, name: name || "User", plan }),
	});

	if (!response.ok) throw new Error("Could not provision the subscription.");
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
	if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) return json({ error: "Payments are not configured." }, 503);

	let input: { razorpay_payment_id?: string; razorpay_order_id?: string; razorpay_signature?: string };
	try {
		input = await request.json();
	} catch {
		return json({ error: "Invalid request body." }, 400);
	}

	const paymentId = input.razorpay_payment_id;
	const orderId = input.razorpay_order_id;
	const signature = input.razorpay_signature;
	if (!paymentId || !orderId || !signature) return json({ error: "Missing payment verification details." }, 400);

	const expectedSignature = await signatureFor(`${orderId}|${paymentId}`, env.RAZORPAY_KEY_SECRET);
	if (!matches(signature, expectedSignature)) return json({ error: "Payment signature is invalid." }, 400);

	const authorization = basicAuthorization(env.RAZORPAY_KEY_ID, env.RAZORPAY_KEY_SECRET);
	const [orderResponse, paymentResponse] = await Promise.all([
		fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(orderId)}`, {
			headers: { Authorization: authorization },
		}),
		fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(paymentId)}`, {
			headers: { Authorization: authorization },
		}),
	]);
	if (!orderResponse.ok || !paymentResponse.ok)
		return json({ error: "Could not confirm the payment with Razorpay." }, 502);

	const order = (await orderResponse.json()) as {
		id: string;
		amount: number;
		currency: string;
		notes?: Record<string, string>;
	};
	const payment = (await paymentResponse.json()) as {
		order_id?: string;
		amount?: number;
		currency?: string;
		status?: string;
	};
	const plan = order.notes?.plan as PlanId | undefined;
	const email = order.notes?.email?.trim().toLowerCase();
	if (
		!plan ||
		!email ||
		order.id !== orderId ||
		payment.order_id !== orderId ||
		order.currency !== "INR" ||
		payment.currency !== "INR" ||
		order.amount !== PLAN_AMOUNTS[plan] ||
		payment.amount !== order.amount
	) {
		return json({ error: "The payment does not match a valid plan." }, 400);
	}

	if (payment.status !== "captured") {
		return json({ error: "Payment is awaiting capture. Access will be enabled after Razorpay confirms it." }, 409);
	}

	try {
		await provisionSubscription(env, email, order.notes?.name || "User", plan);
	} catch {
		return json({ error: "Payment was captured, but access could not be provisioned. Please contact support." }, 502);
	}

	return json({ ok: true, plan, paymentId });
};
