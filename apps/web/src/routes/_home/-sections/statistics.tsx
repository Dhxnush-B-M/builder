import type { Icon } from "@phosphor-icons/react";
import { FileTextIcon, UsersIcon } from "@phosphor-icons/react";
import { m } from "motion/react";
import { useEffect, useState } from "react";

type Statistic = {
	id: string;
	label: string;
	value: number;
	icon: Icon;
};

type StatisticCardProps = {
	statistic: Statistic;
	index: number;
};

function StatisticCard({ statistic, index }: StatisticCardProps) {
	const Icon = statistic.icon;

	return (
		<m.div
			className="group relative overflow-hidden rounded-3xl border border-white/20 bg-card/40 p-8 shadow-xl backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/70 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900/40"
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
		>
			{/* Glowing Background Radial Light */}
			<div aria-hidden="true" className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full bg-gradient-to-br from-primary/20 via-indigo-500/10 to-transparent blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

			<div className="relative z-10 flex flex-col items-center justify-center text-center gap-y-4">
				{/* Icon Badge */}
				<m.div
					aria-hidden="true"
					className="relative flex items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 p-4 text-primary shadow-inner backdrop-blur-md"
					whileHover={{ scale: 1.1, rotate: 5 }}
					transition={{ type: "spring", stiffness: 400, damping: 15 }}
				>
					<Icon size={28} weight="duotone" />
				</m.div>

				{/* Metric Counter */}
				<span className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text font-extrabold text-5xl text-transparent tracking-tight md:text-6xl">
					{statistic.value.toLocaleString()}
				</span>

				{/* Label */}
				<p className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">{statistic.label}</p>
			</div>
		</m.div>
	);
}

export function Statistics() {
	const [userCount, setUserCount] = useState(0);
	const [resumeCount, setResumeCount] = useState(0);

	useEffect(() => {
		let isMounted = true;
		import("@/libs/supabase/db").then(({ getAllResumesCountFromSupabase, getUsersCountFromSupabase }) => {
			getAllResumesCountFromSupabase()
				.then((count) => {
					if (!isMounted) return;
					setResumeCount(count);
				})
				.catch(() => null);

			getUsersCountFromSupabase()
				.then((count) => {
					if (!isMounted) return;
					setUserCount(count);
				})
				.catch(() => null);
		});

		return () => {
			isMounted = false;
		};
	}, []);

	const statisticsList: Statistic[] = [
		{
			id: "users",
			label: "Active Users",
			value: userCount,
			icon: UsersIcon,
		},
		{
			id: "resumes",
			label: "Resumes Created",
			value: resumeCount,
			icon: FileTextIcon,
		},
	];

	return (
		<section id="statistics" aria-labelledby="stats-heading" className="py-12 md:py-16">
			<h2 id="stats-heading" className="sr-only">
				Application Statistics
			</h2>

			<div className="mx-auto max-w-5xl px-4">
				<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
					{statisticsList.map((statistic, index) => (
						<StatisticCard key={statistic.id} statistic={statistic} index={index} />
					))}
				</div>
			</div>
		</section>
	);
}
