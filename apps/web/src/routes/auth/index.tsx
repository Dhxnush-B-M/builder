import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/")({
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
		throw redirect({ to: "/auth/login", replace: true });
	},
});
