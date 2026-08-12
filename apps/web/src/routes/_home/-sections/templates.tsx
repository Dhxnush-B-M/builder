import { useNavigate } from "@tanstack/react-router";
import { m } from "motion/react";
import { ArrowRightIcon, SparkleIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { CometCard } from "@/components/animation/comet-card";
import { templates } from "@/dialogs/resume/template/data";

const featuredTemplateKeys = ["azurill", "bronzor", "chikorita", "ditgar", "gengar", "glalie", "pikachu", "scizor"] as const;

export function Templates() {
	const navigate = useNavigate();

	return (
		<section id="templates" className="relative overflow-hidden border-border/40 border-b py-20 md:py-28 bg-gradient-to-b from-background via-muted/20 to-background">
			{/* Ambient Ambient Lighting */}
			<div className="absolute inset-0 pointer-events-none overflow-hidden">
				<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[700px] bg-gradient-to-tr from-primary/10 via-indigo-500/10 to-purple-500/10 blur-3xl rounded-full opacity-60 pointer-events-none" />
			</div>

			<div className="container mx-auto px-4 relative z-10 space-y-12">
				{/* Section Header */}
				<m.div
					className="space-y-4 text-center max-w-3xl mx-auto will-change-[transform,opacity]"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.45 }}
				>
					<div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
						<SparkleIcon className="size-3.5 animate-pulse" />
						<span>100% ATS-Optimized Templates</span>
					</div>

					<h2 className="bg-gradient-to-r from-foreground via-primary to-indigo-500 bg-clip-text font-extrabold text-3xl text-transparent tracking-tight sm:text-4xl md:text-5xl">
						Crafted for Executive & Technical Excellence
					</h2>

					<p className="text-base text-muted-foreground leading-relaxed md:text-lg">
						Choose from 15+ professionally styled templates engineered to pass ATS filters and stand out to hiring managers.
					</p>
				</m.div>

				{/* Animated Main Showcase Banner (New Builder UI Screenshot) */}
				<m.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
					className="w-full max-w-5xl mx-auto"
				>
					<CometCard glareOpacity={0.15} className="w-full">
						<div
							onClick={() => void navigate({ to: "/auth/login" })}
							className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/20 dark:border-white/10 bg-card/70 p-2 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:border-primary/50"
						>
							<div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-purple-500/20 opacity-40 blur-xl group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

							{/* Mac Header Bar */}
							<div className="relative z-10 flex items-center justify-between px-3 py-2 border-b border-white/10 bg-background/50 rounded-t-xl">
								<div className="flex items-center gap-1.5">
									<div className="size-3 rounded-full bg-red-500/80" />
									<div className="size-3 rounded-full bg-amber-500/80" />
									<div className="size-3 rounded-full bg-emerald-500/80" />
								</div>
								<span className="text-xs font-mono font-bold text-muted-foreground flex items-center gap-1.5">
									<CheckCircleIcon className="size-4 text-emerald-500" />
									<span>rbuilder • Live Resume Editor</span>
								</span>
								<span className="text-xs font-bold text-primary flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
									<span>Click to Edit</span>
									<ArrowRightIcon className="size-3.5" />
								</span>
							</div>

							{/* Main Builder UI Preview Image */}
							<div className="relative z-10 overflow-hidden rounded-b-xl">
								<img
									src="/images/hero-builder-preview.png"
									alt="rbuilder Live Interactive Resume Editor"
									width={1146}
									height={720}
									className="aspect-[1146/720] w-full object-cover transition-transform duration-700 group-hover:scale-[1.01]"
								/>
							</div>
						</div>
					</CometCard>
				</m.div>

				{/* Template Cards Grid Showcase */}
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-4 max-w-6xl mx-auto">
					{featuredTemplateKeys.map((key, index) => {
						const metadata = templates[key];
						return (
							<m.div
								key={key}
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.4, delay: index * 0.05 }}
								onClick={() => void navigate({ to: "/auth/login" })}
								className="group relative cursor-pointer overflow-hidden rounded-2xl border border-white/15 dark:border-white/10 bg-card/60 p-2.5 shadow-xl backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-primary/50 hover:shadow-2xl"
							>
								<div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-muted/30 border border-white/5">
									<img
										src={metadata.imageUrl}
										alt={metadata.name}
										className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

									<div className="absolute inset-x-0 bottom-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-between">
										<span className="font-extrabold text-sm text-white drop-shadow">
											{metadata.name}
										</span>
										<span className="p-1.5 rounded-full bg-primary text-primary-foreground">
											<ArrowRightIcon className="size-3.5" />
										</span>
									</div>
								</div>

								<div className="p-2 text-center">
									<h3 className="font-bold text-xs sm:text-sm text-foreground">{metadata.name}</h3>
									<p className="text-[11px] text-muted-foreground truncate">{metadata.tags[0] ?? "Professional"}</p>
								</div>
							</m.div>
						);
					})}
				</div>
			</div>
		</section>
	);
}
