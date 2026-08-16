import { CheckCircleIcon, LockKeyIcon } from "@phosphor-icons/react";
import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/payment")({
	component: PaymentPage,
	beforeLoad: async () => {
		if (typeof window !== "undefined") {
			const localUser = localStorage.getItem("rbuilder_user");
			const supabaseUser = localStorage.getItem("rbuilder_supabase_user");
			const storedEmail = localStorage.getItem("rbuilder_user_email");
			const userEmail =
				storedEmail ||
				(localUser ? JSON.parse(localUser).email : "") ||
				(supabaseUser ? JSON.parse(supabaseUser).email : "");

			if (!userEmail) {
				throw redirect({ to: "/auth/login", replace: true });
			}
		}
	},
});

type Plan = {
	id: "monthly" | "quarterly";
	title: string;
	price: string;
	period: string;
	originalPrice?: string;
	badge?: string;
	description: string;
	features: string[];
	buttonText: string;
	highlighted?: boolean;
};

type RazorpayCheckoutResponse = {
	razorpay_payment_id: string;
	razorpay_order_id: string;
	razorpay_signature: string;
};

type RazorpayInstance = {
	open: () => void;
	on: (event: "payment.failed", listener: (response: { error?: { description?: string } }) => void) => void;
};

type RazorpayConstructor = new (options: Record<string, unknown>) => RazorpayInstance;

const PLANS: Plan[] = [
	{
		id: "monthly",
		title: "Starter Monthly",
		price: "₹11",
		period: "/ 1st Month",
		originalPrice: "₹49",
		description: "Get full access to all resume templates, PDF exports, and builder tools for your first month.",
		features: [
			"Full Access to All Premium Templates",
			"Unlimited PDF & DOCX Downloads",
			"Live Cloud Storage & Sync",
			"100% ATS-Friendly Resume Layouts",
			"24/7 Calling Support",
			"Cancel Anytime",
		],
		buttonText: "Activate ₹11 / Month Plan",
		highlighted: false,
	},
	{
		id: "quarterly",
		title: "Pro Quarter",
		price: "₹20",
		period: "/ 3 Months",
		originalPrice: "₹149",
		badge: "MOST POPULAR • SAVE 85%",
		description: "Maximum savings for job seekers. 3 full months of unlimited builder access with automated renewal.",
		features: [
			"Full Access to All Premium Templates",
			"Unlimited PDF & DOCX Downloads",
			"Live Cloud Storage & Sync",
			"100% ATS-Friendly Resume Layouts",
			"24/7 Calling Support",
			"Cancel Anytime",
		],
		buttonText: "Activate ₹20 / 3 Months Plan",
		highlighted: true,
	},
];

