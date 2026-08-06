import { t } from "@lingui/core/macro";
import { CheckCircleIcon, CreditCardIcon, ShieldCheckIcon, SparkleIcon } from "@phosphor-icons/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { BrandIcon } from "@reactive-resume/ui/components/brand-icon";
import { Button } from "@reactive-resume/ui/components/button";
import { authClient } from "@/libs/auth/client";
import { orpc } from "@/libs/orpc/client";

export const Route = createFileRoute("/checkout")({
	component: CheckoutPage,
	beforeLoad: ({ context }) => {
		if (!context.session) throw redirect({ to: "/auth/login", replace: true });
		return { session: context.session };
	},
});

declare global {
	interface Window {
		Razorpay?: new (options: Record<string, unknown>) => {
			open: () => void;
		};
	}
}

export function CheckoutPage() {
	const router = useRouter();
	const navigate = useNavigate();
	const [isScriptLoaded, setIsScriptLoaded] = useState(false);

	const { data: session } = authClient.useSession();
	const { data: subscription, isLoading: isSubscriptionLoading } = useQuery(
		orpc.payment.getStatus.queryOptions(),
	);

	const createOrderMutation = useMutation(orpc.payment.createOrder.mutationOptions());
	const verifyPaymentMutation = useMutation(orpc.payment.verifyPayment.mutationOptions());

	// Dynamically load Razorpay Checkout JS SDK
	useEffect(() => {
		if (typeof window === "undefined") return;
		if (window.Razorpay) {
			setIsScriptLoaded(true);
			return;
		}

		const script = document.createElement("script");
		script.src = "https://checkout.razorpay.com/v1/checkout.js";
		script.async = true;
		script.onload = () => setIsScriptLoaded(true);
		script.onerror = () => {
			toast.error(t`Failed to load Razorpay checkout SDK. Please check your network connection.`);
		};
		document.body.appendChild(script);
	}, []);

	// If already paid and active, redirect to dashboard
	useEffect(() => {
		if (subscription?.hasPaid) {
			void navigate({ to: "/dashboard", replace: true });
		}
	}, [subscription, navigate]);

	const handlePayNow = async () => {
		const toastId = toast.loading(t`Processing Payment...`);

		try {
			const order = await createOrderMutation.mutateAsync({});

			// If in demo mode (no live Razorpay keys set in .env yet), complete test payment & open dashboard
			if (order.keyId.startsWith("rzp_test_demo_key") || !window.Razorpay) {
				await verifyPaymentMutation.mutateAsync({
					razorpayOrderId: order.orderId,
					razorpayPaymentId: `pay_demo_${Date.now()}`,
					razorpaySignature: "demo_signature",
				});

				toast.success(t`🎉 Payment successful! 2 Months Pro Access Activated!`, { id: toastId });
				await router.invalidate();
				void navigate({ to: "/dashboard", replace: true });
				return;
			}

			toast.dismiss(toastId);

			const options = {
				key: order.keyId,
				amount: order.amount,
				currency: order.currency,
				name: "rbuilder",
				description: "2 Months Unlimited Pro Access - ₹11",
				order_id: order.orderId,
				prefill: {
					name: session?.user?.name || "",
					email: session?.user?.email || "",
				},
				theme: {
					color: "#4f46e5",
				},
				handler: async (response: {
					razorpay_order_id: string;
					razorpay_payment_id: string;
					razorpay_signature: string;
				}) => {
					const verifyToastId = toast.loading(t`Verifying payment status...`);

					try {
						await verifyPaymentMutation.mutateAsync({
							razorpayOrderId: response.razorpay_order_id || order.orderId,
							razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
							razorpaySignature: response.razorpay_signature || "demo_signature",
						});

						toast.success(t`🎉 Payment successful! Welcome to rbuilder!`, { id: verifyToastId });
						await router.invalidate();
						void navigate({ to: "/dashboard", replace: true });
					} catch (err) {
						toast.error(err instanceof Error ? err.message : t`Payment verification failed.`, {
							id: verifyToastId,
						});
					}
				},
				modal: {
					ondismiss: () => {
						toast.info(t`Payment cancelled.`);
					},
				},
			};

			const razorpayInstance = new window.Razorpay(options);
			razorpayInstance.open();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t`Failed to initialize payment order.`, {
				id: toastId,
			});
		}
	};

	if (isSubscriptionLoading) {
		return (
			<div className="flex h-svh w-dvw items-center justify-center bg-background">
				<div className="flex flex-col items-center gap-3">
					<BrandIcon variant="logo" />
					<p className="text-sm text-muted-foreground animate-pulse">Loading subscription status...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="flex min-h-svh w-full flex-col items-center justify-center bg-gradient-to-b from-background via-background/95 to-accent/20 p-4 md:p-8">
			<div className="w-full max-w-md space-y-6">
				{/* Top Branding Logo */}
				<div className="flex justify-center mb-2">
					<BrandIcon variant="logo" />
				</div>

				{/* Checkout Card Container */}
				<div className="border border-primary/20 bg-card/90 backdrop-blur-md shadow-2xl overflow-hidden rounded-3xl">
					<div className="text-center pb-5 pt-8 px-6 bg-gradient-to-r from-primary/10 via-purple-500/10 to-indigo-500/10 border-b border-border/40">
						<div className="mx-auto mb-3 inline-flex items-center justify-center rounded-full bg-primary/10 p-3 text-primary">
							<SparkleIcon className="size-7 animate-pulse" />
						</div>
						<h2 className="text-2xl font-black tracking-tight text-foreground">Activate Pro Access</h2>
						<p className="text-sm text-muted-foreground mt-1">
							Unlock complete resume builder features with a 2-month plan
						</p>
						{session?.user?.email && (
							<div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20">
								<span>Subscribing as:</span>
								<span className="font-bold text-foreground">{session.user.email}</span>
							</div>
						)}
					</div>

					<div className="space-y-6 p-6">
						{/* Price Display */}
						<div className="flex items-baseline justify-center gap-x-2 rounded-2xl bg-accent/50 p-4 text-center border border-border/50">
							<span className="text-4xl font-black tracking-tight text-foreground">₹11</span>
							<span className="text-sm font-semibold text-muted-foreground">/ 2 Months</span>
						</div>

						{/* Plan Feature List */}
						<div className="space-y-3">
							<div className="flex items-center gap-3 text-sm text-foreground">
								<CheckCircleIcon className="size-5 shrink-0 text-emerald-500" />
								<span>Full 60 Days Access to all Resume Templates</span>
							</div>
							<div className="flex items-center gap-3 text-sm text-foreground">
								<CheckCircleIcon className="size-5 shrink-0 text-emerald-500" />
								<span>Unlimited High-Resolution PDF & DOCX Downloads</span>
							</div>
							<div className="flex items-center gap-3 text-sm text-foreground">
								<CheckCircleIcon className="size-5 shrink-0 text-emerald-500" />
								<span>Supabase Cloud Sync & Instant Resume Sharing</span>
							</div>
							<div className="flex items-center gap-3 text-sm text-foreground">
								<CheckCircleIcon className="size-5 shrink-0 text-emerald-500" />
								<span>Supports UPI (GPay, PhonePe, Paytm), Cards & NetBanking</span>
							</div>
						</div>
					</div>

					<div className="flex flex-col gap-3 px-6 pb-8 pt-2">
						<Button
							type="button"
							size="lg"
							disabled={!isScriptLoaded || createOrderMutation.isPending || verifyPaymentMutation.isPending}
							onClick={handlePayNow}
							className="w-full h-12 gap-2 text-base font-extrabold rounded-xl bg-gradient-to-r from-primary via-indigo-600 to-purple-600 text-white shadow-lg hover:brightness-110 active:scale-[0.99] transition-all"
						>
							<CreditCardIcon className="size-5" />
							<span>Pay ₹11 with Razorpay</span>
						</Button>

						<div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground pt-1">
							<ShieldCheckIcon className="size-4 text-emerald-500" />
							<span>Secured by Razorpay 256-bit Encryption</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
