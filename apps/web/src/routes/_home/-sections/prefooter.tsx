import { m } from "motion/react";
import { TextMaskEffect } from "@/components/animation/text-mask";

export function Prefooter() {
	return (
		<section id="prefooter" className="relative overflow-hidden py-16 md:py-28 border-t border-border/30">
			{/* Glowing Glass Ambient Backdrops */}
			<div aria-hidden="true" className="pointer-events-none absolute inset-0">
				<div className="absolute inset-s-1/4 top-10 size-96 rounded-full bg-primary/10 blur-3xl" />
				<div className="absolute inset-e-1/4 bottom-10 size-96 rounded-full bg-indigo-500/10 blur-3xl" />
			</div>

			<div className="relative space-y-12">
				{/* Continuous Left-to-Right Animated Marquee Text Banner */}
				<div className="relative w-full overflow-hidden py-6 border-y border-white/10 bg-card/20 backdrop-blur-xl shadow-xl dark:bg-slate-900/30">
					<div className="flex w-max animate-[marquee_20s_linear_infinite] select-none items-center gap-12 font-extrabold tracking-tighter text-7xl md:text-9xl">
						{Array.from({ length: 8 }).map((_, idx) => (
							<div key={idx} className="flex items-center gap-12">
								<span className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 bg-clip-text text-transparent opacity-90 transition-all hover:opacity-100">
									rbuilder
								</span>
								<span className="text-primary/30 text-4xl md:text-6xl">•</span>
							</div>
						))}
					</div>
				</div>

				<m.div
					className="mx-auto max-w-3xl space-y-6 px-6 text-center will-change-[transform,opacity] md:px-8 xl:px-0"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.45 }}
				>
					<h2 className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text font-extrabold text-3xl text-transparent tracking-tight md:text-5xl">
						Crafted for modern professionals worldwide.
					</h2>

					<p className="text-base text-muted-foreground leading-relaxed md:text-lg">
						rbuilder empowers job seekers with powerful design tools, instant PDF generation, and full data privacy.
						Build your resume with confidence and land your dream role.
					</p>
				</m.div>
			</div>
		</section>
	);
}