function PaymentPage() {
	const navigate = useNavigate();
	const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	function loadRazorpayScript(): Promise<boolean> {
		return new Promise((resolve) => {
			if (typeof window === "undefined") return resolve(false);
			if ((window as Window & { Razorpay?: RazorpayConstructor }).Razorpay) return resolve(true);
			const script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.onload = () => resolve(true);
			script.onerror = () => resolve(false);
			document.body.appendChild(script);
		});
	}

	async function handleSelectPlan(plan: Plan) {
		setSelectedPlan(plan);
		setIsProcessing(true);

		const userEmail = typeof window !== "undefined" ? localStorage.getItem("rbuilder_user_email") || "" : "";
		const rawUser = typeof window !== "undefined" ? localStorage.getItem("rbuilder_user") : null;
		let userName = "User";
		try {
			userName = rawUser ? JSON.parse(rawUser).name || "User" : "User";
		} catch {
			// A malformed browser cache must not prevent a user from paying.
		}

		if (!userEmail) {
			setIsProcessing(false);
			toast.error("Please sign in before choosing a plan.");
			void navigate({ to: "/auth/login" });
			return;
		}

		const grantSubscriptionAndProceed = (paymentId?: string) => {
			if (typeof window !== "undefined") {
				localStorage.setItem("rbuilder_payment_status", "active");
				localStorage.setItem("rbuilder_subscription_plan", plan.id);
				if (paymentId) {
					localStorage.setItem("rbuilder_razorpay_payment_id", paymentId);
				}
			}

			toast.success(`Payment Activated! ${plan.title} is now active.`);
			setIsProcessing(false);
			void navigate({ to: "/onboarding" });
		};

		const isScriptLoaded = await loadRazorpayScript();
		if (!isScriptLoaded || !(window as Window & { Razorpay?: RazorpayConstructor }).Razorpay) {
			setIsProcessing(false);
			toast.error("Unable to load Razorpay payment SDK. Please check your internet connection.");
			return;
		}

		try {
			const orderResponse = await fetch("/api/payments/create-order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ plan: plan.id, email: userEmail, name: userName }),
			});
			const order = (await orderResponse.json().catch(() => null)) as
				| { keyId: string; orderId: string; amount: number; currency: string }
				| { error: string }
				| null;
			if (!orderResponse.ok || !order || !("orderId" in order)) {
				throw new Error(order && "error" in order ? order.error : "Failed to create a payment order.");
			}

			const options = {
				key: order.keyId,
				order_id: order.orderId,
				amount: order.amount,
				currency: order.currency,
				name: "rbuilder",
				description: `${plan.title} Subscription (${plan.price})`,
				image: "/opengraph/logo.png",
				prefill: {
					name: userName,
					email: userEmail,
				},
				theme: {
					color: "#10b981",
				},
				handler: async (response: RazorpayCheckoutResponse) => {
					try {
						const verifyResponse = await fetch("/api/payments/verify", {
							method: "POST",
							headers: { "Content-Type": "application/json" },
							body: JSON.stringify(response),
						});
						if (!verifyResponse.ok) {
							const result = (await verifyResponse.json().catch(() => null)) as { error?: string } | null;
							throw new Error(result?.error || "Payment verification failed.");
						}
						grantSubscriptionAndProceed(response.razorpay_payment_id);
					} catch (error) {
						setIsProcessing(false);
						toast.error(error instanceof Error ? error.message : "Payment verification failed.");
					}
				},
				modal: {
					ondismiss: () => {
						setIsProcessing(false);
						toast.info("Payment window closed.");
					},
				},
			};

			const Razorpay = (window as Window & { Razorpay?: RazorpayConstructor }).Razorpay;
			if (!Razorpay) throw new Error("Razorpay checkout could not be initialized.");
			const rzp = new Razorpay(options);
			rzp.on("payment.failed", (resp) => {
				console.warn("Razorpay payment failed:", resp?.error?.description);
				setIsProcessing(false);
				toast.error(resp?.error?.description || "Payment failed. Money was not deducted.");
			});
			rzp.open();
		} catch (err) {
			console.error("Razorpay checkout error:", err);
			setIsProcessing(false);
			toast.error(err instanceof Error ? err.message : "Failed to initialize Razorpay checkout popup.");
		}
	}

	return (
		<div className="relative flex min-h-screen w-full flex-col items-center justify-between bg-zinc-950 p-4 font-sans text-zinc-100 selection:bg-emerald-500 selection:text-black md:p-8">
			{/* Ambient Glowing Background Lights */}
			<div aria-hidden="true" className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-30">
				<div className="size-[600px] animate-pulse rounded-full bg-gradient-to-tr from-emerald-500/20 via-yellow-500/20 to-teal-500/20 blur-3xl" />
			</div>
			<div aria-hidden="true" className="pointer-events-none fixed top-10 left-10 opacity-20">
				<div className="size-[350px] rounded-full bg-gradient-to-br from-yellow-400/20 to-emerald-500/20 blur-3xl" />
			</div>

			{/* Top Navbar Header */}
			<header className="relative z-10 flex w-full max-w-6xl items-center justify-between border-zinc-800/80 border-b py-4">
				<a
					href="/"
					onClick={(e) => {
						e.preventDefault();
						if (typeof window !== "undefined") {
							localStorage.removeItem("rbuilder_user");
							localStorage.removeItem("rbuilder_user_email");
							localStorage.removeItem("rbuilder_supabase_user");
							localStorage.removeItem("rbuilder_payment_status");
							localStorage.removeItem("rbuilder_onboarding_completed");
						}
						window.location.href = "/";
					}}
					className="flex cursor-pointer items-center gap-2 transition-opacity hover:opacity-80"
				>
					<img
						src="/opengraph/logo.png"
						alt="rbuilder logo"
						className="size-8 rounded-full border border-emerald-500/40"
					/>
					<span className="font-bold text-lg text-white tracking-tight">rbuilder</span>
				</a>
			</header>

			{/* Main Content Area */}
			<main className="relative z-10 my-auto flex w-full max-w-5xl flex-col items-center space-y-8 py-8">
				{/* Title Section */}
				<div className="max-w-2xl space-y-3 text-center">
					<h1 className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text font-extrabold text-3xl text-transparent tracking-tight md:text-5xl">
						Choose Your Plan
					</h1>

					<p className="text-sm text-zinc-400 leading-relaxed md:text-base">
						Activate your plan to unlock the complete Resume Builder, all templates, unlimited PDF exports, and live
						cloud sync.
					</p>
				</div>

				{/* 2 Plan Cards Grid */}
				<div className="grid w-full max-w-4xl items-stretch gap-6 md:grid-cols-2 lg:gap-8">
					{PLANS.map((plan) => (
						<div
							key={plan.id}
							className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-300 md:p-8 ${
								plan.highlighted
									? "scale-[1.02] border-2 border-yellow-400 bg-zinc-900/90 shadow-2xl shadow-yellow-500/20"
									: "border border-zinc-800 bg-zinc-900/50 shadow-xl backdrop-blur-xl hover:border-zinc-700"
							}`}
						>
							{/* Popular Badge */}
							{plan.badge && (
								<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 px-4 py-1 font-black text-[11px] text-zinc-950 uppercase tracking-wider shadow-lg">
									{plan.badge}
								</div>
							)}

							<div className="space-y-6">
								{/* Card Header */}
								<div className="space-y-2 border-zinc-800/80 border-b pb-6">
									<h3 className="font-bold text-white text-xl">{plan.title}</h3>
									<div className="flex items-baseline gap-2">
										<span className="font-extrabold text-4xl text-white tracking-tight md:text-5xl">{plan.price}</span>
										<span className="font-semibold text-sm text-zinc-400">{plan.period}</span>
										{plan.originalPrice && (
											<span className="ml-1 text-xs text-zinc-500 line-through">{plan.originalPrice}</span>
										)}
									</div>
									<p className="pt-1 text-xs text-zinc-400 leading-relaxed">{plan.description}</p>
								</div>

								{/* Features List */}
								<ul className="space-y-3">
									{plan.features.map((feature, idx) => (
										<li key={idx} className="flex items-center gap-3 text-xs text-zinc-300 md:text-sm">
											<CheckCircleIcon
												weight="fill"
												className={`size-4 shrink-0 ${plan.highlighted ? "text-yellow-400" : "text-emerald-400"}`}
											/>
											<span>{feature}</span>
										</li>
									))}
								</ul>
							</div>

							{/* Select Button */}
							<button
								type="button"
								disabled={isProcessing && selectedPlan?.id === plan.id}
								onClick={() => handleSelectPlan(plan)}
								className={`mt-8 flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-3.5 font-bold text-sm shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 ${
									plan.highlighted
										? "bg-yellow-400 text-zinc-950 shadow-yellow-500/25 hover:bg-yellow-300"
										: "border border-zinc-700 bg-zinc-800 text-white hover:bg-zinc-700"
								}`}
							>
								{isProcessing && selectedPlan?.id === plan.id ? (
									<>
										<div className="size-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
										<span>Opening Razorpay...</span>
									</>
								) : (
									<span>{plan.buttonText}</span>
								)}
							</button>
						</div>
					))}
				</div>

				{/* Security Guarantee Footer Note */}
				<div className="flex items-center justify-center gap-6 pt-4 text-xs text-zinc-500">
					<div className="flex items-center gap-1.5">
						<LockKeyIcon className="size-4 text-emerald-400" />
						<span>256-bit Encrypted Payment</span>
					</div>
					<div className="flex items-center gap-1.5">
						<CheckCircleIcon className="size-4 text-emerald-400" />
						<span>Cancel Anytime</span>
					</div>
				</div>
			</main>
		</div>
	);
}
