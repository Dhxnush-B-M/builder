import type { FormEvent } from "react";
import { PaperPlaneIcon, StarIcon, UserCheckIcon, XIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

type Testimonial = {
	id: string;
	name: string;
	description: string;
	date: string;
	gradient: string;
	rating: number;
};

const initialTestimonials: Testimonial[] = [
	{
		id: "1",
		name: "Dhxnush B M",
		description: "Building rbuilder has been an extraordinary journey empowering millions worldwide.",
		date: "Founder",
		gradient: "from-blue-500 via-indigo-500 to-purple-500",
		rating: 5,
	},
	{
		id: "2",
		name: "Sarah Jenkins",
		description: "The live preview and instant PDF exports saved me days of work!",
		date: "2 days ago",
		gradient: "from-emerald-400 via-teal-500 to-cyan-600",
		rating: 5,
	},
	{
		id: "3",
		name: "Alex Morgan",
		description: "Truly the best free ATS resume builder. Hands down superior to paid options.",
		date: "1 week ago",
		gradient: "from-rose-500 via-pink-500 to-amber-500",
		rating: 5,
	},
	{
		id: "4",
		name: "David Chen",
		description: "Landed 3 interview callbacks in my first week using the Ditgar template!",
		date: "2 weeks ago",
		gradient: "from-violet-600 via-purple-500 to-fuchsia-500",
		rating: 5,
	},
	{
		id: "5",
		name: "Elena Rostova",
		description: "The local data privacy gives me total peace of mind. Fantastic application.",
		date: "3 weeks ago",
		gradient: "from-amber-400 via-orange-500 to-red-500",
		rating: 5,
	},
	{
		id: "6",
		name: "Marcus Vance",
		description: "Clean typography, fast rendering, and instant customization. Loved it!",
		date: "1 month ago",
		gradient: "from-cyan-400 via-blue-500 to-indigo-600",
		rating: 5,
	},
	{
		id: "7",
		name: "Priya Sharma",
		description: "Multilingual support allowed me to craft resumes in both English and Hindi effortlessly.",
		date: "1 month ago",
		gradient: "from-fuchsia-500 via-pink-500 to-rose-400",
		rating: 5,
	},
	{
		id: "8",
		name: "Omar Al-Mansoor",
		description: "High quality export and total freedom. Highly recommended for job seekers everywhere.",
		date: "2 months ago",
		gradient: "from-emerald-500 via-emerald-600 to-teal-700",
		rating: 5,
	},
];

function getInitials(name: string) {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);
}

function playCenterClickSound() {
	try {
		const AudioCtx =
			window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
		if (!AudioCtx) return;
		const ctx = new AudioCtx();
		const osc = ctx.createOscillator();
		const gain = ctx.createGain();
		osc.type = "sine";
		osc.frequency.setValueAtTime(520, ctx.currentTime);
		osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.1);
		gain.gain.setValueAtTime(0.3, ctx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
		osc.connect(gain);
		gain.connect(ctx.destination);
		osc.start();
		osc.stop(ctx.currentTime + 0.1);
	} catch {
		// ignore
	}
}

