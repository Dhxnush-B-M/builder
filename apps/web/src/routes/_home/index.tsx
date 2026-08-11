import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Trans } from "@lingui/react/macro";
import {
	ArrowRightIcon,
	CheckCircleIcon,
	FilePdfIcon,
	GlobeIcon,
	LightningIcon,
	LockKeyIcon,
	MoonIcon,
	PaletteIcon,
	ShieldCheckIcon,
	SunIcon,
	SparkleIcon,
} from "@phosphor-icons/react";
import { Button } from "@reactive-resume/ui/components/button";
import { BrandIcon } from "@reactive-resume/ui/components/brand-icon";
import { useTheme } from "@/features/theme/provider";
import { createNoindexFollowMeta } from "@/libs/seo";

export const Route = createFileRoute("/_home/")({
	component: LandingPage,
	head: () => ({
		meta: [createNoindexFollowMeta()],
	}),
});

const templates = [
	{ id: "azurill", name: "Azurill", category: "Modern & Clean", img: "/templates/jpg/azurill.jpg" },
	{ id: "bronzer", name: "Bronzer", category: "Corporate & Tech", img: "/templates/jpg/bronzer.jpg" },
	{ id: "chapeau", name: "Chapeau", category: "Minimalist", img: "/templates/jpg/chapeau.jpg" },
	{ id: "ditgar", name: "Ditgar", category: "Executive & Bold", img: "/templates/jpg/ditgar.jpg" },
	{ id: "gengar", name: "Gengar", category: "Creative & Design", img: "/templates/jpg/gengar.jpg" },
	{ id: "kakuna", name: "Kakuna", category: "Elegant Two-Column", img: "/templates/jpg/kakuna.jpg" },
	{ id: "leafish", name: "Leafish", category: "Compact Professional", img: "/templates/jpg/leafish.jpg" },
	{ id: "onyx", name: "Onyx", category: "Sleek Dark Accent", img: "/templates/jpg/onyx.jpg" },
];

const features = [
	{
		icon: ShieldCheckIcon,
		title: "100% Privacy & Local Storage",
		desc: "Your personal details stay inside your browser. No third-party data tracking or hidden analytics.",
	},
	{
		icon: LightningIcon,
		title: "Instant 0ms PDF Engine",
		desc: "Export high-resolution ATS-friendly PDFs instantly with zero server latency or queue delays.",
	},
	{
		icon: PaletteIcon,
		title: "12+ Modern Designer Templates",
		desc: "Crafted by professional typography experts to get past Applicant Tracking Systems (ATS).",
	},
	{
		icon: LockKeyIcon,
		title: "Password & Read-Only Locks",
		desc: "Lock your resume drafts from accidental modifications with one-click security controls.",
	},
	{
		icon: GlobeIcon,
		title: "Multilingual Support",
		desc: "Full internationalization for over 50 languages with custom typography and font fallback stacks.",
	},
	{
		icon: FilePdfIcon,
		title: "Free Forever with Zero Ads",
		desc: "No premium paywalls, no subscription fees, and no watermark restrictions.",
	},
];

