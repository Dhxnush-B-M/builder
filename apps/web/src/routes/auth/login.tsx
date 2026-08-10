import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "@/features/auth/pages/login";

export const Route = createFileRoute("/auth/login")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (context.session) throw redirect({ to: "/dashboard", replace: true });
		return { session: null };
	},
});

function RouteComponent() {
	return <LoginPage />;
}
