import { ChatTeardropDotsIcon, HeartIcon, PaperPlaneIcon, StarIcon, UserCheckIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

type FeedbackItem = {
	id: string;
	name: string;
	rating: number;
	description: string;
	date: string;
	gradient: string;
};

const initialFeedbacks: FeedbackItem[] = [
	{
		id: "1",
		name: "Alex Rivera",
		rating: 5,
		description: "rbuilder helped me land my dream job at Tech Corp! The ATS templates are incredible.",
		date: "Just now",
		gradient: "from-blue-500 via-indigo-500 to-purple-600",
	},
	{
		id: "2",
		name: "Sophia Chen",
		rating: 5,
		description: "The design precision and instant PDF exports are top tier. Best resume builder!",
		date: "2h ago",
		gradient: "from-purple-500 via-pink-500 to-rose-600",
	},
	{
		id: "3",
		name: "Marcus Vance",
		rating: 5,
		description: "Completely free with no hidden paywalls. Created 3 resume variations in minutes.",
		date: "5h ago",
		gradient: "from-emerald-500 via-teal-500 to-cyan-600",
	},
	{
		id: "4",
		name: "Elena Rostova",
		rating: 5,
		description: "Super fast, beautiful layouts, and very easy to customize. Highly recommended!",
		date: "1d ago",
		gradient: "from-amber-500 via-orange-500 to-red-600",
	},
];

export function Testimonials() {
	const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(() => {
		if (typeof window !== "undefined") {
			const saved = localStorage.getItem("rbuilder_user_feedbacks");
			if (saved) {
				try {
					return JSON.parse(saved) as FeedbackItem[];
				} catch {
					// fallback
				}
			}
		}
		return initialFeedbacks;
	});

	const [name, setName] = useState("");
	const [rating, setRating] = useState(5);
	const [hoverRating, setHoverRating] = useState(0);
	const [description, setDescription] = useState("");
	const [isSubmitted, setIsSubmitted] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			localStorage.setItem("rbuilder_user_feedbacks", JSON.stringify(feedbacks));
		}
	}, [feedbacks]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !description.trim()) return;

		const gradients = [
			"from-blue-500 via-indigo-500 to-purple-600",
			"from-purple-500 via-pink-500 to-rose-600",
			"from-emerald-500 via-teal-500 to-cyan-600",
			"from-amber-500 via-orange-500 to-red-600",
			"from-violet-500 via-fuchsia-500 to-pink-600",
		];

		const newFeedback: FeedbackItem = {
			id: Date.now().toString(),
			name: name.trim(),
			rating,
			description: description.trim(),
			date: "Just now",
			gradient: gradients[Math.floor(Math.random() * gradients.length)],
		};

		setFeedbacks((prev) => [newFeedback, ...prev]);
		setName("");
		setRating(5);
		setDescription("");
		setIsSubmitted(true);

		setTimeout(() => setIsSubmitted(false), 3000);
	};

	const getInitials = (str: string) => {
		const parts = str.trim().split(" ");
		if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
		return str.slice(0, 2).toUpperCase();
	};

	return (
		<section className="relative overflow-hidden px-6 py-24 md:py-32">
			{/* Custom 360-degree rotating orbit CSS animation */}
			<style>{`
				@keyframes orbitRotate {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
				@keyframes counterRotate {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(-360deg); }
				}
				@keyframes floatPulse {
					0%, 100% { transform: translateY(0px) scale(1); }
					50% { transform: translateY(-10px) scale(1.03); }
				}
				.animate-orbit-rotate {
					animation: orbitRotate 30s linear infinite;
				}
				.animate-orbit-rotate:hover {
					animation-play-state: paused;
				}
				.animate-counter-rotate {
					animation: counterRotate 30s linear infinite;
				}
				.animate-counter-rotate:hover {
					animation-play-state: paused;
				}
				.animate-float-pulse {
					animation: floatPulse 4s ease-in-out infinite;
				}
			`}</style>

			{/* Ambient background glow */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-30"
			>
				<div className="size-[600px] animate-pulse rounded-full bg-gradient-to-tr from-primary/30 via-purple-600/20 to-blue-600/30 blur-3xl" />
			</div>

			<div className="relative mx-auto max-w-6xl">
				{/* Section Header */}
				<div className="flex flex-col items-center text-center">
					<div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 font-medium text-xs text-primary shadow-inner">
						<HeartIcon weight="fill" className="size-4 animate-bounce text-red-500" />
						<span>User Feedback Showcase</span>
					</div>

					<h2 className="mt-6 max-w-3xl font-extrabold text-3xl tracking-tight sm:text-4xl md:text-5xl">
						What Our Users Say
					</h2>

					<p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed sm:text-lg">
						Submit your feedback below and watch your review join the live 360° rotating circle animated showcase!
					</p>
				</div>

				{/* ROTATING CIRCLE ANIMATED SHOWCASE */}
				<div className="mt-16 relative flex items-center justify-center min-h-[420px] sm:min-h-[480px]">
					{/* Orbit Circle Path */}
					<div className="absolute size-[320px] sm:size-[440px] md:size-[500px] rounded-full border border-dashed border-primary/30 opacity-60" />

					{/* Center Core Badge */}
					<div className="relative z-10 flex flex-col items-center justify-center size-28 sm:size-36 rounded-full bg-gradient-to-tr from-primary via-indigo-600 to-purple-600 text-white shadow-2xl shadow-primary/40 ring-4 ring-background">
						<ChatTeardropDotsIcon weight="fill" className="size-8 sm:size-10 animate-bounce" />
						<span className="mt-1 font-bold text-xs sm:text-sm tracking-wide">rbuilder</span>
						<span className="text-[10px] text-white/80 font-medium">Feedback</span>
					</div>

					{/* 360° Rotating Circle Orbit Container */}
					<div className="animate-orbit-rotate absolute inset-0 flex items-center justify-center">
						{feedbacks.map((item, index) => {
							const total = feedbacks.length;
							const angle = (index / total) * 360;
							const radius = typeof window !== "undefined" && window.innerWidth < 640 ? 150 : 220;
							const x = Math.cos((angle * Math.PI) / 180) * radius;
							const y = Math.sin((angle * Math.PI) / 180) * radius;

							return (
								<div
									key={item.id}
									style={{
										transform: `translate(${x}px, ${y}px)`,
									}}
									className="absolute flex items-center justify-center cursor-pointer group"
								>
									{/* Counter Rotate so Card/Circle stays upright */}
									<div className="animate-counter-rotate relative flex flex-col items-center">
										{/* Animated Glowing Circle Badge */}
										<div className="relative flex size-16 sm:size-20 items-center justify-center rounded-full bg-gradient-to-tr p-[3px] shadow-xl transition-transform duration-300 group-hover:scale-125">
											<div className={`size-full rounded-full bg-gradient-to-tr ${item.gradient} p-[2px]`}>
												<div className="flex size-full items-center justify-center rounded-full bg-background font-extrabold text-foreground text-sm sm:text-base shadow-inner">
													{getInitials(item.name)}
												</div>
											</div>
											<div className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md ring-2 ring-background">
												<UserCheckIcon weight="bold" className="size-3" />
											</div>
										</div>

										{/* Floating Tooltip Card on Hover */}
										<div className="absolute bottom-full mb-3 hidden w-64 rounded-2xl border border-border/80 bg-background/95 p-4 shadow-2xl backdrop-blur-xl group-hover:flex group-hover:flex-col z-30 animate-in fade-in zoom-in-95">
											<div className="flex items-center justify-between">
												<span className="font-bold text-foreground text-sm">{item.name}</span>
												<div className="flex text-amber-400">
													{Array.from({ length: item.rating }).map((_, i) => (
														// biome-ignore lint/suspicious/noArrayIndexKey: rating key
														<StarIcon key={i} weight="fill" className="size-3.5" />
													))}
												</div>
											</div>
											<p className="mt-2 text-xs text-foreground/90 leading-relaxed italic">"{item.description}"</p>
											<span className="mt-2 text-[10px] text-muted-foreground">{item.date}</span>
										</div>

										{/* Name below Circle */}
										<span className="mt-2 font-bold text-foreground text-xs tracking-tight whitespace-nowrap shadow-sm">
											{item.name}
										</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* INTERACTIVE FEEDBACK FORM */}
				<div className="mt-20 mx-auto max-w-xl rounded-3xl border border-primary/20 bg-background/80 p-8 shadow-2xl backdrop-blur-xl">
					<div className="flex items-center gap-3 border-b border-border/60 pb-4">
						<div className="flex size-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
							<PaperPlaneIcon weight="fill" className="size-5" />
						</div>
						<div>
							<h3 className="font-bold text-foreground text-lg">Give Your Feedback</h3>
							<p className="text-muted-foreground text-xs">Fill out your name, rating, and review to join the circle!</p>
						</div>
					</div>

					{isSubmitted && (
						<div className="mt-6 flex items-center justify-center rounded-2xl bg-emerald-500/10 p-4 text-emerald-500 border border-emerald-500/30">
							<UserCheckIcon weight="bold" className="size-5 mr-2" />
							<span className="font-semibold text-sm">Thank you! Your feedback has joined the rotating circle showcase.</span>
						</div>
					)}

					<form onSubmit={handleSubmit} className="mt-6 space-y-5">
						{/* Name Input */}
						<div>
							<label htmlFor="feedback-name" className="block text-xs font-semibold text-foreground">
								Your Name
							</label>
							<input
								id="feedback-name"
								type="text"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter your name"
								className="mt-1.5 w-full rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
							/>
						</div>

						{/* Star Rating Input */}
						<div>
							<label className="block text-xs font-semibold text-foreground">Rating</label>
							<div className="mt-1.5 flex items-center gap-1">
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
								<span className="ml-2 font-bold text-sm text-muted-foreground">{rating} / 5</span>
							</div>
						</div>

						{/* Description Input */}
						<div>
							<label htmlFor="feedback-description" className="block text-xs font-semibold text-foreground">
								Feedback / Review
							</label>
							<textarea
								id="feedback-description"
								required
								rows={3}
								value={description}
								onChange={(e) => setDescription(e.target.value)}
								placeholder="Share your thoughts about rbuilder..."
								className="mt-1.5 w-full rounded-xl border border-border bg-muted/40 p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
							/>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							className="w-full flex h-12 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-indigo-600 to-purple-600 font-bold text-white text-sm shadow-xl shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98]"
						>
							<PaperPlaneIcon weight="fill" className="size-4" />
							<span>Submit Feedback</span>
						</button>
					</form>
				</div>
			</div>
		</section>
	);
}
