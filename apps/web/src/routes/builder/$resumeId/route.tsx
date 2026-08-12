import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useResumeCleanup, useResumeStore } from "@/features/resume/builder/draft";
import { initializeStylesheetStore, useStylesheetStore } from "@/features/resume/stylesheet/store";
import { defaultResumeData } from "@reactive-resume/schema/resume/default";
import { createNoindexFollowMeta } from "@/libs/seo";
import { DesktopBuilderShell } from "./-components/desktop-builder-shell";
import { MobileBuilderShell } from "./-components/mobile-builder-shell";
import { getBuilderLayout, type BuilderLayout } from "./-store/sidebar";

export const Route = createFileRoute("/builder/$resumeId")({
	component: RouteComponent,
	loader: async () => {
		const layout = await getBuilderLayout();
		return { layout, name: "My Resume" };
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

	// Clean default resume structure with 0 fake/demo items or pre-filled duplicate details
	const cleanData = useMemo(() => structuredClone(defaultResumeData), []);
	const resume = useMemo(
		() => ({
			id: resumeId,
			name: "My Resume",
			slug: "my-resume",
			tags: [],
			data: cleanData,
			isPublic: true,
			isLocked: false,
			hasPassword: false,
			updatedAt: new Date(),
		}),
		[resumeId, cleanData],
	);

	const initializeResumeStore = useResumeStore((state) => state.initialize);
	const isReady = useResumeStore((state) => state.isReady);
	const initializedResumeId = useResumeStore((state) => state.resumeId);
	const isInitialized = isReady && initializedResumeId === resumeId;
	const isStylesheetInitialized = useStylesheetStore((state) => state.resumeId === resumeId);

	useResumeCleanup();

	useEffect(() => {
		if (isInitialized) return;
		initializeResumeStore(resume);
	}, [initializeResumeStore, isInitialized, resume]);

	useEffect(() => {
		if (!isInitialized) return;
		return initializeStylesheetStore({
			resumeId,
			initial: null,
			resumeData: resume.data,
		});
	}, [isInitialized, resumeId, resume.data]);

	if (!isInitialized || !isStylesheetInitialized) return null;

	return <BuilderLayoutShell initialLayout={initialLayout} />;
}

function BuilderLayoutShell({ initialLayout }: { initialLayout: BuilderLayout }) {
	const isMobile = useMediaQuery("(max-width: 767px)", { initializeWithValue: false });

	if (isMobile) return <MobileBuilderShell />;
	return <DesktopBuilderShell initialLayout={initialLayout} />;
}
