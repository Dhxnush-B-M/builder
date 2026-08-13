import type { RouterOutput } from "@/libs/orpc/client";
import { Trans } from "@lingui/react/macro";
import { FolderOpenIcon, TrashSimpleIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@rbuilder/ui/components/dropdown-menu";
import { useResumeMenuActions } from "./use-resume-menu-actions";

type Props = Omit<React.ComponentProps<typeof DropdownMenuContent>, "children"> & {
	resume: RouterOutput["resume"]["list"][number];
	children: React.ComponentProps<typeof DropdownMenuTrigger>["render"];
};

export function ResumeDropdownMenu({ resume, children, ...props }: Props) {
	const { handleDelete } = useResumeMenuActions(resume);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={children} />

			<DropdownMenuContent {...props}>
				<DropdownMenuItem
					render={
						<Link to="/builder/$resumeId" params={{ resumeId: resume.id }}>
							<FolderOpenIcon />
							<Trans comment="Resume card dropdown action to open the resume editor">Open</Trans>
						</Link>
					}
				/>

				<DropdownMenuSeparator />

				<DropdownMenuItem variant="destructive" onClick={handleDelete}>
					<TrashSimpleIcon />
					<Trans comment="Resume card dropdown destructive action to remove a resume">Delete</Trans>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
