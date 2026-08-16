import type { ReactElement, ReactNode } from "react";
import { Trans } from "@lingui/react/macro";
import { CircleNotchIcon, DownloadSimpleIcon, FileDocIcon, FilePdfIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@rbuilder/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@rbuilder/ui/components/dialog";
import { cn } from "@rbuilder/utils/style";
import { useResumeExport } from "./use-resume-export";

type DownloadableResume = Parameters<typeof useResumeExport>[0];

type ResumeDownloadDialogProps = {
	resume: DownloadableResume;
	trigger: (disabled: boolean) => ReactElement;
};

type FormatRowProps = {
	action: ReactElement;
	description: ReactNode;
	disabled?: boolean;
	icon: ReactElement;
	title: ReactNode;
};

function FormatRow({ action, description, disabled, icon, title }: FormatRowProps) {
	return (
		<div
			className={cn(
				"flex items-center gap-3 rounded-lg border bg-background p-3 transition-opacity",
				disabled && "opacity-45",
			)}
		>
			<div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
				{icon}
			</div>
			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				<h3 className="font-medium text-sm">{title}</h3>
				<p className="text-muted-foreground text-xs leading-normal">{description}</p>
			</div>
			{action}
		</div>
	);
}

export function ResumeDownloadDialog({ resume, trigger }: ResumeDownloadDialogProps) {
	const [open, setOpen] = useState(false);
	const { isExporting, onDownloadDOCX, onDownloadPDF } = useResumeExport(resume);
	const disabled = !resume || isExporting;

	const run = (action: () => void | Promise<void>) => {
		setOpen(false);
		void action();
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger render={trigger(disabled)} />
			<DialogContent className="gap-5 sm:max-w-lg">
				<DialogHeader className="pe-8">
					<DialogTitle>
						<Trans>Download</Trans>
					</DialogTitle>
					<DialogDescription>
						<Trans>Export your resume or cover letter in the format you need.</Trans>
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-2">
					<FormatRow
						icon={
							isExporting ? <CircleNotchIcon className="size-5 animate-spin" /> : <FilePdfIcon className="size-5" />
						}
						title="PDF"
						description={<Trans>Best for applications, sharing, and printing.</Trans>}
						action={
							<Button
								size="sm"
								aria-label="Download PDF"
								disabled={isExporting}
								onClick={() => run(() => onDownloadPDF("resume"))}
							>
								<DownloadSimpleIcon />
								<Trans>Download</Trans>
							</Button>
						}
					/>

					<FormatRow
						icon={<FileDocIcon className="size-5" />}
						title="DOCX"
						description={<Trans>Editable in Word, Google Docs, and Pages.</Trans>}
						action={
							<Button
								size="sm"
								variant="outline"
								aria-label="Download DOCX"
								disabled={isExporting}
								onClick={() => run(() => onDownloadDOCX("resume"))}
							>
								<DownloadSimpleIcon />
								<Trans>Download</Trans>
							</Button>
						}
					/>
				</div>
			</DialogContent>
		</Dialog>
	);
}
