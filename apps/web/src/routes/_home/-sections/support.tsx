import {
	EnvelopeSimpleIcon,
	FileTextIcon,
	GlobeIcon,
	HeadsetIcon,
	LightningIcon,
	PhoneCallIcon,
	ShieldCheckIcon,
	SparkleIcon,
	TranslateIcon,
	UserCheckIcon,
} from "@phosphor-icons/react";

const flyingLogos = [
	{ id: 1, name: "Gmail", icon: EnvelopeSimpleIcon, color: "text-red-500", glow: "shadow-red-500/30", delay: "0s" },
	{ id: 2, name: "Phone", icon: PhoneCallIcon, color: "text-emerald-500", glow: "shadow-emerald-500/30", delay: "1.2s" },
	{ id: 3, name: "Support", icon: HeadsetIcon, color: "text-blue-500", glow: "shadow-blue-500/30", delay: "2.4s" },
	{ id: 4, name: "Resume", icon: FileTextIcon, color: "text-indigo-500", glow: "shadow-indigo-500/30", delay: "3.6s" },
	{ id: 5, name: "Global", icon: GlobeIcon, color: "text-cyan-500", glow: "shadow-cyan-500/30", delay: "4.8s" },
	{ id: 6, name: "Language", icon: TranslateIcon, color: "text-purple-500", glow: "shadow-purple-500/30", delay: "0.6s" },
	{ id: 7, name: "AI Builder", icon: SparkleIcon, color: "text-amber-500", glow: "shadow-amber-500/30", delay: "1.8s" },
	{ id: 8, name: "Speed", icon: LightningIcon, color: "text-yellow-500", glow: "shadow-yellow-500/30", delay: "3.0s" },
	{ id: 9, name: "Verified", icon: UserCheckIcon, color: "text-teal-500", glow: "shadow-teal-500/30", delay: "4.2s" },
	{ id: 10, name: "Security", icon: ShieldCheckIcon, color: "text-rose-500", glow: "shadow-rose-500/30", delay: "5.4s" },
];