function LandingPage() {
	const navigate = useNavigate();
	const { theme, toggleTheme } = useTheme();

	return (
		<div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20 selection:text-primary">
			{/* Navbar */}
			<header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/40 transition-colors">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
					<div className="flex items-center gap-x-3">
						<BrandIcon variant="logo" className="text-xl" />
					</div>

					<div className="flex items-center gap-x-3">
						<Button
							size="icon"
							variant="ghost"
							onClick={() => toggleTheme({ playSound: true })}
							aria-label="Toggle Theme"
							title="Toggle Dark / Light Mode"
							className="rounded-full hover:bg-muted/80 transition-transform active:scale-95"
						>
							{theme === "dark" ? (
								<SunIcon className="size-5 text-amber-400" />
							) : (
								<MoonIcon className="size-5 text-slate-700" />
							)}
						</Button>

						<Button
							onClick={() => void navigate({ to: "/builder/demo" })}
							className="rounded-full gap-x-2 shadow-sm font-semibold hover:shadow-md transition-all active:scale-95"
						>
							<span>Go to Builder</span>
							<ArrowRightIcon className="size-4" />
						</Button>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
				{/* Background Gradients */}
				<div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
					<div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-blue-600/20 via-indigo-600/15 to-purple-600/20 blur-3xl opacity-70 rounded-full" />
				</div>

				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
					<div className="inline-flex items-center gap-x-2 px-3.5 py-1.5 rounded-full border border-primary/20 bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase shadow-sm">
						<SparkleIcon className="size-4 animate-pulse text-primary" />
						<span>100% Free Standalone Resume Builder</span>
					</div>

					<h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
						Build ATS-Friendly Resumes <br className="hidden sm:inline" />
						<span className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent">
							In Minutes, Privately.
						</span>
					</h1>

					<p className="max-w-2xl mx-auto text-base sm:text-xl text-muted-foreground font-normal leading-relaxed">
						rbuilder simplifies the process of creating, customizing, and exporting high-converting professional resumes right inside your browser.
					</p>

					<div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
						<Button
							size="lg"
							onClick={() => void navigate({ to: "/builder/demo" })}
							className="w-full sm:w-auto h-12 px-8 text-base font-bold rounded-full gap-x-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all active:translate-y-0"
						>
							<span>Start Building Now</span>
							<ArrowRightIcon className="size-5" />
						</Button>

						<a
							href="#templates"
							className="w-full sm:w-auto h-12 px-8 text-base font-medium rounded-full border border-border/80 bg-background/50 hover:bg-muted/80 flex items-center justify-center gap-x-2 transition-colors"
						>
							<span>Explore 12+ Templates</span>
						</a>
					</div>

					{/* Highlights */}
					<div className="pt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-muted-foreground">
						<span className="flex items-center gap-x-1.5">
							<CheckCircleIcon className="size-4 text-emerald-500" /> No Sign-In Required
						</span>
						<span className="flex items-center gap-x-1.5">
							<CheckCircleIcon className="size-4 text-emerald-500" /> Real-time Live Preview
						</span>
						<span className="flex items-center gap-x-1.5">
							<CheckCircleIcon className="size-4 text-emerald-500" /> Unlimited PDF Exports
						</span>
					</div>
				</div>

				{/* Preview Showcase Card */}
				<div className="mt-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="relative rounded-2xl border border-border/60 bg-card/60 p-2 sm:p-4 shadow-2xl backdrop-blur-xl group overflow-hidden">
						<div className="flex items-center justify-between px-3 py-2 border-b border-border/40 bg-muted/30 rounded-t-xl mb-3">
							<div className="flex items-center gap-x-2">
								<div className="size-3 rounded-full bg-red-500/80" />
								<div className="size-3 rounded-full bg-amber-500/80" />
								<div className="size-3 rounded-full bg-emerald-500/80" />
							</div>
							<span className="text-xs text-muted-foreground font-mono">rbuilder editor — live preview</span>
							<div className="size-4" />
						</div>
						<div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden bg-muted/40">
							<img
								src="/templates/jpg/azurill.jpg"
								alt="rbuilder live editor preview"
								className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.01]"
							/>
							<div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent flex items-end justify-center pb-8">
								<Button
									onClick={() => void navigate({ to: "/builder/demo" })}
									className="rounded-full shadow-2xl px-6 py-3 font-bold gap-x-2 text-sm bg-primary text-primary-foreground hover:scale-105 transition-transform"
								>
									<span>Launch Interactive Editor</span>
									<ArrowRightIcon className="size-4" />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Features Grid */}
			<section className="py-20 bg-muted/20 border-y border-border/40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="text-center space-y-3 mb-16">
						<h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Everything You Need to Land Your Dream Job</h2>
						<p className="text-muted-foreground max-w-xl mx-auto">Designed for speed, security, and elegance.</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((f, i) => (
							<div
								key={i}
								className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 space-y-4"
							>
								<div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
									<f.icon className="size-6" />
								</div>
								<h3 className="text-lg font-bold">{f.title}</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Template Showcase */}
			<section id="templates" className="py-20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
					<div className="text-center space-y-3">
						<h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Choose From 12+ Crafted Templates</h2>
						<p className="text-muted-foreground max-w-xl mx-auto">
							Each template is engineered for ATS compliance and professional design aesthetics.
						</p>
					</div>

					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{templates.map((tpl) => (
							<div
								key={tpl.id}
								onClick={() => void navigate({ to: "/builder/demo" })}
								className="group cursor-pointer rounded-2xl border border-border/60 bg-card overflow-hidden hover:border-primary/60 hover:shadow-xl transition-all duration-300 flex flex-col"
							>
								<div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
									<img
										src={tpl.img}
										alt={tpl.name}
										className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
									/>
									<div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
										<Button size="sm" className="rounded-full gap-x-1.5 font-bold shadow-lg">
											<span>Use {tpl.name}</span>
											<ArrowRightIcon className="size-4" />
										</Button>
									</div>
								</div>
								<div className="p-4 flex items-center justify-between border-t border-border/40">
									<div>
										<h4 className="font-bold text-sm">{tpl.name}</h4>
										<p className="text-xs text-muted-foreground">{tpl.category}</p>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className="text-center pt-6">
						<Button
							size="lg"
							onClick={() => void navigate({ to: "/builder/demo" })}
							className="rounded-full px-8 font-bold gap-x-2"
						>
							<span>Explore All Templates in Editor</span>
							<ArrowRightIcon className="size-4" />
						</Button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="mt-auto border-t border-border/40 py-10 bg-muted/30">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-y-4">
					<div className="flex items-center gap-x-3">
						<BrandIcon variant="logo" className="text-lg" />
					</div>
					<p className="text-xs text-muted-foreground">
						© {new Date().getFullYear()} rbuilder. Free & Open-Source Standalone Resume Builder.
					</p>
				</div>
			</footer>
		</div>
	);
}
