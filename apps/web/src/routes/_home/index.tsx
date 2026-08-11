import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_home/")({
	beforeLoad: () => {
		throw redirect({ to: "/builder/demo", replace: true });
	},
});