export function Support() {
	return (
		<section className="relative overflow-hidden px-6 py-24 md:py-32 border-t border-border">
			{/* Inline CSS Keyframes for Flying, Blinking, and Pulsing Logos */}
			<style>{`
				@keyframes flyBlink {
					0%, 100% { transform: translateY(0px) scale(1); opacity: 0.8; }
					25% { transform: translateY(-18px) scale(1.1); opacity: 1; filter: drop-shadow(0 0 12px currentColor); }
					50% { transform: translateY(6px) scale(0.95); opacity: 0.6; }
					75% { transform: translateY(-10px) scale(1.05); opacity: 1; }
				}
				@keyframes pulseGlow {
					0%, 100% { opacity: 0.3; transform: scale(1); }
					50% { opacity: 0.7; transform: scale(1.1); }
				}
				.animate-fly-blink {
					animation: flyBlink 5s ease-in-out infinite;
				}
				.animate-pulse-glow {
					animation: pulseGlow 4s ease-in-out infinite;
				}
			`}</style>

			{/* Background Ambient Glow */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-25"
			>
				<div className="size-[650px] animate-pulse-glow rounded-full bg-gradient-to-tr from-blue-600/30 via-indigo-600/20 to-purple-600/30 blur-3xl" />
			</div>

			<div className="relative mx-auto max-w-6xl">
				{/* Section Header */}
				<div className="flex flex-col items-center text-center">
					<div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-medium text-xs text-primary shadow-inner">
						<HeadsetIcon className="size-4 animate-bounce text-primary" />
						<span>24/7 Dedicated Support & Assistance</span>
					</div>

					<h2 className="mt-6 max-w-3xl font-extrabold text-3xl tracking-tight sm:text-4xl md:text-5xl">
						Always Supported, Whenever You Need Us
					</h2>

					<p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-lg">
						Have questions or need assistance? Our support team is active 24/7. Email us directly at{" "}
						<a
							href="mailto:karthikdhanush686@gmail.com"
							className="font-semibold text-primary underline underline-offset-4 hover:opacity-80"
						>
							karthikdhanush686@gmail.com
						</a>
					</p>
				</div>

				{/* CENTER ANIMATED 10 LOGOS FLYING & BLINKING SHOWCASE */}
				<div className="mt-16 relative flex items-center justify-center py-10">
					<div className="grid grid-cols-5 gap-6 sm:gap-10 md:gap-14">
						{flyingLogos.map((logo) => {
							const Icon = logo.icon;
							return (
								<div
									key={logo.id}
									style={{ animationDelay: logo.delay }}
									className="animate-fly-blink group flex flex-col items-center justify-center"
								>
									<div
										className={`relative flex size-14 sm:size-20 items-center justify-center rounded-3xl border border-border/80 bg-background/80 p-4 shadow-xl backdrop-blur-xl transition-all duration-300 group-hover:scale-125 group-hover:border-primary/50 ${logo.glow}`}
									>
										<Icon className={`size-7 sm:size-10 ${logo.color} transition-transform duration-300 group-hover:scale-110`} />
										<span className="absolute -top-1 -right-1 flex size-3 rounded-full bg-primary animate-ping" />
									</div>
									<span className="mt-2 text-[11px] sm:text-xs font-semibold text-muted-foreground tracking-tight group-hover:text-foreground">
										{logo.name}
									</span>
								</div>
							);
						})}
					</div>
				</div>

				{/* THREE FEATURE SUPPORT CARDS */}
				<div className="mt-16 grid gap-8 md:grid-cols-3">
					{/* Card 1: 24/7 Full Calling Support */}
					<div className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-background/60 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10">
						<div className="absolute top-0 right-8 left-8 h-[2px] rounded-full bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

						<div>
							<div className="flex items-center justify-between">
								<div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-500 shadow-inner">
									<PhoneCallIcon weight="fill" className="size-7 animate-pulse" />
								</div>
								<span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 font-bold text-[11px] text-emerald-500">
									<span className="size-2 rounded-full bg-emerald-500 animate-ping" />
									24/7 Active
								</span>
							</div>

							<h3 className="mt-6 font-bold text-foreground text-xl tracking-tight">
								24/7 Full Calling & Live Support
							</h3>

							<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
								Direct help available round the clock. Get immediate assistance with template customization, PDF exports, and account management anytime.
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

					{/* Card 2: Full Help to Build Resume */}
					<div className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-background/60 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10">
						<div className="absolute top-0 right-8 left-8 h-[2px] rounded-full bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

						<div>
							<div className="flex items-center justify-between">
								<div className="flex size-14 items-center justify-center rounded-2xl bg-primary/20 text-primary shadow-inner">
									<SparkleIcon weight="fill" className="size-7 animate-pulse" />
								</div>
								<span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 font-bold text-[11px] text-primary">
									Full Assistance
								</span>
							</div>

							<h3 className="mt-6 font-bold text-foreground text-xl tracking-tight">
								Full Help to Build Resume
							</h3>

							<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
								Step-by-step guidance to craft job-winning resumes. Our smart tools and expert recommendations help tailor your experience for ATS filters.
							</p>
						</div>

						<div className="mt-8 border-t border-border/50 pt-6">
							<a
								href="/auth/register"
								className="inline-flex items-center gap-2 font-semibold text-primary text-sm hover:underline"
							>
								<FileTextIcon weight="bold" className="size-4" />
								<span>Start Building Now &rarr;</span>
							</a>
						</div>
					</div>

					{/* Card 3: Most Language Support */}
					<div className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-background/60 p-8 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10">
						<div className="absolute top-0 right-8 left-8 h-[2px] rounded-full bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

						<div>
							<div className="flex items-center justify-between">
								<div className="flex size-14 items-center justify-center rounded-2xl bg-purple-500/20 text-purple-500 shadow-inner">
									<GlobeIcon weight="fill" className="size-7 animate-pulse" />
								</div>
								<span className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 font-bold text-[11px] text-purple-500">
									50+ Languages
								</span>
							</div>

							<h3 className="mt-6 font-bold text-foreground text-xl tracking-tight">
								Most Multi-Language Support
							</h3>

							<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
								Create resumes in over 50+ languages with full RTL support, localized date formats, and global typography for international career opportunities.
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
	);
}