export function Testimonials() {
	const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>(initialTestimonials);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isSubmitted, setIsSubmitted] = useState(false);

	const [name, setName] = useState("");
	const [rating, setRating] = useState(5);
	const [hoverRating, setHoverRating] = useState(0);
	const [description, setDescription] = useState("");

	useEffect(() => {
		let isMounted = true;
		import("@/libs/supabase/db").then(({ getFeedbacksFromSupabase, getRegisteredProfilesFromSupabase }) => {
			Promise.allSettled([getFeedbacksFromSupabase(), getRegisteredProfilesFromSupabase()]).then(([fbRes, profRes]) => {
				if (!isMounted) return;

				const feedbacks = fbRes.status === "fulfilled" ? fbRes.value : [];
				const profiles = profRes.status === "fulfilled" ? profRes.value : [];

				const feedbackTestimonials: Testimonial[] = feedbacks.map((fb, idx) => ({
					id: fb.id,
					name: fb.name,
					description: fb.description,
					date: fb.created_at
						? new Date(fb.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })
						: "Verified Feedback",
					gradient: initialTestimonials[idx % initialTestimonials.length].gradient,
					rating: fb.rating || 5,
				}));

				const profileTestimonials: Testimonial[] = profiles.map((p, idx) => ({
					id: p.id || `profile-${idx}`,
					name: p.name || (p.email ? p.email.split("@")[0] : "User"),
					description: "Active user on rbuilder crafting professional ATS resumes.",
					date: "Registered User",
					gradient: initialTestimonials[(idx + feedbackTestimonials.length) % initialTestimonials.length].gradient,
					rating: 5,
				}));

				const combined = [...feedbackTestimonials, ...profileTestimonials, ...initialTestimonials];
				const uniqueMap = new Map<string, Testimonial>();
				for (const item of combined) {
					if (!uniqueMap.has(item.name)) {
						uniqueMap.set(item.name, item);
					}
				}

				setTestimonialsList(Array.from(uniqueMap.values()));
			});
		});

		return () => {
			isMounted = false;
		};
	}, []);

	function handleCenterCircleClick() {
		playCenterClickSound();
		setIsModalOpen(true);
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!name || !description) return;

		const newTestimonial: Testimonial = {
			id: String(Date.now()),
			name,
			description,
			date: "Just now",
			gradient: "from-primary via-indigo-500 to-purple-500",
			rating,
		};

		setTestimonialsList((prev) => [newTestimonial, ...prev]);
		setIsSubmitted(true);

		// Save feedback directly to Supabase DB & LocalStorage fallback
		import("@/libs/supabase/db").then(({ saveFeedbackToSupabase }) => {
			void saveFeedbackToSupabase({ name, description, rating });
		});

		setTimeout(() => {
			setIsModalOpen(false);
			setIsSubmitted(false);
			setName("");
			setDescription("");
			setRating(5);
		}, 1800);
	}

	return (
		<section id="testimonials" className="relative overflow-hidden border-border/40 border-b py-20 md:py-28">
			<style>{`
				@keyframes orbit {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
				@keyframes counterRotate {
					from { transform: rotate(0deg); }
					to { transform: rotate(-360deg); }
				}
				.animate-orbit {
					animation: orbit 40s linear infinite;
				}
				.animate-counter-rotate {
					animation: counterRotate 40s linear infinite;
				}
				.animate-orbit:hover, .animate-orbit:hover .animate-counter-rotate {
					animation-play-state: paused;
				}
			`}</style>

			<div className="container mx-auto px-4">
				<div className="flex flex-col items-center space-y-4 text-center">
					<h2 className="bg-gradient-to-r from-foreground via-primary to-indigo-500 bg-clip-text font-extrabold text-3xl text-transparent tracking-tight sm:text-4xl md:text-5xl">
						Loved by Professionals Worldwide
					</h2>

					<p className="max-w-2xl text-base text-muted-foreground leading-relaxed md:text-lg">
						Click the center <span className="font-semibold text-primary">rbuilder</span> logo to submit feedback or
						view active platform users.
					</p>
				</div>

				{/* 360 DEGREE ROTATING CIRCLE STAGE */}
				<div className="relative mt-16 flex h-[480px] w-full items-center justify-center overflow-hidden sm:h-[540px]">
					{/* CLICKABLE CENTER RBUILDER LOGO CIRCLE */}
					<button
						type="button"
						onClick={handleCenterCircleClick}
						title="Click to give feedback!"
						aria-label="Click to give feedback and play sound"
						className="absolute z-20 flex size-20 cursor-pointer items-center justify-center rounded-full border-2 border-emerald-500/50 bg-black p-2 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-emerald-400 hover:shadow-emerald-500/40 active:scale-95 sm:size-24"
					>
						<img src="/opengraph/logo.png" alt="rbuilder logo" className="size-full rounded-full object-cover" />
					</button>

					{/* Orbit Ring Container */}
					<div className="relative flex size-[360px] animate-orbit items-center justify-center rounded-full border border-primary/30 border-dashed sm:size-[450px]">
						{testimonialsList.map((item, index) => {
							const angle = (360 / testimonialsList.length) * index;
							const radius = typeof window !== "undefined" && window.innerWidth < 640 ? 180 : 225;
							const x = Math.cos((angle * Math.PI) / 180) * radius;
							const y = Math.sin((angle * Math.PI) / 180) * radius;

							return (
								<div
									key={item.id}
									style={{
										transform: `translate(${x}px, ${y}px)`,
									}}
									className="group absolute flex cursor-pointer items-center justify-center"
								>
									<div className="relative flex animate-counter-rotate flex-col items-center">
										<div className="relative flex size-14 items-center justify-center rounded-full bg-gradient-to-tr p-[3px] shadow-xl transition-transform duration-300 group-hover:scale-125 sm:size-18">
											<div className={`size-full rounded-full bg-gradient-to-tr ${item.gradient} p-[2px]`}>
												<div className="flex size-full items-center justify-center rounded-full bg-background font-extrabold text-foreground text-xs shadow-inner sm:text-sm">
													{getInitials(item.name)}
												</div>
											</div>
											<div className="absolute -right-1 -bottom-1 flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
												<UserCheckIcon weight="bold" className="size-3" />
											</div>
										</div>

										{/* Floating Tooltip Card on Hover */}
										<div className="absolute bottom-full z-30 mb-3 hidden w-64 rounded-2xl border border-border/80 bg-background/95 p-4 shadow-2xl backdrop-blur-xl transition-all group-hover:flex group-hover:flex-col">
											<div className="flex items-center justify-between">
												<span className="font-bold text-foreground text-sm">{item.name}</span>
												<div className="flex text-amber-400">
													{Array.from({ length: item.rating }).map((_, i) => (
														<StarIcon key={i} weight="fill" className="size-3.5" />
													))}
												</div>
											</div>
											<p className="mt-2 text-foreground/90 text-xs italic leading-relaxed">"{item.description}"</p>
											<span className="mt-2 text-[10px] text-muted-foreground">{item.date}</span>
										</div>

										<span className="mt-2 whitespace-nowrap font-bold text-foreground text-xs tracking-tight shadow-sm">
											{item.name}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>

			{/* POPUP MODAL DIALOG */}
			{isModalOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
					<div className="relative w-full max-w-lg rounded-3xl border border-primary/30 bg-background/95 p-8 shadow-2xl backdrop-blur-2xl">
						<button
							type="button"
							onClick={() => setIsModalOpen(false)}
							className="absolute top-5 right-5 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						>
							<XIcon className="size-5" />
						</button>

						{isSubmitted ? (
							<div className="flex flex-col items-center py-8 text-center">
								<div className="flex size-16 animate-bounce items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
									<UserCheckIcon weight="bold" className="size-8" />
								</div>
								<h3 className="mt-4 font-bold text-foreground text-xl">Thank You!</h3>
								<p className="mt-2 text-muted-foreground text-sm">
									Your feedback has joined the 360° rotating circle showcase!
								</p>
							</div>
						) : (
							<div>
								<div className="flex items-center gap-3 border-border/60 border-b pb-4">
									<div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/20 text-primary">
										<PaperPlaneIcon weight="fill" className="size-6" />
									</div>
									<div>
										<h3 className="font-bold text-foreground text-xl">Give Your Feedback</h3>
										<p className="text-muted-foreground text-xs">
											Fill out your name, rating, and review to join the circle!
										</p>
									</div>
								</div>

								<form onSubmit={handleSubmit} className="mt-6 space-y-5">
									<div>
										<label htmlFor="modal-name" className="block font-semibold text-foreground text-xs">
											Your Name
										</label>
										<input
											id="modal-name"
											type="text"
											required
											value={name}
											onChange={(e) => setName(e.target.value)}
											placeholder="Enter your name"
											className="mt-1.5 w-full rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-foreground text-sm transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
										/>
									</div>

									<div>
										<label className="block font-semibold text-foreground text-xs">Rating</label>
										<div className="mt-1.5 flex items-center gap-1.5">
											{[1, 2, 3, 4, 5].map((star) => (
												<button
													key={star}
													type="button"
													onClick={() => setRating(star)}
													onMouseEnter={() => setHoverRating(star)}
													onMouseLeave={() => setHoverRating(0)}
													className="p-1 transition-transform hover:scale-125 focus:outline-none"
												>
													<StarIcon
														weight="fill"
														className={`size-7 ${
															star <= (hoverRating || rating) ? "text-amber-400" : "text-muted-foreground/30"
														}`}
													/>
												</button>
											))}
											<span className="ml-2 font-bold text-muted-foreground text-sm">{rating} / 5</span>
										</div>
									</div>

									<div>
										<label htmlFor="modal-description" className="block font-semibold text-foreground text-xs">
											Feedback / Review
										</label>
										<textarea
											id="modal-description"
											required
											rows={4}
											value={description}
											onChange={(e) => setDescription(e.target.value)}
											placeholder="Share your thoughts about rbuilder..."
											className="mt-1.5 w-full rounded-xl border border-border bg-muted/40 p-3.5 text-foreground text-sm transition-all placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
										/>
									</div>

									<button
										type="submit"
										className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-indigo-600 to-purple-600 font-bold text-sm text-white shadow-primary/25 shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
									>
										<PaperPlaneIcon weight="fill" className="size-4" />
										<span>Submit Feedback</span>
									</button>
								</form>
							</div>
						)}
					</div>
				</div>
			)}
		</section>
	);
}
