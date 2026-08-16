import { Trans } from "@lingui/react/macro";
import { createFileRoute, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { SidebarProvider } from "@rbuilder/ui/components/sidebar";
import { getSession } from "@/libs/auth/session";
import { createNoindexFollowMeta } from "@/libs/seo";
import { supabase } from "@/libs/supabase/client";
import { checkUserSubscriptionAndOnboardingFromSupabase } from "@/libs/supabase/db";
import { getDashboardSidebarState, setDashboardSidebarState } from "./-components/functions";
import { DashboardSidebar } from "./-components/sidebar";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: () => {
		if (typeof window !== "undefined") {
			const localUser = localStorage.getItem("rbuilder_user");
			const supabaseUser = localStorage.getItem("rbuilder_supabase_user");
			const storedEmail = localStorage.getItem("rbuilder_user_email");
			const userEmail =
				storedEmail ||
				(localUser ? JSON.parse(localUser).email : "") ||
				(supabaseUser ? JSON.parse(supabaseUser).email : "");

			if (!userEmail) {
				throw redirect({ to: "/auth/login", replace: true });
			}
		}
	},
	loader: () => {
		const sidebarState = getDashboardSidebarState();
		return { sidebarState };
	},
	head: () => ({
		meta: [createNoindexFollowMeta()],
	}),
});

function RouteComponent() {
	const router = useRouter();
	const { sidebarState } = Route.useLoaderData();

	const handleSidebarOpenChange = (open: boolean) => {
		setDashboardSidebarState(open);
		void router.invalidate();
	};

	return (
		<div className="relative min-h-screen w-full overflow-hidden bg-background">
			{/* Ambient Glassy Background Blobs */}
			<div aria-hidden="true" className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-30">
				<div className="size-[700px] animate-pulse rounded-full bg-gradient-to-tr from-blue-600/20 via-indigo-600/20 to-purple-600/20 blur-3xl" />
			</div>
			<div aria-hidden="true" className="pointer-events-none fixed top-10 left-10 opacity-20">
				<div className="size-[400px] rounded-full bg-gradient-to-br from-emerald-500/20 to-teal-500/20 blur-3xl" />
			</div>

			<SidebarProvider open={sidebarState} onOpenChange={handleSidebarOpenChange}>
				<a
					href="#main-content"
					className="sr-only rounded-md bg-popover px-4 py-2 text-sm ring-2 ring-ring focus:not-sr-only focus:absolute focus:inset-s-2 focus:top-2 focus:z-[100]"
				>
					<Trans>Skip to main content</Trans>
				</a>

				<DashboardSidebar />

				<main id="main-content" className="@container relative z-10 flex-1 p-4 md:ps-2">
					<div className="min-h-[calc(100vh-2rem)] rounded-3xl border border-white/10 bg-background/50 p-6 shadow-2xl backdrop-blur-2xl">
						<Outlet />
					</div>
				</main>
			</SidebarProvider>
		</div>
	);
}
