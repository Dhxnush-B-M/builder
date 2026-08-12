import { ArrowRightIcon } from "@phosphor-icons/react";
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

			{/* Video Showcase Card */}
			<m.div
				className="mt-12 w-full will-change-[transform,opacity]"
				initial={{ opacity: 0, y: 60 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
			>
				<CometCard glareOpacity={0} className="relative mx-auto 3xl:max-w-7xl max-w-5xl px-4 md:px-12 lg:px-0">
					<div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/50 p-2 shadow-2xl backdrop-blur-sm">
						<video
							loop
							muted
							autoPlay
							controls
							playsInline
							preload="metadata"
							width={1146}
							height={720}
							poster="/videos/timelapse-v1.webp"
							src="/videos/timelapse-v1.mp4"
							aria-label="Timelapse demonstration of building a resume with rbuilder"
							className="aspect-[1146/720] w-full rounded-xl object-cover"
						/>
					</div>
				</CometCard>
			</m.div>
		</section>
	);
}
