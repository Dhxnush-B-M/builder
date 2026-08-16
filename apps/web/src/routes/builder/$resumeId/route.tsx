import type { BuilderLayout } from "./-store/sidebar";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useMediaQuery } from "usehooks-ts";
import { defaultResumeData } from "@rbuilder/schema/resume/default";
import { useResumeCleanup, useResumeStore } from "@/features/resume/builder/draft";
import { initializeStylesheetStore, useStylesheetStore } from "@/features/resume/stylesheet/store";
import { getLocalResumes } from "@/libs/resume/local-storage";
import { createNoindexFollowMeta } from "@/libs/seo";
import { DesktopBuilderShell } from "./-components/desktop-builder-shell";
import { MobileBuilderShell } from "./-components/mobile-builder-shell";
import { getBuilderLayout } from "./-store/sidebar";

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

	// Load existing saved resume if present in local storage
	const savedResume = useMemo(() => {
		const list = getLocalResumes();
		return list.find((r) => r.id === resumeId);
	}, [resumeId]);

	const resumeData = useMemo(() => savedResume?.data || structuredClone(defaultResumeData), [savedResume]);

	const resume = useMemo(
		() => ({
			id: resumeId,
			name: savedResume?.name || "My Resume",
			slug: savedResume?.slug || "my-resume",
			tags: savedResume?.tags || [],
			data: resumeData,
			isPublic: true,
			isLocked: false,
			hasPassword: false,
			updatedAt: savedResume?.updatedAt || new Date(),
		}),
		[resumeId, savedResume, resumeData],
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
