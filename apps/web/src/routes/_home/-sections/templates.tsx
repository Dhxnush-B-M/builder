import { Trans } from "@lingui/react/macro";
import { m } from "motion/react";
import { useState } from "react";
import { templates } from "@/dialogs/resume/template/data";

const templateEntries = Object.entries(templates);

export function Templates() {
	const [isPaused, setIsPaused] = useState(false);

	return (
		<section id="templates" className="relative overflow-hidden border-border/40 border-t py-16 md:py-24">
			{/* Section Header */}
			<m.div
				className="container mx-auto space-y-4 px-4 text-center will-change-[transform,opacity]"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.45 }}
			>
				<h2 className="bg-gradient-to-r from-foreground via-primary to-indigo-500 bg-clip-text font-extrabold text-3xl text-transparent tracking-tight sm:text-4xl md:text-5xl">
					<Trans>Explore Resume Templates</Trans>
				</h2>

				<p className="mx-auto max-w-2xl text-base text-muted-foreground leading-relaxed md:text-lg">
					<Trans>
						Explore our 3D rotating showcase of professional resume templates crafted for maximum impact and ATS
						compliance.
					</Trans>
				</p>
			</m.div>

			{/* 3D Circular Rotating Carousel Stage */}
			<section
				aria-label="Template Carousel Stage"
				className="relative mt-12 flex h-[480px] w-full items-center justify-center overflow-hidden md:h-[550px]"
				onMouseEnter={() => setIsPaused(true)}
				onMouseLeave={() => setIsPaused(false)}
			>
				{/* Perspective container */}
				<div className="relative flex size-full items-center justify-center [perspective:1200px]">
					{/* 3D Rotating Ring */}
					<m.div
						className="relative flex size-full items-center justify-center [transform-style:preserve-3d]"
						animate={{ rotateY: isPaused ? undefined : [0, 360] }}
						transition={{
							rotateY: {
								duration: 32,
								repeat: Number.POSITIVE_INFINITY,
								ease: "linear",
							},
						}}
					>
						{templateEntries.map(([key, metadata], index) => {
							const total = templateEntries.length;
							const angle = (360 / total) * index;

							return (
								<div
									key={key}
									className="absolute flex items-center justify-center transition-transform duration-300"
									style={{
										transform: `rotateY(${angle}deg) translateZ(420px)`,
									}}
								>
									<m.div
										className="group relative w-48 rounded-xl border border-border/80 bg-card p-2 shadow-2xl transition-all duration-300 hover:scale-110 hover:border-primary/80 sm:w-56 md:w-60"
										whileHover={{ y: -8 }}
									>
										<div className="relative aspect-page w-full overflow-hidden rounded-lg border bg-background">
											<img
												src={metadata.imageUrl}
												alt={metadata.name}
												className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
											/>

											{/* Gradient Overlay */}
											<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

											{/* Template Name on Hover */}
											<div className="absolute inset-x-0 bottom-0 translate-y-3 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
												<span className="inline-block font-extrabold text-base text-white tracking-wide drop-shadow-md">
													{metadata.name}
												</span>
											</div>
										</div>
									</m.div>
								</div>
							);
						})}
					</m.div>
				</div>
			</section>
		</section>
	);
}
