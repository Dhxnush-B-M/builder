import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useEffect, useMemo, useRef } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useBuilderResumeUpdateSubscription, useResumeCleanup, useResumeStore } from "@/features/resume/builder/draft";
import { initializeStylesheetStore, useStylesheetStore } from "@/features/resume/stylesheet/store";
import { createSampleResumeData } from "@reactive-resume/schema/resume/sample";
import { defaultResumeData } from "@reactive-resume/schema/resume/default";
import { getSession } from "@/libs/auth/session";
import { orpc } from "@/libs/orpc/client";
import { createNoindexFollowMeta } from "@/libs/seo";
import { DesktopBuilderShell } from "./-components/desktop-builder-shell";
import { MobileBuilderShell } from "./-components/mobile-builder-shell";
import { getBuilderLayout } from "./-store/sidebar";

export const Route = createFileRoute("/builder/$resumeId")({
	component: RouteComponent,
	beforeLoad: async ({ context }) => {
		const session = context.session ?? (await getSession().catch(() => null));
		return { session };
	},
	loader: async ({ params, context }) => {
		const layout = await getBuilderLayout();
		let resumeName = "Resume";
		let resumeData = createSampleResumeData();

		try {
			const [resume] = await Promise.all([
				context.queryClient.ensureQueryData(orpc.resume.getById.queryOptions({ input: { id: params.resumeId } })),
				context.queryClient.ensureQueryData(
					orpc.resume.stylesheet.getState.queryOptions({ input: { id: params.resumeId } }),
				),
			]);
			resumeName = resume.name;
		} catch {
			// Standalone client mode: use sample resume data locally
			resumeName = "My Resume";
		}

		return { layout, name: resumeName };
	},
	head: ({ loaderData }) => ({
		meta: loaderData
			? [{ title: `${loaderData.name} - rbuilder` }, createNoindexFollowMeta()]
			: [createNoindexFollowMeta()],
	}),
});

function RouteComponent() {
	const { layout: initialLayout } = Route.useLoaderData();

	const { resumeId } = Route.useParams();
	const { data: remoteResume } = useQuery(orpc.resume.getById.queryOptions({ input: { id: resumeId } }));
	const { data: remoteStylesheet } = useQuery(
		orpc.resume.stylesheet.getState.queryOptions({ input: { id: resumeId } }),
	);

	const sampleData = useMemo(() => createSampleResumeData(), []);
	const resume = remoteResume ?? {
		id: resumeId,
		name: "My Resume",
		slug: "my-resume",
		tags: [],
		data: sampleData,
		isPublic: true,
		isLocked: false,
		hasPassword: false,
		updatedAt: new Date(),
	};
	const stylesheet = remoteStylesheet ?? null;

	const initializeResumeStore = useResumeStore((state) => state.initialize);
	const mergeResumeMetadata = useResumeStore((state) => state.mergeResumeMetadata);
	const isReady = useResumeStore((state) => state.isReady);
	const initializedResumeId = useResumeStore((state) => state.resumeId);
	const isInitialized = isReady && initializedResumeId === resumeId;
	const isStylesheetInitialized = useStylesheetStore((state) => state.resumeId === resumeId);
	const stylesheetInitialization = useRef({ resume, stylesheet });
	stylesheetInitialization.current = { resume, stylesheet };

	useResumeCleanup();
	useBuilderResumeUpdateSubscription();

	useEffect(() => {
		if (isInitialized) return;
		initializeResumeStore(resume);
	}, [initializeResumeStore, isInitialized, resume]);

	useEffect(() => {
		if (!isInitialized) return;
		const initial = stylesheetInitialization.current;
		return initializeStylesheetStore({
			resumeId,
			initial: initial.stylesheet,
			resumeData: initial.resume.data,
		});
	}, [isInitialized, resumeId]);

	useEffect(() => {
		mergeResumeMetadata(resume);
	}, [
		mergeResumeMetadata,
		resume.id,
		resume.name,
		resume.slug,
		resume.tags,
		resume.isLocked,
		resume.isPublic,
		resume.hasPassword,
		resume.updatedAt,
		resume,
	]);

	if (!isInitialized || !isStylesheetInitialized) return null;

	return <BuilderLayoutShell initialLayout={initialLayout} />;
}

function BuilderLayoutShell({ initialLayout }: { initialLayout: BuilderLayout }) {
	// Single breakpoint (below `md`) switches between the desktop resizable panels and the mobile tabbed shell.
	const isMobile = useMediaQuery("(max-width: 767px)", { initializeWithValue: false });

	if (isMobile) return <MobileBuilderShell />;
	return <DesktopBuilderShell initialLayout={initialLayout} />;
}
