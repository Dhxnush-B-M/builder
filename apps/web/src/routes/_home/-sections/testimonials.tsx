import { ChatTeardropDotsIcon, HeartIcon, PaperPlaneIcon, StarIcon, UserCheckIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";

type Testimonial = {
	id: string;
	name: string;
	role: string;
	company: string;
	avatar: string;
	gradient: string;
	content: string;
	rating: number;
	floatDelay: string;
};

const testimonials: Testimonial[] = [
	{
		id: "1",
		name: "Alex Rivera",
		role: "Senior Software Engineer",
		company: "Tech Corp",
		avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
		gradient: "from-blue-500 via-indigo-500 to-purple-600",
		content:
			"rbuilder completely changed how I present my experience. The real-time preview and ATS-friendly templates landed me interviews at top tech companies within a week!",
		rating: 5,
		floatDelay: "0s",
	},
	{
		id: "2",
		name: "Sophia Chen",
		role: "Product Designer",
		company: "Creative Studio",
		avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
		gradient: "from-purple-500 via-pink-500 to-rose-600",
		content:
			"The typography and design precision are top tier. I created three variations of my resume in minutes. Absolutely flawless experience!",
		rating: 5,
		floatDelay: "1.5s",
	},
	{
		id: "3",
		name: "Marcus Vance",
		role: "Data Analyst",
		company: "Analytics Co",
		avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
		gradient: "from-emerald-500 via-teal-500 to-cyan-600",
		content:
			"Fast, privacy-focused, and completely free! No hidden paywalls when exporting to PDF. rbuilder is hands down the best resume builder available.",
		rating: 5,
		floatDelay: "3s",
	},
	{
		id: "4",
		name: "Elena Rostova",
		role: "Marketing Manager",
		company: "Global Brand",
		avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
		gradient: "from-amber-500 via-orange-500 to-red-600",
		content:
			"The custom section layout and instant PDF download are remarkable. Highly recommend rbuilder to anyone looking for a modern CV!",
		rating: 5,
		floatDelay: "4.5s",
	},
];

export function Testimonials() {
	const [isOpen, setIsOpen] = useState(false);
	const [userFeedback, setUserFeedback] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!userFeedback.trim()) return;
		setSubmitted(true);
		setTimeout(() => {
			setUserFeedback("");
			setSubmitted(false);
			setIsOpen(false);
		}, 2000);
	};

	return (
		<section className="relative overflow-hidden px-6 py-24 md:py-32">
			{/* Custom inline keyframes for smooth floating animated circles */}
			<style>{`
				@keyframes floatCircle {
					0%, 100% { transform: translateY(0px) rotate(0deg); }
					50% { transform: translateY(-16px) rotate(3deg); }
				}
				@keyframes orbitGlow {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
				.animate-float-circle {
					animation: floatCircle 4s ease-in-out infinite;
				}
				.animate-orbit-glow {
					animation: orbitGlow 8s linear infinite;
				}
			`}</style>

			{/* Ambient background glow */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30"
			>
				<div className="size-[550px] animate-pulse rounded-full bg-gradient-to-tr from-primary/30 via-purple-600/20 to-blue-600/30 blur-3xl" />
			</div>

			<div className="relative mx-auto max-w-6xl">
				{/* Section Header */}
				<div className="flex flex-col items-center text-center">
					<div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-medium text-xs text-primary shadow-inner">
						<HeartIcon weight="fill" className="size-4 animate-bounce text-red-500" />
						<span>User Feedback & Reviews</span>
					</div>

					<h2 className="mt-6 max-w-3xl font-extrabold text-3xl tracking-tight sm:text-4xl md:text-5xl">
						Loved by Job Seekers Worldwide
					</h2>

					<p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-lg">
						See how rbuilder empowers professionals to build standout, ATS-compliant resumes and land their dream jobs.
					</p>
				</div>

				{/* MOVING ANIMATED CIRCLES SHOWCASE */}
				<div className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
					{testimonials.map((t) => (
						<div
							key={t.id}
							style={{ animationDelay: t.floatDelay }}
							className="animate-float-circle group relative flex flex-col items-center cursor-pointer"
						>
							{/* Rotating Gradient Ring */}
							<div className="relative flex size-24 items-center justify-center transition-transform duration-300 group-hover:scale-115 sm:size-28">
								<div className="animate-orbit-glow absolute inset-0 rounded-full bg-gradient-to-r from-primary via-indigo-500 to-purple-600 p-[3px] shadow-lg shadow-primary/30 group-hover:shadow-primary/60">
									<div className="size-full rounded-full bg-background" />
								</div>

								{/* Circular Avatar */}
								<div className="relative z-10 flex size-[82px] items-center justify-center overflow-hidden rounded-full bg-muted shadow-inner sm:size-[98px]">
									<img
										src={t.avatar}
										alt={t.name}
										className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
										loading="lazy"
									/>
								</div>

								{/* Floating Checkmark Badge */}
								<div className="absolute -bottom-1 -right-1 z-20 flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background transition-transform group-hover:scale-125">
									<UserCheckIcon weight="bold" className="size-4" />
								</div>
							</div>

							<span className="mt-4 font-bold text-foreground text-sm tracking-tight">{t.name}</span>
							<span className="text-xs text-muted-foreground">{t.role}</span>
						</div>
					))}
				</div>

				{/* Testimonial Cards Grid */}
				<div className="mt-16 grid gap-8 md:grid-cols-3">
					{testimonials.slice(0, 3).map((item) => (
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

				{/* Bottom Interactive Feedback Banner */}
				<div className="mt-16 flex flex-col items-center justify-between gap-6 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 via-purple-600/10 to-indigo-600/10 p-8 text-center sm:flex-row sm:text-left shadow-lg">
					<div className="flex items-center gap-4">
						<div className="flex size-14 items-center justify-center rounded-2xl bg-primary/20 text-primary shadow-inner shrink-0">
							<ChatTeardropDotsIcon weight="fill" className="size-7" />
						</div>
						<div>
							<h3 className="font-bold text-foreground text-lg">We Value Your Feedback!</h3>
							<p className="text-muted-foreground text-sm">Tell us how rbuilder helped you or share suggestions to improve.</p>
						</div>
					</div>

					<button
						type="button"
						onClick={() => setIsOpen(true)}
						className="inline-flex h-11 items-center gap-2 justify-center rounded-xl bg-primary px-6 font-semibold text-primary-foreground text-sm shadow-xl transition-transform hover:scale-105 active:scale-95 shrink-0"
					>
						<PaperPlaneIcon weight="fill" className="size-4" />
						<span>Give Feedback</span>
					</button>
				</div>
			</div>

			{/* Interactive Feedback Modal */}
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
					<div className="relative w-full max-w-md rounded-3xl border border-border bg-background p-6 shadow-2xl animate-in fade-in zoom-in-95">
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
						>
							<XIcon className="size-5" />
						</button>

						{submitted ? (
							<div className="flex flex-col items-center py-8 text-center">
								<div className="flex size-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
									<UserCheckIcon weight="bold" className="size-8" />
								</div>
								<h3 className="mt-4 font-bold text-xl text-foreground">Thank You!</h3>
								<p className="mt-2 text-muted-foreground text-sm">Your feedback has been submitted successfully.</p>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-4">
								<h3 className="font-bold text-xl text-foreground">Send Us Feedback</h3>
								<p className="text-muted-foreground text-sm">Share your thoughts on rbuilder.</p>
								<textarea
									required
									rows={4}
									value={userFeedback}
									onChange={(e) => setUserFeedback(e.target.value)}
									placeholder="Write your feedback or review here..."
									className="w-full rounded-xl border border-border bg-muted/50 p-3 text-sm text-foreground focus:border-primary focus:outline-none"
								/>
								<div className="flex justify-end gap-3">
									<button
										type="button"
										onClick={() => setIsOpen(false)}
										className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:text-foreground"
									>
										Cancel
									</button>
									<button
										type="submit"
										className="rounded-xl bg-primary px-5 py-2 font-semibold text-primary-foreground text-sm hover:opacity-90"
									>
										Submit
									</button>
								</div>
							</form>
						)}
					</div>
				</div>
			)}
		</section>
	);
}
