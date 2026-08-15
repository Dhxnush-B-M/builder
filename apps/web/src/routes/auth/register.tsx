import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterPage } from "@/features/auth/pages/register";

export const Route = createFileRoute("/auth/register")({
	component: RouteComponent,
	beforeLoad: ({ context }) => {
		if (typeof window !== "undefined") {
			const localUser = localStorage.getItem("rbuilder_user");
			const supabaseUser = localStorage.getItem("rbuilder_supabase_user");
			const userEmail = localStorage.getItem("rbuilder_user_email");
			if (localUser || supabaseUser || userEmail) {
				throw redirect({ to: "/dashboard/resumes", replace: true });
			}
		}
		if (context.session) throw redirect({ to: "/dashboard/resumes", replace: true });
		if (context.flags.disableSignups) throw redirect({ to: "/auth/login", replace: true });
		return { session: null };
	},
});

function RouteComponent() {
	const { flags } = Route.useRouteContext();

	return <RegisterPage disableEmailAuth={flags.disableEmailAuth} />;
}
