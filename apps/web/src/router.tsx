import { createRouter } from "@tanstack/react-router";
import { ErrorScreen } from "./components/layout/error-screen";
import { LoadingScreen } from "./components/layout/loading-screen";
import { NotFoundScreen } from "./components/layout/not-found-screen";
import { getSession } from "./libs/auth/session";
import { getLocale, loadLocale } from "./libs/locale";
import { client, orpc } from "./libs/orpc/client";
import { getQueryClient } from "./libs/query/client";
import { getTheme } from "./libs/theme";
import { routeTree } from "./routeTree.gen";

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

	let session: AuthSession | null = null;
	try {
		session = await getSession();
	} catch {
		session = null;
	}

	let flags = defaultFlags;
	try {
		flags = await client.flags.get();
	} catch {
		flags = defaultFlags;
	}

	const router = createRouter({
		routeTree,
		scrollRestoration: true,
		defaultViewTransition: true,
		defaultStructuralSharing: true,
		defaultErrorComponent: ErrorScreen,
		defaultPendingComponent: LoadingScreen,
		defaultNotFoundComponent: NotFoundScreen,
		context: { orpc, queryClient, theme, locale, session, flags },
	});

	return router;
};
