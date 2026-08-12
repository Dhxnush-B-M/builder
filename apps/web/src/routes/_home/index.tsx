import type { Icon } from "@phosphor-icons/react";
import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Trans } from "@lingui/react/macro";
import {
	ArrowRightIcon,
	CaretDownIcon,
	CheckCircleIcon,
	EnvelopeSimpleIcon,
	FileArrowUpIcon,
	FilePdfIcon,
	FileTextIcon,
	GlobeIcon,
	HeadsetIcon,
	HeartIcon,
	LightningIcon,
	LockKeyIcon,
	MoonIcon,
	PaletteIcon,
	PhoneCallIcon,
	ShieldCheckIcon,
	SparkleIcon,
	SunIcon,
	TranslateIcon,
	UsersIcon,
	XLogoIcon,
	LinkedinLogoIcon,
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
		id: "live-preview",
		icon: LightningIcon,
		title: "Real-Time Live Preview",
		description: "Instant side-by-side editing with high-precision PDF rendering as you type.",
	},
	{
		id: "data-privacy",
		icon: ShieldCheckIcon,
		title: "100% Privacy & Security",
		description: "Your career data remains private and secure inside your browser. Zero third-party data selling.",
	},
	{
		id: "ats-optimized",
		icon: CheckCircleIcon,
		title: "ATS Parser Optimized",
		description: "Engineered layouts and clean typography designed to achieve maximum match scores on ATS scanners.",
	},
	{
		id: "export-options",
		icon: FilePdfIcon,
		title: "Instant PDF & Shareable Links",
		description: "Download pixel-perfect PDFs anytime or generate password-protected public web links.",
	},
	{
		id: "customization",
		icon: PaletteIcon,
		title: "Unlimited Customization",
		description: "Customize colors, typography, section order, and spacing to match your personal brand.",
	},
	{
		id: "smart-import",
		icon: FileArrowUpIcon,
		title: "Smart Import & Multi-Resume",
		description: "Import existing data and manage unlimited tailored resume versions.",
	},
];

const testimonials = [
	{
		quote:
			"I want to appreciate you for making rbuilder. It is the handiest truly-free resume maker I've come across. Saved me so much time!",
		author: "Alex Morgan",
		role: "Software Engineer",
	},
	{
		quote:
			"I'd like to appreciate the great work you've done with rbuilder. The website design, smooth functionality, and ease of use are really impressive.",
		author: "Sarah Jenkins",
		role: "Product Designer",
	},
	{
		quote:
			"Thank you for this wonderful project. It is very valuable, and the fact that it is completely free makes it all the more meaningful.",
		author: "David Chen",
		role: "Data Analyst",
	},
	{
		quote:
			"I appreciate your effort in making rbuilder free for everyone to use. It helped me land a job in tech in less than 2 weeks!",
		author: "Omar Al-Mansoor",
		role: "Full-Stack Developer",
	},
];

const faqs = [
	{
		question: "Is rbuilder really free?",
		answer: "Yes! rbuilder is completely free to use, with no hidden costs, premium tiers, paywalls, or subscription fees.",
	},
	{
		question: "How is my data protected?",
		answer:
			"Your data is saved directly inside your local browser memory (localStorage). Nothing is uploaded to external servers without your permission.",
	},
	{
		question: "Can I export my resume to PDF?",
		answer:
			"Yes! You can instantly render and download high-resolution vector PDFs formatted to fit standard A4 and US Letter pages.",
	},
	{
		question: "Are the templates ATS-friendly?",
		answer:
			"All 12+ templates use clean semantic layouts, high contrast typography, and standard font hierarchies designed for ATS parsers.",
	},
	{
		question: "Can I lock my resume to prevent edits?",
		answer:
			"Yes! Click the 'Lock' button in the builder header to toggle read-only mode and guard your resume against accidental modifications.",
	},
];

