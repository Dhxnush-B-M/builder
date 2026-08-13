import type { ResumeData } from "@rbuilder/schema/resume/data";
import type { RouterOutput } from "@/libs/orpc/client";
import { ORPCError } from "@orpc/client";
import { createFileRoute, lazyRouteComponent, notFound, redirect } from "@tanstack/react-router";
import { orpc } from "@/libs/orpc/client";
import { createNoindexFollowMeta, createResumeSocialMeta, getCanonicalRootUrl } from "@/libs/seo";

type LoaderData = Omit<RouterOutput["resume"]["getBySlug"], "data"> & { data: ResumeData };

export const Route = createFileRoute("/$username/$slug")({
	component: lazyRouteComponent(() => import("@/features/resume/public/public-resume"), "PublicResumeRoute"),
	loader: async ({ context, params }) => {
		const { username, slug } = params;
		const reserved = ["auth", "api", "dashboard", "builder", "templates", "assets"];
		if (!username || !slug || reserved.includes(username.toLowerCase())) {
			throw notFound();
		}

		try {
			const resume = await context.queryClient.ensureQueryData(
				orpc.resume.getBySlug.queryOptions({ input: { username, slug } }),
			);

			return { resume: resume as LoaderData };
		} catch (error) {
			if (error instanceof ORPCError && error.code === "NEED_PASSWORD") {
				const data = error.data as { username?: string; slug?: string } | undefined;
				if (data?.username && data?.slug) {
					throw redirect({
						to: "/auth/resume-password",
						search: { redirect: `/${data.username}/${data.slug}` },
					});
				}
			}

			throw notFound();
		}
	},
	head: ({ loaderData, params }) => {
		const resume = loaderData?.resume;
		const name = resume ? resume.data.basics.name || resume.name || "Resume" : "rbuilder";

		if (!resume) {
			return { meta: [{ title: `${name} - rbuilder` }, createNoindexFollowMeta()] };
		}

		const { basics, summary, metadata } = resume.data;
		const socialTitle = basics.headline ? `${name} — ${basics.headline}` : name;
		const summaryText = summary.content
			.replace(/<[^>]+>/g, " ")
			.replace(/\s+/g, " ")
			.trim();
		const description = summaryText || basics.headline || name;

		const base = getCanonicalRootUrl(typeof window === "undefined" ? undefined : window.location.origin);
		const canonicalUrl = `${base}${params.username}/${params.slug}`;
		const imageUrl = `${base}templates/jpg/${metadata.template}.jpg`;

		return {
			meta: [
				{ title: `${name} - rbuilder` },
				createNoindexFollowMeta(),
				...createResumeSocialMeta({ canonicalUrl, title: socialTitle, description, imageUrl }),
			],
			links: [{ rel: "canonical", href: canonicalUrl }],
		};
	},
});
