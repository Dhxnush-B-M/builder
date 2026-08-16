import { createRouter } from "@tanstack/react-router";
import { ErrorScreen } from "./components/layout/error-screen";
import { NotFoundScreen } from "./components/layout/not-found-screen";
import { getLocale, loadLocale } from "./libs/locale";
import { orpc } from "./libs/orpc/client";
import { getQueryClient } from "./libs/query/client";
import { getTheme } from "./libs/theme";
import { routeTree } from "./routeTree.gen";

if (typeof window !== "undefined") {
	window.addEventListener("error", (e) => {
		if (
			e.message?.includes("Failed to fetch dynamically imported module") ||
			e.message?.includes("Failed to load module script")
		) {
			const hasReloaded = sessionStorage.getItem("rbuilder_chunk_reloaded");
			if (!hasReloaded) {
				sessionStorage.setItem("rbuilder_chunk_reloaded", "true");
				window.location.reload();
			}
		}
	});
}

const defaultFlags = {
	disableEmailAuth: false,
	disableSignups: false,
	disableImageProcessing: false,
	disableApiRateLimit: false,
	showSponsors: false,
	allowUnsafeOAuthRedirectUri: false,
	allowUnsafeAiBaseUrl: false,
};

export const getRouter = async () => {
	const queryClient = getQueryClient();
	const theme = getTheme();
	const locale = getLocale();

	await loadLocale(locale);

	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultViewTransition: true,
		defaultStructuralSharing: true,
		defaultPendingMs: 5000,
		defaultPendingMinMs: 0,
		defaultErrorComponent: ErrorScreen,
		defaultPendingComponent: () => null,
		defaultNotFoundComponent: NotFoundScreen,
		context: { orpc, queryClient, theme, locale, session: null, flags: defaultFlags },
	});

	return router;
};
