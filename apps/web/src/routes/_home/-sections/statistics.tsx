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
			className="group relative flex flex-col items-center justify-center gap-y-4 border-r border-b p-8 transition-colors last:border-e-0 hover:bg-secondary/30 sm:border-b-0 xl:py-12"
			initial={{ opacity: 0, y: 20 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, margin: "-50px" }}
			transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
		>
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
				<m.div
					className="absolute inset-s-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/10"
					initial={{ scale: 0.8, opacity: 0 }}
					whileInView={{ scale: 1, opacity: 1 }}
					viewport={{ once: true }}
					transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
				>
					<Icon size={180} weight="thin" />
				</m.div>
			</div>

			<m.div
				aria-hidden="true"
				className="relative rounded-full bg-primary/10 p-3 text-primary"
				whileHover={{ scale: 1.05 }}
				transition={{ type: "spring", stiffness: 400, damping: 20 }}
			>
				<Icon size={24} weight="thin" />
			</m.div>

			<span className="font-bold text-5xl tracking-tight md:text-6xl text-foreground">
				{statistic.value.toLocaleString()}
			</span>

			<p className="relative font-medium text-base text-muted-foreground tracking-tight">{statistic.label}</p>
		</m.div>
	);
}

export function Statistics() {
	const [userCount, setUserCount] = useState(1);
	const [resumeCount, setResumeCount] = useState(1);

	useEffect(() => {
		if (typeof window === "undefined") return;

		try {
			// Calculate real resume count from localStorage
			const keys = Object.keys(localStorage);
			const savedResumes = keys.filter(
				(k) => k.includes("resume") || k.includes("builder") || k.startsWith("rbuilder_"),
			);
			
			if (savedResumes.length > 0) {
				setResumeCount(savedResumes.length);
			} else {
				setResumeCount(1);
			}

			// User session count
			const userSessions = localStorage.getItem("rbuilder_user_session");
			if (userSessions) {
				setUserCount(Math.max(1, parseInt(userSessions, 10) || 1));
			} else {
				localStorage.setItem("rbuilder_user_session", "1");
				setUserCount(1);
			}
		} catch {
			setUserCount(1);
			setResumeCount(1);
		}
	}, []);

	const statisticsList: Statistic[] = [
		{
			id: "users",
			label: "Users",
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
		<section id="statistics" aria-labelledby="stats-heading">
			<h2 id="stats-heading" className="sr-only">
				Application Statistics
			</h2>

			<div className="grid grid-cols-1 sm:grid-cols-2">
				{statisticsList.map((statistic, index) => (
					<StatisticCard key={statistic.id} statistic={statistic} index={index} />
				))}
			</div>
		</section>
	);
}
