import { useNavigate } from "@tanstack/react-router";
import { m } from "motion/react";
import { useState } from "react";

const templatesList = [
	{ id: "azurill", name: "Azurill", imageUrl: "/templates/jpg/azurill.jpg" },
	{ id: "bronzer", name: "Bronzer", imageUrl: "/templates/jpg/bronzer.jpg" },
	{ id: "chapeau", name: "Chapeau", imageUrl: "/templates/jpg/chapeau.jpg" },
	{ id: "ditgar", name: "Ditgar", imageUrl: "/templates/jpg/ditgar.jpg" },
	{ id: "gengar", name: "Gengar", imageUrl: "/templates/jpg/gengar.jpg" },
	{ id: "kakuna", name: "Kakuna", imageUrl: "/templates/jpg/kakuna.jpg" },
	{ id: "leafish", name: "Leafish", imageUrl: "/templates/jpg/leafish.jpg" },
	{ id: "onyx", name: "Onyx", imageUrl: "/templates/jpg/onyx.jpg" },
];

export function Templates() {
	const navigate = useNavigate();
	const [isPaused, setIsPaused] = useState(false);

	return (
		<section id="templates" className="relative overflow-hidden border-border/40 border-b py-16 md:py-24">
			<m.div
				className="container mx-auto space-y-4 px-4 text-center will-change-[transform,opacity]"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.45 }}
			>
				<h2 className="bg-gradient-to-r from-foreground via-primary to-indigo-500 bg-clip-text font-extrabold text-3xl text-transparent tracking-tight sm:text-4xl md:text-5xl">
					Explore 3D Resume Templates
				</h2>

				<p className="mx-auto max-w-2xl text-base text-muted-foreground leading-relaxed md:text-lg">
					Hover to pause the 3D rotating showcase of professional resume templates crafted for maximum impact.
				</p>
			</m.div>

			{/* 3D Circular Rotating Carousel Stage */}
			<div
				aria-label="Template Carousel Stage"
				className="relative mt-12 flex h-[480px] w-full items-center justify-center overflow-hidden md:h-[550px]"
				onMouseEnter={() => setIsPaused(true)}
				onMouseLeave={() => setIsPaused(false)}
			>
				<div className="relative flex size-full items-center justify-center [perspective:1200px]">
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
						{templatesList.map((metadata, index) => {
							const total = templatesList.length;
							const angle = (360 / total) * index;

							return (
								<div
									key={metadata.id}
									onClick={() => void navigate({ to: "/builder/demo" })}
									className="absolute flex cursor-pointer items-center justify-center transition-transform duration-300"
									style={{
										transform: `rotateY(${angle}deg) translateZ(420px)`,
									}}
								>
									<m.div
										className="group relative w-48 rounded-xl border border-border/80 bg-card p-2 shadow-2xl transition-all duration-300 hover:scale-110 hover:border-primary/80 sm:w-56 md:w-60"
										whileHover={{ y: -8 }}
									>
										<div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border bg-background">
											<img
												src={metadata.imageUrl}
												alt={metadata.name}
												className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
											/>

											<div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

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
			</div>
		</section>
	);
}
