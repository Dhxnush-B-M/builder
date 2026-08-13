import { msg, t } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import {
	DownloadSimpleIcon,
	GridFourIcon,
	ListIcon,
	MagnifyingGlassIcon,
	PlusIcon,
	ReadCvLogoIcon,
} from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, stripSearchParams, useNavigate } from "@tanstack/react-router";
import { useMemo } from "react";
import z from "zod";
import { Button } from "@rbuilder/ui/components/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@rbuilder/ui/components/input-group";
import { Label } from "@rbuilder/ui/components/label";
import { Separator } from "@rbuilder/ui/components/separator";
import { Tabs, TabsList, TabsTrigger } from "@rbuilder/ui/components/tabs";
import { cn } from "@rbuilder/utils/style";
import { Combobox } from "@/components/ui/combobox";
import { useDialogStore } from "@/dialogs/store";
import { orpc } from "@/libs/orpc/client";
import { DashboardHeader } from "../-components/header";
import { GridView } from "./-components/grid-view";
import { ListView } from "./-components/list-view";
import { getLocalResumes } from "@/libs/resume/local-storage";

type SortOption = "lastUpdatedAt" | "createdAt" | "name";

const searchSchema = z
	.object({
		search: z.string().default(""),
		tags: z.array(z.string()).default([]),
		sort: z.enum(["lastUpdatedAt", "createdAt", "name"]).default("lastUpdatedAt"),
		view: z.enum(["grid", "list"]).default("grid"),
	})
	.passthrough();

type Search = z.output<typeof searchSchema>;

const defaultSearch: Search = { search: "", tags: [], sort: "lastUpdatedAt", view: "grid" };

export const Route = createFileRoute("/dashboard/resumes/")({
	component: RouteComponent,
	validateSearch: searchSchema,
	search: {
		middlewares: [stripSearchParams(defaultSearch)],
	},
});

function RouteComponent() {
	const { i18n } = useLingui();
	const { search, tags, sort, view } = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const { openDialog } = useDialogStore();

	const { data: allTags } = useQuery({ ...orpc.resume.tags.list.queryOptions(), retry: false });
	const { data: resumes } = useQuery({ ...orpc.resume.list.queryOptions({ input: { tags, sort } }), retry: false });

	const localResumes = useMemo(() => getLocalResumes(), []);

	const filteredResumes = useMemo(() => {
		const currentUserStr = typeof window !== "undefined" ? localStorage.getItem("rbuilder_user") : null;
		let all = localResumes;

		// If no local resumes exist yet and user hasn't created any, list is empty for new user
		if (!currentUserStr) {
			const list = [...(resumes ?? []), ...localResumes];
			const uniqueMap = new Map();
			for (const item of list) {
				if (!uniqueMap.has(item.id)) {
					uniqueMap.set(item.id, item);
				}
			}
			all = Array.from(uniqueMap.values());
		}

		const query = search.trim().toLowerCase();
		if (!query) return all;
		return all.filter(
			(resume) => resume.name.toLowerCase().includes(query) || resume.slug.toLowerCase().includes(query),
		);
	}, [resumes, localResumes, search]);

	const tagOptions = useMemo(() => {
		if (!allTags) return [];
		return allTags.map((tag) => ({ value: tag, label: tag }));
	}, [allTags]);

	const sortOptions = useMemo(() => {
		return [
			{ value: "lastUpdatedAt", label: i18n.t(msg`Last Updated`) },
			{ value: "createdAt", label: i18n.t(msg`Created`) },
			{ value: "name", label: i18n.t(msg`Name`) },
		];
	}, [i18n]);

	return (
		<div className="space-y-4">
			<DashboardHeader
				icon={ReadCvLogoIcon}
				title={t`Resumes`}
				actions={
					(resumes?.length ?? 0) > 0 ? (
						<>
							<Button size="sm" variant="outline" onClick={() => openDialog("resume.create", undefined)}>
								<PlusIcon />
								<Trans>Create</Trans>
							</Button>
							<Button size="sm" variant="outline" onClick={() => openDialog("resume.import", undefined)}>
								<DownloadSimpleIcon />
								<Trans>Import</Trans>
							</Button>
						</>
					) : undefined
				}
			/>

			<Separator />

			{view === "list" ? (
				<ListView resumes={filteredResumes} hasResumes={(resumes?.length ?? 0) > 0} />
			) : (
				<GridView resumes={filteredResumes} hasResumes={(resumes?.length ?? 0) > 0} />
			)}
		</div>
	);
}
