import { Trans } from "@lingui/react/macro";
import { createFileRoute, Outlet, redirect, useRouter } from "@tanstack/react-router";
import { SidebarProvider } from "@rbuilder/ui/components/sidebar";
import { createNoindexFollowMeta } from "@/libs/seo";
import { supabase } from "@/libs/supabase/client";
import { getSession } from "@/libs/auth/session";
import { getDashboardSidebarState, setDashboardSidebarState } from "./-components/functions";
import { DashboardSidebar } from "./-components/sidebar";

import { checkUserSubscriptionAndOnboardingFromSupabase } from "@/libs/supabase/db";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		if (typeof window !== "undefined") {
			const paymentStatus = localStorage.getItem("rbuilder_payment_status");
			const onboardingCompleted = localStorage.getItem("rbuilder_onboarding_completed");
			if (paymentStatus === "active" && onboardingCompleted === "true") {
				return; // Instant access, no network delays
			}
		}

		let isAuth = false;
		let userEmail = "";
		if (typeof window !== "undefined") {
			const localUser = localStorage.getItem("rbuilder_user");
			const supabaseUser = localStorage.getItem("rbuilder_supabase_user");
			const storedEmail = localStorage.getItem("rbuilder_user_email");
			if (localUser || supabaseUser || storedEmail) {
				isAuth = true;
				userEmail = storedEmail || (localUser ? JSON.parse(localUser).email : "") || (supabaseUser ? JSON.parse(supabaseUser).email : "");
			}
		}
		if (!isAuth) {
			const { data } = await supabase.auth.getSession().catch(() => ({ data: { session: null } }));
			if (data?.session?.user) {
				isAuth = true;
				userEmail = data.session.user.email || "";
			}
		}
		if (!isAuth) {
			let session = context.session;
			if (!session || session.user?.id === "guest-user") {
				session = await getSession().catch(() => null);
			}
			if (session?.user && session.user.id !== "guest-user") {
				isAuth = true;
				userEmail = session.user.email || "";
			}
		}
		if (!isAuth) {
			throw redirect({ to: "/auth/login", replace: true });
		}

		if (userEmail) {
			const { paid, onboarded } = await checkUserSubscriptionAndOnboardingFromSupabase(userEmail);
			if (!paid) {
				throw redirect({ to: "/payment", replace: true });
			}
			if (!onboarded) {
				throw redirect({ to: "/onboarding", replace: true });
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

				<main id="main-content" className="relative z-10 @container flex-1 p-4 md:ps-2">
					<div className="min-h-[calc(100vh-2rem)] rounded-3xl border border-white/10 bg-background/50 p-6 shadow-2xl backdrop-blur-2xl">
						<Outlet />
					</div>
				</main>
			</SidebarProvider>
		</div>
	);
}
