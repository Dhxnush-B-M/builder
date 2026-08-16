import { t } from "@lingui/core/macro";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@rbuilder/ui/components/button";
import { Skeleton } from "@rbuilder/ui/components/skeleton";
import { cn } from "@rbuilder/utils/style";
import { authClient } from "@/libs/auth/client";

type SocialAuthProps = {
	requestSignUp?: boolean;
};

type SocialSignInOptions = {
	provider: string;
	callbackURL: string;
	requestSignUp?: true;
};

function getSocialSignInOptions(provider: string, requestSignUp: boolean): SocialSignInOptions {
	const callbackURL =
		typeof window !== "undefined" ? `${window.location.origin}/dashboard` : "https://rbuilder.space/dashboard";
	const options: SocialSignInOptions = { provider, callbackURL };
	if (requestSignUp) options.requestSignUp = true;
	return options;
}

function GoogleColorIcon({ className }: { className?: string }) {
	return (
		<svg viewBox="0 0 24 24" className={cn("size-5 shrink-0", className)} aria-hidden="true">
			<path
				fill="#4285F4"
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
			/>
			<path
				fill="#34A853"
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
			/>
			<path
				fill="#FBBC05"
				d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.62z"
			/>
			<path
				fill="#EA4335"
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
			/>
		</svg>
	);
}

export function SocialAuth({ requestSignUp = false }: SocialAuthProps) {
	return (
		<div className="flex w-full flex-col gap-y-3">
			<SocialAuthButtons requestSignUp={requestSignUp} />
		</div>
	);
}

function _SocialAuthSkeleton() {
	return (
		<div className="flex w-full flex-col gap-3">
			<Skeleton className="h-11 w-full rounded-xl" />
		</div>
	);
}

type SocialAuthButtonsProps = {
	requestSignUp: boolean;
};

function SocialAuthButtons({ requestSignUp }: SocialAuthButtonsProps) {
	const router = useRouter();

	const runSignIn = async (fn: () => Promise<{ error: { message?: string } | null }>) => {
		const toastId = toast.loading(t`Signing in with Google...`);
		try {
			const { error } = await fn();
			if (error) {
				if (error.message?.toLowerCase().includes("provider not found")) {
					toast.error(
						t`Google OAuth is not configured in .env yet. Please paste your GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET into .env!`,
						{ id: toastId, duration: 6000 },
					);
					return;
				}
				toast.error(
					error.message ||
						t({
							comment: "Fallback toast when sign-in fails without an error message",
							message: "Failed to sign in. Please try again.",
						}),
					{ id: toastId },
				);
				return;
			}
			toast.dismiss(toastId);
			await router.invalidate();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : t`Failed to sign in. Please try again.`, { id: toastId });
		}
	};

	const handleGoogleSignIn = () => {
		void runSignIn(() => authClient.signIn.social(getSocialSignInOptions("google", requestSignUp)));
	};

	return (
		<div className="flex w-full flex-col gap-3">
			{/* Primary Google OAuth 2.0 CTA Button */}
			<Button
				type="button"
				size="lg"
				onClick={handleGoogleSignIn}
				className="h-11 w-full justify-center gap-3 rounded-xl border border-input bg-background font-semibold text-foreground text-sm shadow-xs transition-all hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.99]"
			>
				<GoogleColorIcon />
				<span>{requestSignUp ? "Sign up with Google" : "Continue with Google"}</span>
			</Button>
		</div>
	);
}
