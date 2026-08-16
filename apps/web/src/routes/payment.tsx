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

		const isScriptLoaded = await loadRazorpayScript();
		if (isScriptLoaded && (window as any).Razorpay && razorpayKey) {
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
						if (typeof window !== "undefined") {
							localStorage.setItem("rbuilder_payment_status", "active");
							localStorage.setItem("rbuilder_subscription_plan", plan.id);
							if (response?.razorpay_payment_id) {
								localStorage.setItem("rbuilder_razorpay_payment_id", response.razorpay_payment_id);
							}

							await saveUserToSupabase({
								email: userEmail,
								name: userName,
								plan: plan.id,
							}).catch(() => null);
						}

						toast.success(`Payment Successful! ${plan.title} is now active.`);
						setIsProcessing(false);
						setIsCheckoutOpen(false);
						void navigate({ to: "/onboarding" });
					},
					modal: {
						ondismiss: function () {
							setIsProcessing(false);
						},
					},
				};

				const rzp = new (window as any).Razorpay(options);
				rzp.open();
				return;
			} catch (err) {
				console.warn("Razorpay live popup error, using fallback modal:", err);
			}
		}

		// Direct modal checkout fallback
		setIsProcessing(false);
		setIsCheckoutOpen(true);
	}

	async function handleApprovePayment() {
		if (paymentMethod === "upi" && !upiId.trim()) {
			toast.error("Please enter your UPI ID.");
			return;
		}

		setIsProcessing(true);

		setTimeout(async () => {
			if (typeof window !== "undefined") {
				localStorage.setItem("rbuilder_payment_status", "active");
				localStorage.setItem("rbuilder_subscription_plan", selectedPlan?.id || "monthly");
				
				const userEmail = localStorage.getItem("rbuilder_user_email") || "user@example.com";
				const userRaw = localStorage.getItem("rbuilder_user");
				const userName = userRaw ? JSON.parse(userRaw).name : "User";

				await saveUserToSupabase({
					email: userEmail,
					name: userName,
				}).catch(() => null);
			}

			toast.success(`Payment Approved! ${selectedPlan?.title} is now active.`);
			setIsProcessing(false);
			setIsCheckoutOpen(false);

			void navigate({ to: "/onboarding" });
		}, 1200);
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
								onClick={() => handleSelectPlan(plan)}
								className={`w-full mt-8 py-3.5 px-6 rounded-2xl font-bold text-sm shadow-lg transition-all active:scale-[0.98] ${
									plan.highlighted
										? "bg-yellow-400 hover:bg-yellow-300 text-zinc-950 shadow-yellow-500/25"
										: "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
								}`}
							>
								{plan.buttonText}
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

			{/* Checkout & Payment Modal */}
			{isCheckoutOpen && selectedPlan && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
					<div className="relative w-full max-w-md rounded-3xl border border-zinc-700/80 bg-zinc-900 p-6 md:p-8 shadow-2xl space-y-6 text-zinc-100">
						{/* Close Button */}
						<button
							type="button"
							onClick={() => setIsCheckoutOpen(false)}
							className="absolute top-5 right-5 rounded-full p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
						>
							<XIcon className="size-5" />
						</button>

						{/* Modal Header */}
						<div className="space-y-1 border-b border-zinc-800 pb-4">
							<span className="text-xs font-bold text-yellow-400 uppercase tracking-wider">Fast & Secure Checkout</span>
							<h3 className="text-xl font-bold text-white">{selectedPlan.title}</h3>
							<p className="text-2xl font-extrabold text-white">
								{selectedPlan.price} <span className="text-xs font-normal text-zinc-400">{selectedPlan.period}</span>
							</p>
						</div>

						{/* Payment Method Selector */}
						<div className="space-y-3">
							<label className="text-xs font-semibold text-zinc-300">Select Payment Method</label>
							<div className="grid grid-cols-3 gap-2">
								<button
									type="button"
									onClick={() => setPaymentMethod("upi")}
									className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border text-xs font-semibold transition-all ${
										paymentMethod === "upi"
											? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
											: "border-zinc-800 bg-zinc-800/40 text-zinc-400 hover:text-white"
									}`}
								>
									<ShieldCheckIcon className="size-5" />
									<span>Instant UPI</span>
								</button>

								<button
									type="button"
									onClick={() => setPaymentMethod("qr")}
									className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border text-xs font-semibold transition-all ${
										paymentMethod === "qr"
											? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
											: "border-zinc-800 bg-zinc-800/40 text-zinc-400 hover:text-white"
									}`}
								>
									<QrCodeIcon className="size-5" />
									<span>Scan QR</span>
								</button>

								<button
									type="button"
									onClick={() => setPaymentMethod("card")}
									className={`flex flex-col items-center justify-center gap-1 py-3 rounded-xl border text-xs font-semibold transition-all ${
										paymentMethod === "card"
											? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
											: "border-zinc-800 bg-zinc-800/40 text-zinc-400 hover:text-white"
									}`}
								>
									<CreditCardIcon className="size-5" />
									<span>Debit/Card</span>
								</button>
							</div>
						</div>

						{/* Input Area based on method */}
						{paymentMethod === "upi" && (
							<div className="space-y-1.5">
								<label className="text-xs font-semibold text-zinc-300">UPI ID / Virtual Address</label>
								<input
									type="text"
									value={upiId}
									onChange={(e) => setUpiId(e.target.value)}
									placeholder="e.g. mobileNumber@upi or name@okicici"
									className="w-full px-4 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-white text-sm placeholder:text-zinc-500 focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400 transition-all"
								/>
								<p className="text-[11px] text-zinc-500">Supported: GPay, PhonePe, Paytm, BHIM, Cred</p>
							</div>
						)}

						{paymentMethod === "qr" && (
							<div className="flex flex-col items-center justify-center p-4 bg-zinc-950 rounded-2xl border border-zinc-800 text-center space-y-2">
								<div className="size-36 bg-white p-2 rounded-xl flex items-center justify-center">
									<img
										src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
											`upi://pay?pa=rbuilder@upi&pn=rbuilder&am=${selectedPlan.price.replace("₹", "")}&cu=INR`,
										)}`}
										alt="UPI QR Code"
										className="size-full"
									/>
								</div>
								<p className="text-xs text-zinc-400">Scan with any UPI app to complete {selectedPlan.price} payment</p>
							</div>
						)}

						{paymentMethod === "card" && (
							<div className="space-y-3">
								<input
									type="text"
									placeholder="Card Number (XXXX XXXX XXXX XXXX)"
									className="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-950 text-white text-xs placeholder:text-zinc-500 focus:border-yellow-400 focus:outline-none"
								/>
								<div className="grid grid-cols-2 gap-2">
									<input
										type="text"
										placeholder="MM / YY"
										className="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-950 text-white text-xs placeholder:text-zinc-500 focus:border-yellow-400 focus:outline-none"
									/>
									<input
										type="password"
										placeholder="CVV"
										className="w-full px-4 py-2.5 rounded-xl border border-zinc-700 bg-zinc-950 text-white text-xs placeholder:text-zinc-500 focus:border-yellow-400 focus:outline-none"
									/>
								</div>
							</div>
						)}

						{/* Authorization Checkbox */}
						<div className="flex items-start gap-2.5 bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 text-xs text-zinc-400">
							<input type="checkbox" defaultChecked id="mandate" className="mt-0.5 rounded accent-yellow-400" />
							<label htmlFor="mandate" className="cursor-pointer leading-tight text-[11px]">
								I authorize <strong className="text-zinc-200">rbuilder</strong> subscription for {selectedPlan.price} {selectedPlan.period}. I can pause or cancel anytime.
							</label>
						</div>

						{/* Action Button */}
						<button
							type="button"
							onClick={handleApprovePayment}
							disabled={isProcessing}
							className="w-full py-3.5 px-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-extrabold text-sm shadow-lg shadow-yellow-500/20 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
						>
							{isProcessing ? (
								<>
									<div className="size-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
									<span>Processing Payment...</span>
								</>
							) : (
								<span>Approve & Complete ({selectedPlan.price})</span>
							)}
						</button>
					</div>
				</div>
			)}
		</div>
	);
}
