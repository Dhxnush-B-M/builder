import { ArrowRightIcon, SparkleIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { m } from "motion/react";
import { Button } from "@reactive-resume/ui/components/button";
import { CometCard } from "@/components/animation/comet-card";
import { Spotlight } from "@/components/animation/spotlight";

export function Hero() {
	return (
		<section
			id="hero"
			className="relative flex min-h-svh w-full flex-col items-center justify-center overflow-hidden border-b py-20 md:py-28"
		>
			<Spotlight />

			<div className="relative z-10 flex max-w-4xl flex-col items-center gap-y-6 px-4 text-center">
				{/* Headline */}
				<m.div
					className="space-y-3 will-change-[transform,opacity]"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, delay: 0.35 }}
				>
					<h1 className="bg-gradient-to-r from-foreground via-primary to-indigo-500 bg-clip-text font-extrabold text-4xl text-transparent leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
						Build Job-Winning Resumes in Minutes
					</h1>
					<p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide md:text-sm">
						Free • Open Source • ATS-Friendly • Privacy-Focused
					</p>
				</m.div>

				{/* Description */}
				<m.p
					className="max-w-2xl text-base text-muted-foreground leading-relaxed will-change-[transform,opacity] md:text-xl"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, delay: 0.5 }}
				>
					rbuilder gives you complete control over your resume with real-time live previews, high-precision exports,
					and custom design tools.
				</m.p>

				{/* CTA Buttons */}
				<m.div
					className="flex flex-col items-center gap-4 pt-2 will-change-[transform,opacity] sm:flex-row sm:gap-6"
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.45, delay: 0.65 }}
				>
					<Button
						size="lg"
						nativeButton={false}
						className="group relative overflow-hidden px-8 py-6 font-bold text-base shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40"
						render={
							<Link to="/auth/login">
								<span className="relative z-10 flex items-center gap-2.5">
									<span>Create My Resume</span>
									<ArrowRightIcon
										aria-hidden="true"
										className="size-5 transition-transform group-hover:translate-x-1"
									/>
								</span>
							</Link>
						}
					/>
				</m.div>
			</div>

			{/* New Animated Hero Showcase Card */}
			<m.div
				className="mt-12 w-full will-change-[transform,opacity]"
				initial={{ opacity: 0, y: 60 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
			>
				<CometCard glareOpacity={0.2} className="relative mx-auto 3xl:max-w-7xl max-w-5xl px-4 md:px-12 lg:px-0">
					<div className="relative overflow-hidden rounded-2xl border border-white/20 dark:border-white/10 bg-card/60 p-2 shadow-2xl backdrop-blur-xl transition-transform duration-500 hover:scale-[1.01] group">
						{/* Ambient Glow Spotlight */}
						<div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 opacity-50 blur-xl group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

						{/* Top Mac-style Window Bar */}
						<div className="relative z-10 flex items-center justify-between px-3 py-2 border-b border-white/10 bg-background/50 rounded-t-xl">
							<div className="flex items-center gap-1.5">
								<div className="size-3 rounded-full bg-red-500/80" />
								<div className="size-3 rounded-full bg-amber-500/80" />
								<div className="size-3 rounded-full bg-emerald-500/80" />
							</div>
							<div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-muted/60 text-[11px] font-mono text-muted-foreground border border-white/5">
								<SparkleIcon className="size-3 text-primary animate-pulse" />
								<span>rbuilder • Live AI Resume Editor</span>
							</div>
							<div className="size-12" />
						</div>

						{/* New Builder Preview Image */}
						<div className="relative z-10 overflow-hidden rounded-b-xl">
							<img
								src="/images/hero-builder-preview.png"
								alt="rbuilder Live Interactive Resume Editor UI"
								width={1146}
								height={720}
								className="aspect-[1146/720] w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
							/>
						</div>
					</div>
				</CometCard>
			</m.div>
		</section>
	);
}
