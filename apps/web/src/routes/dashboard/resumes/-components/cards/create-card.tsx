import { t } from "@lingui/core/macro";
import { PlusIcon, SparkleIcon } from "@phosphor-icons/react";
import { useDialogStore } from "@/dialogs/store";
import { BaseCard } from "./base-card";

export function CreateResumeCard() {
	const { openDialog } = useDialogStore();

	return (
		<BaseCard
			title={t`Create a new resume`}
			description={t`Start building your resume from scratch`}
			onClick={() => openDialog("resume.create", undefined)}
		>
			<div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
				<div className="relative flex size-16 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 p-3 shadow-lg shadow-primary/20 backdrop-blur-xl transition-all duration-500 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary/20">
					<PlusIcon weight="bold" className="size-8 text-primary transition-transform duration-500 group-hover:rotate-90" />
					<SparkleIcon className="absolute -top-1.5 -right-1.5 size-4 text-primary animate-pulse" />
				</div>
				<span className="font-semibold text-muted-foreground text-xs uppercase tracking-wider group-hover:text-foreground">
					New Resume
				</span>
			</div>
		</BaseCard>
	);
}