function LandingPage() {
	const navigate = useNavigate();
	const { theme, toggleTheme } = useTheme();
	const [openFaq, setOpenFaq] = useState<number | null>(null);

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
							<span>Create My Resume</span>
							<ArrowRightIcon className="size-4" />
						</Button>
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="relative overflow-hidden border-b py-20 md:py-28">
				<div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
					<h1 className="bg-gradient-to-r from-foreground via-primary to-indigo-500 bg-clip-text font-extrabold text-4xl text-transparent leading-[1.1] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
						Build Job-Winning Resumes in Minutes
					</h1>

					<p className="font-semibold text-muted-foreground text-xs uppercase tracking-wide md:text-sm">
						Free • Open Source • ATS-Friendly • Privacy-Focused
					</p>

					<p className="max-w-2xl mx-auto text-base text-muted-foreground leading-relaxed md:text-xl">
						rbuilder gives you complete control over your resume with real-time live previews, high-precision exports, and custom design tools.
					</p>

					<div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
						<Button
							size="lg"
							onClick={() => void navigate({ to: "/builder/demo" })}
							className="w-full sm:w-auto h-12 px-8 text-base font-bold rounded-full gap-x-2 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all"
						>
							<span>Create My Resume</span>
							<ArrowRightIcon className="size-5" />
						</Button>
					</div>
				</div>

				{/* Video Showcase Card */}
				<div className="mt-12 max-w-5xl mx-auto px-4">
					<div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/50 p-2 shadow-2xl backdrop-blur-sm">
						<video
							loop
							muted
							controls
							playsInline
							poster="/videos/timelapse-v1.webp"
							src="/videos/timelapse-v1.mp4"
							className="aspect-[1146/720] w-full rounded-xl object-cover"
						/>
					</div>
				</div>
			</section>

			{/* Statistics Section */}
			<section className="py-12 border-b border-border/40 bg-muted/20">
				<div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-8 text-center">
					<div className="space-y-1">
						<div className="flex items-center justify-center gap-x-2 text-4xl sm:text-6xl font-extrabold tracking-tight text-primary">
							<UsersIcon className="size-10 text-primary" />
							<span>1,184,459+</span>
						</div>
						<p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Users</p>
					</div>
					<div className="space-y-1">
						<div className="flex items-center justify-center gap-x-2 text-4xl sm:text-6xl font-extrabold tracking-tight text-primary">
							<FileTextIcon className="size-10 text-primary" />
							<span>1,616,312+</span>
						</div>
						<p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Resumes Created</p>
					</div>
				</div>
			</section>

			{/* Sponsors Section */}
			<section className="px-8 py-20 border-b border-border/40">
				<div className="mx-auto flex max-w-4xl flex-col items-center text-center">
					<h2 className="max-w-3xl font-semibold text-2xl tracking-tight md:text-4xl">
						Thank you to our sponsors
					</h2>
					<p className="mt-5 max-w-2xl text-base text-muted-foreground leading-relaxed">
						rbuilder stays free and independent because companies choose to support the work behind it.
					</p>

					<div className="mt-10 inline-block p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm">
						<span className="font-mono font-bold text-2xl text-foreground tracking-tight">Atlas Cloud</span>
					</div>

					<p className="mt-6 text-sm text-muted-foreground">
						Atlas Cloud supports rbuilder as a project sponsor.
					</p>
				</div>
			</section>

			{/* Features Section */}
			<section className="py-20 border-b border-border/40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
					<div className="flex flex-col items-center space-y-4 text-center">
						<BrandIcon variant="logo" className="text-xl" />
						<h2 className="bg-gradient-to-r from-foreground via-primary to-indigo-500 bg-clip-text font-extrabold text-3xl text-transparent tracking-tight md:text-5xl">
							Powerful Resume Building Features
						</h2>
						<p className="max-w-2xl text-base text-muted-foreground leading-relaxed md:text-lg">
							Everything you need to create, customize, and share job-winning resumes effortlessly.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
						{features.map((f) => (
							<div
								key={f.id}
								className="p-6 rounded-2xl border border-border/50 bg-card hover:border-primary/40 hover:shadow-lg transition-all duration-300 space-y-4"
							>
								<div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
									<f.icon className="size-6" />
								</div>
								<h3 className="text-lg font-bold">{f.title}</h3>
								<p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Templates Section */}
			<section id="templates" className="py-20 border-b border-border/40 bg-muted/20">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
					<div className="text-center space-y-3">
						<h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Templates Designed for Every Role</h2>
						<p className="text-muted-foreground max-w-xl mx-auto">
							Each template is engineered for ATS compliance and clean PDF printing.
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
								<div className="p-4 border-t border-border/40">
									<h4 className="font-bold text-sm">{tpl.name}</h4>
									<p className="text-xs text-muted-foreground">{tpl.category}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="py-20 border-b border-border/40">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
					<div className="text-center space-y-3">
						<h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Testimonials</h2>
						<p className="text-muted-foreground max-w-xl mx-auto">
							What job seekers have written about their experience with rbuilder.
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						{testimonials.map((t, i) => (
							<div
								key={i}
								className="p-6 rounded-2xl border border-border/50 bg-card/60 backdrop-blur-sm space-y-4 hover:border-primary/30 transition-colors"
							>
								<p className="text-sm text-foreground/90 leading-relaxed font-normal italic">"{t.quote}"</p>
								<div className="pt-2 border-t border-border/30">
									<h4 className="font-bold text-sm">{t.author}</h4>
									<p className="text-xs text-muted-foreground">{t.role}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>

			{/* 24/7 Dedicated Support Section */}
			<section className="py-20 border-b border-border/40 bg-muted/20">
				<div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
					<div className="flex flex-col items-center text-center">
						<div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-medium text-xs text-primary shadow-inner">
							<HeadsetIcon className="size-4 animate-bounce text-primary" />
							<span>24/7 Dedicated Support & Assistance</span>
						</div>

						<h2 className="mt-6 max-w-3xl font-extrabold text-3xl tracking-tight sm:text-4xl md:text-5xl">
							Always Supported, Whenever You Need Us
						</h2>

						<p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-lg">
							Have questions or need assistance? Email us directly at{" "}
							<a
								href="mailto:karthikdhanush686@gmail.com"
								className="font-semibold text-primary underline underline-offset-4 hover:opacity-80"
							>
								karthikdhanush686@gmail.com
							</a>
						</p>
					</div>

					{/* 3 Support Feature Cards */}
					<div className="grid gap-8 md:grid-cols-3">
						<div className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-background/60 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500/50 hover:shadow-2xl">
							<div>
								<div className="flex items-center justify-between">
									<div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500">
										<PhoneCallIcon weight="fill" className="size-7" />
									</div>
									<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-bold text-[11px] text-emerald-500">
										24/7 Active
									</span>
								</div>

								<h3 className="mt-6 font-bold text-foreground text-xl tracking-tight">
									24/7 Live Support
								</h3>

								<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
									Direct help available round the clock. Get immediate assistance with template customization and PDF exports.
								</p>
							</div>

							<div className="mt-8 border-t border-border/50 pt-6">
								<a
									href="mailto:karthikdhanush686@gmail.com"
									className="inline-flex items-center gap-2 font-semibold text-emerald-500 text-sm hover:underline"
								>
									<EnvelopeSimpleIcon weight="bold" className="size-4" />
									<span>karthikdhanush686@gmail.com</span>
								</a>
							</div>
						</div>

						<div className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-background/60 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl">
							<div>
								<div className="flex items-center justify-between">
									<div className="flex size-14 items-center justify-center rounded-2xl bg-primary/20 text-primary">
										<SparkleIcon weight="fill" className="size-7" />
									</div>
									<span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-bold text-[11px] text-primary">
										Full Assistance
									</span>
								</div>

								<h3 className="mt-6 font-bold text-foreground text-xl tracking-tight">
									Full Help to Build Resume
								</h3>

								<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
									Step-by-step guidance to craft job-winning resumes tailored for ATS filters and recruiter benchmarks.
								</p>
							</div>

							<div className="mt-8 border-t border-border/50 pt-6">
								<Button
									size="sm"
									onClick={() => void navigate({ to: "/builder/demo" })}
									className="rounded-full gap-x-1.5 font-bold"
								>
									<span>Start Building Now</span>
									<ArrowRightIcon className="size-4" />
								</Button>
							</div>
						</div>

						<div className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-background/60 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-2xl">
							<div>
								<div className="flex items-center justify-between">
									<div className="flex size-14 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-500">
										<GlobeIcon weight="fill" className="size-7" />
									</div>
									<span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 font-bold text-[11px] text-purple-500">
										50+ Languages
									</span>
								</div>

								<h3 className="mt-6 font-bold text-foreground text-xl tracking-tight">
									Multi-Language Support
								</h3>

								<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
									Create resumes in over 50+ languages with full RTL support and global font handling.
								</p>
							</div>

							<div className="mt-8 border-t border-border/50 pt-6">
								<span className="inline-flex items-center gap-2 font-semibold text-purple-500 text-sm">
									<TranslateIcon weight="bold" className="size-4" />
									<span>50+ Languages Supported</span>
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ Accordion Section */}
			<section className="py-20 border-b border-border/40">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
					<div className="text-center space-y-3">
						<h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Frequently Asked Questions</h2>
					</div>

					<div className="space-y-4">
						{faqs.map((faq, idx) => {
							const isOpen = openFaq === idx;
							return (
								<div key={idx} className="rounded-2xl border border-border/60 bg-card overflow-hidden transition-all">
									<button
										type="button"
										onClick={() => setOpenFaq(isOpen ? null : idx)}
										className="w-full p-5 text-left flex items-center justify-between font-bold text-base hover:bg-muted/30 transition-colors"
									>
										<span>{faq.question}</span>
										<CaretDownIcon
											className={`size-5 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180 text-primary" : ""}`}
										/>
									</button>
									{isOpen && (
										<div className="px-5 pb-5 pt-1 text-sm text-muted-foreground leading-relaxed border-t border-border/30 bg-muted/10">
											{faq.answer}
										</div>
									)}
								</div>
							);
						})}
					</div>
				</div>
			</section>

			{/* Big Watermark & Footer */}
			<footer className="mt-auto bg-card pt-16 pb-12 relative overflow-hidden">
				{/* Giant Watermark */}
				<div className="text-center pointer-events-none select-none my-8">
					<h2 className="text-5xl sm:text-8xl font-black tracking-tighter uppercase font-mono bg-gradient-to-r from-foreground/20 via-primary/30 to-foreground/20 bg-clip-text text-transparent">
						rbuilder
					</h2>
					<p className="text-base font-semibold text-muted-foreground mt-2">By the community, for the community.</p>
				</div>

				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-border/40 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-y-4">
					<div className="flex items-center gap-x-3">
						<BrandIcon variant="logo" className="text-lg" />
					</div>
					<p>© {new Date().getFullYear()} rbuilder. Free & Standalone Resume Builder.</p>
				</div>
			</footer>
		</div>
	);
}
