import { SocialAuth } from "../components/social-auth";

export function LoginPage() {
	return (
		<div className="space-y-6 text-center">
			<div className="space-y-2">
				<h1 className="font-bold text-2xl tracking-tight">Sign in to your account</h1>
				<p className="text-muted-foreground text-sm">Sign in with your Google account to access your builder & dashboard.</p>
			</div>

			<SocialAuth />
		</div>
	);
}
