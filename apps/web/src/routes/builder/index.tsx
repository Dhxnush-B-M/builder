import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";
import { useResumeCleanup, useResumeStore } from "@/features/resume/builder/draft";
import { initializeStylesheetStore, useStylesheetStore } from "@/features/resume/stylesheet/store";
import { createSampleResumeData } from "@reactive-resume/schema/resume/sample";
import { createNoindexFollowMeta } from "@/libs/seo";
import { DesktopBuilderShell } from "./$resumeId/-components/desktop-builder-shell";
import { MobileBuilderShell } from "./$resumeId/-components/mobile-builder-shell";
import { getBuilderLayout, type BuilderLayout } from "./$resumeId/-store/sidebar";

export const Route = createFileRoute("/builder/")({
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
	const resumeId = "main";

	const sampleData = useMemo(() => createSampleResumeData(), []);
	const resume = useMemo(
		() => ({
			id: resumeId,
			name: "My Resume",
			slug: "my-resume",
			tags: [],
			data: sampleData,
			isPublic: true,
			isLocked: false,
			hasPassword: false,
			updatedAt: new Date(),
		}),
		[resumeId, sampleData],
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
