import { Trans } from "@lingui/react/macro";
import { ChatTeardropDotsIcon, HeartIcon, StarIcon, UserCheckIcon } from "@phosphor-icons/react";

type Testimonial = {
	id: string;
	name: string;
	role: string;
	company: string;
	avatar: string;
	initials: string;
	gradient: string;
	content: string;
	rating: number;
};

const testimonials: Testimonial[] = [
	{
		id: "1",
		name: "Alex Rivera",
		role: "Senior Software Engineer",
		company: "Tech Corp",
		avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
		initials: "AR",
		gradient: "from-blue-500 to-indigo-600",
		content:
			"rbuilder completely changed how I present my experience. The real-time preview and ATS-friendly templates landed me interviews at top tech companies within a week!",
		rating: 5,
	},
	{
		id: "2",
		name: "Sophia Chen",
		role: "Product Designer",
		company: "Creative Studio",
		avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
		initials: "SC",
		gradient: "from-purple-500 to-pink-600",
		content:
			"The typography and design precision are top tier. I created three variations of my resume in minutes. Absolutely flawless experience!",
		rating: 5,
	},
	{
		id: "3",
		name: "Marcus Vance",
		role: "Data Analyst",
		company: "Analytics Co",
		avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
		initials: "MV",
		gradient: "from-emerald-500 to-teal-600",
		content:
			"Fast, privacy-focused, and completely free! No hidden paywalls when exporting to PDF. rbuilder is hands down the best resume builder available.",
		rating: 5,
	},
];

export function Testimonials() {
	return (
		<section className="relative overflow-hidden px-6 py-24 md:py-32">
			{/* Ambient background glow */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30"
			>
				<div className="size-[500px] animate-pulse rounded-full bg-gradient-to-tr from-primary/30 via-purple-600/20 to-blue-600/30 blur-3xl" />
			</div>

			<div className="relative mx-auto max-w-6xl">
				{/* Section Header */}
				<div className="flex flex-col items-center text-center">
					<div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-medium text-xs text-primary shadow-inner">
						<HeartIcon weight="fill" className="size-4 animate-bounce text-red-500" />
						<Trans>User Feedback & Reviews</Trans>
					</div>

					<h2 className="mt-6 max-w-3xl font-extrabold text-3xl tracking-tight sm:text-4xl md:text-5xl">
						<Trans>Loved by Job Seekers Worldwide</Trans>
					</h2>

					<p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-lg">
						<Trans>
							See how rbuilder empowers professionals to build standout, ATS-compliant resumes and land their dream jobs.
						</Trans>
					</p>
				</div>

				{/* Animated Circle Highlights Showcase */}
				<div className="mt-16 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
					{testimonials.map((t, idx) => (
						<div key={t.id} className="group relative flex flex-col items-center">
							{/* Rotating Animated Gradient Ring */}
							<div className="relative flex size-20 items-center justify-center transition-transform duration-300 group-hover:scale-110 sm:size-24">
								<div className="absolute inset-0 animate-spin-slow rounded-full bg-gradient-to-r from-primary via-indigo-500 to-purple-600 p-[3px] shadow-lg shadow-primary/20 transition-all duration-500 group-hover:shadow-primary/40 group-hover:p-[4px]">
									<div className="size-full rounded-full bg-background" />
								</div>

								{/* Circular Avatar */}
								<div className="relative z-10 flex size-[70px] items-center justify-center overflow-hidden rounded-full bg-muted shadow-inner sm:size-[84px]">
									<img
										src={t.avatar}
										alt={t.name}
										className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
										loading="lazy"
									/>
								</div>

								{/* Floating Checkmark Circle Badge */}
								<div className="absolute -bottom-1 -right-1 z-20 flex size-7 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-2 ring-background transition-transform group-hover:scale-125">
									<UserCheckIcon weight="bold" className="size-4" />
								</div>
							</div>

							<span className="mt-3 font-bold text-foreground text-sm tracking-tight">{t.name}</span>
							<span className="text-xs text-muted-foreground">{t.role}</span>
						</div>
					))}
				</div>

				{/* Testimonial Cards Grid */}
				<div className="mt-16 grid gap-8 md:grid-cols-3">
					{testimonials.map((item) => (
						<div
							key={item.id}
							className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-background/60 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
						>
							{/* Top Accent Line */}
							<div className="absolute top-0 right-8 left-8 h-[2px] rounded-full bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

							<div>
								{/* Star Rating */}
								<div className="flex items-center gap-1 text-amber-400">
									{Array.from({ length: item.rating }).map((_, i) => (
										// biome-ignore lint/suspicious/noArrayIndexKey: fixed array length
										<StarIcon key={i} weight="fill" className="size-5" />
									))}
								</div>

								{/* Quote Content */}
								<p className="mt-6 text-foreground/90 text-sm leading-relaxed italic sm:text-base">
									"{item.content}"
								</p>
							</div>

							{/* Author Info */}
							<div className="mt-8 flex items-center gap-4 border-border/50 border-t pt-6">
								<div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2 ring-primary/30">
									<img src={item.avatar} alt={item.name} className="size-full object-cover" loading="lazy" />
								</div>

								<div>
									<h4 className="font-bold text-foreground text-sm">{item.name}</h4>
									<p className="text-xs text-muted-foreground">
										{item.role} • <span className="font-medium text-primary">{item.company}</span>
									</p>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Interactive Call to Action Banner */}
				<div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-purple-600/10 to-indigo-600/10 p-8 text-center sm:flex-row sm:text-left">
					<div className="flex items-center gap-4">
						<div className="flex size-14 items-center justify-center rounded-2xl bg-primary/20 text-primary shadow-inner">
							<ChatTeardropDotsIcon weight="fill" className="size-7" />
						</div>
						<div>
							<h3 className="font-bold text-foreground text-lg">Have feedback or suggestions?</h3>
							<p className="text-muted-foreground text-sm">We'd love to hear how rbuilder helps your career path!</p>
						</div>
					</div>

					<a
						href="mailto:support@rbuilder.com"
						className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground text-sm shadow-lg transition-transform hover:scale-105 active:scale-95"
					>
						<Trans>Share Feedback</Trans>
					</a>
				</div>
			</div>
		</section>
	);
}
