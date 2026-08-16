import { t } from "@lingui/core/macro";
import { UserCircleIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { Separator } from "@rbuilder/ui/components/separator";
import { ProfileSettingsPage } from "@/features/settings/pages/profile";
import { DashboardHeader } from "../-components/header";

type AuthSession = any;

export const Route = createFileRoute("/dashboard/settings/profile")({
	component: RouteComponent,
});

function RouteComponent() {
	const { session } = Route.useRouteContext();

	const activeSession: AuthSession = session?.user
		? (session as AuthSession)
		: {
				user: {
					id: "guest-user",
					name: "Guest User",
					email: "guest@rbuilder.com",
					username: "guest",
					displayUsername: "guest",
					emailVerified: true,
					createdAt: new Date(),
					updatedAt: new Date(),
				},
				session: {
					id: "guest-session",
					userId: "guest-user",
					token: "",
					expiresAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			};

	return (
		<div className="space-y-4">
			<DashboardHeader icon={UserCircleIcon} title={t`Profile`} />

			<Separator />

			<ProfileSettingsPage session={activeSession} />
		</div>
	);
}
