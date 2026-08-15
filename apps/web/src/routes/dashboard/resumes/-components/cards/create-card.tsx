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
			<div className="absolute inset-0 flex flex-col items-center justify-center gap-3.5 p-4 text-center">
				<div className="relative flex size-20 items-center justify-center rounded-3xl border border-emerald-500/40 bg-gradient-to-tr from-emerald-500/20 via-teal-500/10 to-transparent p-4 shadow-xl shadow-emerald-500/20 backdrop-blur-2xl transition-all duration-500 group-hover:scale-115 group-hover:border-emerald-400 group-hover:bg-emerald-500/30">
					<PlusIcon weight="bold" className="size-10 text-emerald-400 transition-transform duration-500 group-hover:rotate-90" />
					<SparkleIcon className="absolute -top-2 -right-2 size-5 text-emerald-400 animate-pulse" />
				</div>
				<span className="font-extrabold text-muted-foreground text-xs uppercase tracking-widest transition-colors group-hover:text-emerald-400">
					New Resume
				</span>
			</div>
		</BaseCard>
	);
}
