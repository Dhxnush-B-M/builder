import type { ReactNode } from "react";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { SparkleIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "@reactive-resume/ui/components/button";
import { Sheet, SheetContent, SheetTitle } from "@reactive-resume/ui/components/sheet";

type BuilderAiAssistantProps = {
	resumeId: string;
};

function CenteredState({ children }: { children: ReactNode }) {
	return <div className="grid h-full place-items-center p-6 text-center text-muted-foreground text-sm">{children}</div>;
}

function AiAssistantPanel({ onClose }: { onClose: () => void }) {
	return (
		<div className="flex h-full flex-col justify-between p-6">
			<div className="flex items-center justify-between border-b pb-4">
				<div className="flex items-center gap-2">
					<SparkleIcon className="size-5 text-primary" weight="fill" />
					<h3 className="font-bold text-base text-foreground"><Trans>AI Assistant</Trans></h3>
				</div>
				<Button size="icon-sm" variant="ghost" onClick={onClose}>
					<XIcon size={18} />
				</Button>
			</div>

			<CenteredState>
				<div className="space-y-3">
					<SparkleIcon className="mx-auto size-10 text-primary/40" />
					<p className="font-semibold text-foreground"><Trans>rbuilder AI Assistant</Trans></p>
					<p className="text-xs text-muted-foreground max-w-xs">
						<Trans>Use AI suggestions inside section forms to automatically generate and polish resume bullet points.</Trans>
					</p>
				</div>
			</CenteredState>

			<Button onClick={onClose} variant="outline" className="w-full">
				<Trans>Close Assistant</Trans>
			</Button>
		</div>
	);
}

export function BuilderAiAssistant({ resumeId: _resumeId }: BuilderAiAssistantProps) {
	const [open, setOpen] = useState(false);

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<Button
				size="icon"
				variant="ghost"
				aria-label={t`Open AI assistant`}
				aria-pressed={open}
				onClick={() => setOpen(true)}
			>
				<SparkleIcon weight={open ? "fill" : "regular"} />
			</Button>

			<SheetContent
				side="right"
				showCloseButton={false}
				className="w-full max-w-full gap-0 p-0 sm:max-w-md"
			>
				<SheetTitle className="sr-only">
					<Trans>AI assistant</Trans>
				</SheetTitle>
				{open ? <AiAssistantPanel onClose={() => setOpen(false)} /> : null}
			</SheetContent>
		</Sheet>
	);
}
