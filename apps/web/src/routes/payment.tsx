import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import {
	ArrowLeftIcon,
	CheckCircleIcon,
	CreditCardIcon,
	LockKeyIcon,
	QrCodeIcon,
	ShieldCheckIcon,
	SparkleIcon,
	XIcon,
} from "@phosphor-icons/react";
import { saveUserToSupabase } from "@/libs/supabase/db";

export const Route = createFileRoute("/payment")({
	component: PaymentPage,
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
	const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
	const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "qr">("upi");
	const [upiId, setUpiId] = useState("");
	const [isProcessing, setIsProcessing] = useState(false);

	async function loadRazorpayScript(): Promise<boolean> {
		return new Promise((resolve) => {
			if (typeof window === "undefined") return resolve(false);
			if ((window as any).Razorpay) return resolve(true);
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

		const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID || "";
		const userEmail = typeof window !== "undefined" ? localStorage.getItem("rbuilder_user_email") || "user@example.com" : "user@example.com";
		const rawUser = typeof window !== "undefined" ? localStorage.getItem("rbuilder_user") : null;
		const userName = rawUser ? (JSON.parse(rawUser).name || "User") : "User";
		const amountInPaise = Number(plan.price.replace("₹", "")) * 100;

		const grantSubscriptionAndProceed = async (paymentId?: string) => {
			if (typeof window !== "undefined") {
				localStorage.setItem("rbuilder_payment_status", "active");
				localStorage.setItem("rbuilder_subscription_plan", plan.id);
				if (paymentId) {
					localStorage.setItem("rbuilder_razorpay_payment_id", paymentId);
				}

				await saveUserToSupabase({
					email: userEmail,
					name: userName,
					plan: plan.id,
				}).catch(() => null);
			}

			toast.success(`Payment Activated! ${plan.title} is now active.`);
			setIsProcessing(false);
			void navigate({ to: "/onboarding" });
		};

		const isScriptLoaded = await loadRazorpayScript();
		if (!isScriptLoaded || !(window as any).Razorpay) {
			setIsProcessing(false);
			toast.error("Unable to load Razorpay payment SDK. Please check your internet connection.");
			return;
		}

		if (!razorpayKey) {
			setIsProcessing(false);
			toast.error("Razorpay Live Key (VITE_RAZORPAY_KEY_ID) is not configured in environment variables.");
			return;
		}

		try {
			const options = {
				key: razorpayKey,
				amount: amountInPaise,
				currency: "INR",
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
				handler: async function (response: any) {
					// Real money payment succeeded - verify and store razorpay_payment_id
					const paymentId = response?.razorpay_payment_id;
					if (paymentId) {
						await grantSubscriptionAndProceed(paymentId);
					} else {
						setIsProcessing(false);
						toast.error("Payment verification failed. Payment ID missing.");
					}
				},
				modal: {
					ondismiss: function () {
						setIsProcessing(false);
						toast.info("Payment window closed.");
					},
				},
			};

			const rzp = new (window as any).Razorpay(options);
			rzp.on("payment.failed", function (resp: any) {
				console.warn("Razorpay payment failed:", resp?.error?.description);
				setIsProcessing(false);
				toast.error(resp?.error?.description || "Payment failed. Money was not deducted.");
			});
			rzp.open();
		} catch (err) {
			console.error("Razorpay popup initialization error:", err);
			setIsProcessing(false);
			toast.error("Failed to initialize Razorpay checkout popup.");
		}
	}

	return (
		<div className="relative min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center justify-between p-4 md:p-8 font-sans selection:bg-emerald-500 selection:text-black">
			{/* Ambient Glowing Background Lights */}
			<div aria-hidden="true" className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-30">
				<div className="size-[600px] animate-pulse rounded-full bg-gradient-to-tr from-emerald-500/20 via-yellow-500/20 to-teal-500/20 blur-3xl" />
			</div>
			<div aria-hidden="true" className="pointer-events-none fixed top-10 left-10 opacity-20">
				<div className="size-[350px] rounded-full bg-gradient-to-br from-yellow-400/20 to-emerald-500/20 blur-3xl" />
			</div>

			{/* Top Navbar Header */}
			<header className="relative z-10 w-full max-w-6xl flex items-center justify-between py-4 border-b border-zinc-800/80">
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
					className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
				>
					<img src="/opengraph/logo.png" alt="rbuilder logo" className="size-8 rounded-full border border-emerald-500/40" />
					<span className="font-bold text-lg tracking-tight text-white">rbuilder</span>
				</a>
			</header>

			{/* Main Content Area */}
			<main className="relative z-10 w-full max-w-5xl my-auto py-8 space-y-8 flex flex-col items-center">
				{/* Title Section */}
				<div className="text-center space-y-3 max-w-2xl">
					<h1 className="text-3xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
						Choose Your Plan
					</h1>

					<p className="text-zinc-400 text-sm md:text-base leading-relaxed">
						Activate your plan to unlock the complete Resume Builder, all templates, unlimited PDF exports, and live cloud sync.
					</p>
				</div>

				{/* 2 Plan Cards Grid */}
				<div className="w-full grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch max-w-4xl">
					{PLANS.map((plan) => (
						<div
							key={plan.id}
							className={`relative flex flex-col justify-between rounded-3xl p-6 md:p-8 transition-all duration-300 ${
								plan.highlighted
									? "bg-zinc-900/90 border-2 border-yellow-400 shadow-2xl shadow-yellow-500/20 scale-[1.02]"
									: "bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 shadow-xl backdrop-blur-xl"
							}`}
						>
							{/* Popular Badge */}
							{plan.badge && (
								<div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 text-zinc-950 font-black text-[11px] uppercase tracking-wider shadow-lg">
									{plan.badge}
								</div>
							)}

							<div className="space-y-6">
								{/* Card Header */}
								<div className="space-y-2 border-b border-zinc-800/80 pb-6">
									<h3 className="text-xl font-bold text-white">{plan.title}</h3>
									<div className="flex items-baseline gap-2">
										<span className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">{plan.price}</span>
										<span className="text-sm font-semibold text-zinc-400">{plan.period}</span>
										{plan.originalPrice && (
											<span className="text-xs text-zinc-500 line-through ml-1">{plan.originalPrice}</span>
										)}
									</div>
									<p className="text-xs text-zinc-400 leading-relaxed pt-1">{plan.description}</p>
								</div>

								{/* Features List */}
								<ul className="space-y-3">
									{plan.features.map((feature, idx) => (
										<li key={idx} className="flex items-center gap-3 text-xs md:text-sm text-zinc-300">
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
								className={`w-full mt-8 py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 ${
									plan.highlighted
										? "bg-yellow-400 hover:bg-yellow-300 text-zinc-950 shadow-yellow-500/25"
										: "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
								}`}
							>
								{isProcessing && selectedPlan?.id === plan.id ? (
									<>
										<div className="size-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
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
				<div className="flex items-center justify-center gap-6 text-xs text-zinc-500 pt-4">
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
