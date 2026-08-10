import { Trans } from "@lingui/react/macro";
import { SocialAuth } from "../components/social-auth";

export function LoginPage() {
	return (
		<div className="space-y-6 text-center">
			<div className="space-y-2">
				<h1 className="font-bold text-2xl tracking-tight">
					<Trans comment="Title on the login page">Sign in to your account</Trans>
				</h1>
				<p className="text-muted-foreground text-sm">
					<Trans>Sign in with Google to access your resume builder & dashboard.</Trans>
				</p>
			</div>

			<SocialAuth />
		</div>
	);
}
