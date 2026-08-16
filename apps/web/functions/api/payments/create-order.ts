type Env = {
	RAZORPAY_KEY_ID?: string;
	RAZORPAY_KEY_SECRET?: string;
};

type PlanId = "monthly" | "quarterly";

const PLANS: Record<PlanId, { amount: number; name: string }> = {
	monthly: { amount: 1100, name: "Starter Monthly" },
	quarterly: { amount: 2000, name: "Pro Quarter" },
};

function json(body: unknown, status = 200) {
	return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function basicAuthorization(keyId: string, keySecret: string) {
	return `Basic ${btoa(`${keyId}:${keySecret}`)}`;
}

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
	if (!env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
		return json({ error: "Payments are not configured." }, 503);
	}

	let input: { plan?: PlanId; email?: string; name?: string };
	try {
		input = await request.json();
	} catch {
		return json({ error: "Invalid request body." }, 400);
	}

	const plan = input.plan && PLANS[input.plan];
	const email = input.email?.trim().toLowerCase();
	if (!plan || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
		return json({ error: "A valid plan and email address are required." }, 400);
	}

	const receipt = `rb_${crypto.randomUUID().replaceAll("-", "").slice(0, 32)}`;
	const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
		method: "POST",
		headers: {
			Authorization: basicAuthorization(env.RAZORPAY_KEY_ID, env.RAZORPAY_KEY_SECRET),
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			amount: plan.amount,
			currency: "INR",
			receipt,
			notes: {
				plan: input.plan,
				email,
				name: input.name?.trim().slice(0, 100) || "User",
			},
		}),
	});

	if (!razorpayResponse.ok) {
		return json({ error: "Could not create the payment order." }, 502);
	}

	const order = (await razorpayResponse.json()) as { id: string; amount: number; currency: string };
	return json({
		keyId: env.RAZORPAY_KEY_ID,
		orderId: order.id,
		amount: order.amount,
		currency: order.currency,
		name: plan.name,
	});
};
