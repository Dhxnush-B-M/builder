import { t } from "@lingui/core/macro";
import { SlidersHorizontalIcon } from "@phosphor-icons/react";
import { createFileRoute } from "@tanstack/react-router";
import { Separator } from "@rbuilder/ui/components/separator";
import { PreferencesSettingsPage } from "@/features/settings/pages/preferences";
import { DashboardHeader } from "../-components/header";

export const Route = createFileRoute("/dashboard/settings/preferences")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="space-y-4">
			<DashboardHeader icon={SlidersHorizontalIcon} title={t`Predilection`} />

			<Separator />

			<PreferencesSettingsPage />
		</div>
	);
}
