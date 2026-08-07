import { Trans } from "@lingui/react/macro";
import { CheckCircleIcon, PaperPlaneTiltIcon, QuotesIcon, SparkleIcon, StarIcon } from "@phosphor-icons/react";
import { m } from "motion/react";
import { useEffect, useState } from "react";
import { Button } from "@reactive-resume/ui/components/button";

const LOCAL_STORAGE_KEY = "rbuilder_user_testimonials";

type Testimonial = {
	id: string;
	name: string;
	role: string;
	content: string;
	stars: number;
};

const initialTestimonials: Testimonial[] = [
	{
		id: "t1",
		name: "Alex Rivera",
		role: "Senior Frontend Engineer",
		content:
			"rbuilder is by far the cleanest and most intuitive resume builder I've ever used. The live preview and ATS-friendly layouts helped me land interviews at top tech companies!",
		stars: 5,
	},
	{
		id: "t2",
		name: "Sarah Chen",
		role: "Product Manager",
		content:
			"The speed and customization options in rbuilder are incredible. I tailored 3 different resumes for target roles in under 15 minutes. Highly recommend!",
		stars: 5,
	},
	{
		id: "t3",
		name: "Michael Vance",
		role: "Data Scientist",
		content:
			"I love that rbuilder gives total data privacy without annoying paywalls. The high-resolution PDF exports look crisp and modern.",
		stars: 5,
	},
	{
		id: "t4",
		name: "Elena Rostova",
		role: "UX/UI Designer",
		content:
			"The design control in rbuilder is unmatched. Font pairs, custom spacing, section layouts—everything is fluid and easy to tweak.",
		stars: 5,
	},
	{
		id: "t5",
		name: "David Kowalski",
		role: "Full Stack Developer",
		content:
			"Imported my existing resume data, applied a fresh template, and had a job-winning CV ready instantly. Absolutely balance tool!",
		stars: 5,
	},
	{
		id: "t6",
		name: "Jessica Taylor",
		role: "Marketing Lead",
		content:
			"The 24/7 support and real-time live preview made resume building completely stress-free. Saved me hours of formatting headaches.",
		stars: 5,
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

export function Testimonials() {
	const [list, setList] = useState<Testimonial[]>(initialTestimonials);
	const [isPaused, setIsPaused] = useState(false);

	// Form State
	const [showForm, setShowForm] = useState(false);
	const [name, setName] = useState("");
	const [role, setRole] = useState("");
	const [content, setContent] = useState("");
	const [stars, setStars] = useState(5);
	const [isSubmitted, setIsSubmitted] = useState(false);

	// Load custom feedback from localStorage on mount
	useEffect(() => {
		try {
			const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
			if (saved) {
				const parsed = JSON.parse(saved) as Testimonial[];
				if (Array.isArray(parsed) && parsed.length > 0) {
					setList([...parsed, ...initialTestimonials]);
				}
			}
		} catch (e) {
			console.error("Failed to load user testimonials", e);
		}
	}, []);

	// Handle New Feedback Submission
	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (!name.trim() || !content.trim()) return;

		const newFeedback: Testimonial = {
			id: `user-${Date.now()}`,
			name: name.trim(),
			role: role.trim() || "Verified User",
			content: content.trim(),
			stars,
		};

		const updatedList = [newFeedback, ...list];
		setList(updatedList);

		// Save custom feedback
		try {
			const customOnly = updatedList.filter((item) => item.id.startsWith("user-"));
			localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(customOnly));
		} catch (err) {
			console.error("Failed to save feedback", err);
		}

		setIsSubmitted(true);
		setTimeout(() => {
			setIsSubmitted(false);
			setShowForm(false);
			setName("");
			setRole("");
			setContent("");
			setStars(5);
		}, 2000);
	};

	return (
		<section id="testimonials" className="relative overflow-hidden border-border/40 border-t py-16 md:py-24">
			{/* Header */}
			<m.div
				className="container mx-auto space-y-4 px-4 text-center will-change-[transform,opacity]"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.45 }}
			>
				<h2 className="bg-gradient-to-r from-foreground via-primary to-indigo-500 bg-clip-text font-extrabold text-3xl text-transparent tracking-tight sm:text-4xl md:text-5xl">
					<Trans>What Users Say About rbuilder</Trans>
				</h2>

				<p className="mx-auto max-w-2xl text-base text-muted-foreground leading-relaxed md:text-lg">
					<Trans>
						Explore real feedback in our rotating 3D orbit showcase or share your own experience with rbuilder below.
					</Trans>
				</p>

				{/* Action Buttons */}
				<div className="flex justify-center gap-4 pt-2">
					<Button onClick={() => setShowForm(!showForm)} className="gap-2 px-6 py-5 font-semibold text-sm shadow-md">
						<SparkleIcon className="size-4" weight="fill" />
						{showForm ? <Trans>Close Feedback Form</Trans> : <Trans>Share Your Feedback</Trans>}
					</Button>
				</div>
			</m.div>

			{/* Interactive Feedback Form Modal/Card */}
			{showForm && (
				<m.div
					className="container mx-auto mt-8 max-w-lg px-4"
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.95 }}
				>
					<div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-2xl backdrop-blur-md">
						{isSubmitted ? (
							<div className="flex flex-col items-center justify-center space-y-3 py-8 text-center">
								<CheckCircleIcon className="size-14 animate-bounce text-emerald-500" weight="fill" />
								<h3 className="font-bold text-foreground text-xl">Thank You for Your Feedback!</h3>
								<p className="text-muted-foreground text-sm">
									Your feedback has been added directly to the circular rotating showcase!
								</p>
							</div>
						) : (
							<form onSubmit={handleSubmit} className="space-y-4">
								<h3 className="flex items-center gap-2 font-bold text-foreground text-lg">
									<PaperPlaneTiltIcon className="size-5 text-primary" weight="fill" />
									Submit Your Feedback
								</h3>

								<div className="space-y-1">
									<label htmlFor="fb-name" className="font-semibold text-muted-foreground text-xs">
										Your Name *
									</label>
									<input
										id="fb-name"
										required
										value={name}
										onChange={(e) => setName(e.target.value)}
										placeholder="e.g. John Doe"
										className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:border-primary focus:outline-none"
									/>
								</div>

								<div className="space-y-1">
									<label htmlFor="fb-role" className="font-semibold text-muted-foreground text-xs">
										Role / Job Title
									</label>
									<input
										id="fb-role"
										value={role}
										onChange={(e) => setRole(e.target.value)}
										placeholder="e.g. Software Engineer"
										className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:border-primary focus:outline-none"
									/>
								</div>

								<div className="space-y-1">
									<span className="font-semibold text-muted-foreground text-xs">Rating</span>
									<div className="flex items-center gap-1.5 pt-1">
										{[1, 2, 3, 4, 5].map((star) => (
											<button
												key={star}
												type="button"
												onClick={() => setStars(star)}
												className="text-amber-400 transition-transform hover:scale-125 focus:outline-none"
											>
												<StarIcon size={22} weight={star <= stars ? "fill" : "regular"} />
											</button>
										))}
									</div>
								</div>

								<div className="space-y-1">
									<label htmlFor="fb-content" className="font-semibold text-muted-foreground text-xs">
										Your Feedback *
									</label>
									<textarea
										id="fb-content"
										required
										rows={3}
										value={content}
										onChange={(e) => setContent(e.target.value)}
										placeholder="Share your experience building resumes with rbuilder..."
										className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm focus:border-primary focus:outline-none"
									/>
								</div>

								<Button type="submit" className="w-full gap-2 py-2.5 font-bold">
									<PaperPlaneTiltIcon size={18} />
									Publish Feedback to Circle Animation
								</Button>
							</form>
						)}
					</div>
				</m.div>
			)}

			{/* 3D Circular Rotating Feedback Stage */}
			<section
				aria-label="Testimonial Stage"
				className="relative mt-12 flex h-[480px] w-full items-center justify-center overflow-hidden md:h-[540px]"
				onMouseEnter={() => setIsPaused(true)}
				onMouseLeave={() => setIsPaused(false)}
			>
				<div className="relative flex size-full items-center justify-center [perspective:1200px]">
					{/* 3D Rotating Orbit Ring */}
					<m.div
						className="relative flex size-full items-center justify-center [transform-style:preserve-3d]"
						animate={{ rotateY: isPaused ? undefined : [0, 360] }}
						transition={{
							rotateY: {
								duration: 36,
								repeat: Number.POSITIVE_INFINITY,
								ease: "linear",
							},
						}}
					>
						{list.map((item, index) => {
							const total = list.length;
							const angle = (360 / total) * index;

							return (
								<div
									key={item.id}
									className="absolute flex items-center justify-center transition-transform duration-300"
									style={{
										transform: `rotateY(${angle}deg) translateZ(420px)`,
									}}
								>
									<m.div
										className="group relative w-64 rounded-2xl border border-border/80 bg-card/95 p-6 shadow-2xl backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-primary/80 sm:w-72 md:w-80"
										whileHover={{ y: -8 }}
									>
										<QuotesIcon
											weight="fill"
											className="absolute right-3 bottom-3 size-16 text-primary/10 transition-transform group-hover:scale-125"
										/>

										<div className="relative space-y-3">
											{/* Rating Stars */}
											<div className="flex items-center gap-1 text-amber-400">
												{Array.from({ length: item.stars }).map((_, i) => (
													<StarIcon key={`star-${item.id}-${i}`} size={16} weight="fill" />
												))}
											</div>

											{/* Feedback Content */}
											<p className="line-clamp-4 text-muted-foreground text-xs leading-relaxed md:text-sm">
												"{item.content}"
											</p>
										</div>

										{/* User Meta */}
										<div className="relative mt-4 flex items-center gap-3 border-border/40 border-t pt-3">
											<div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-indigo-600 font-bold text-white text-xs shadow-md">
												{getInitials(item.name)}
											</div>
											<div className="overflow-hidden">
												<h3 className="truncate font-bold text-foreground text-xs md:text-sm">{item.name}</h3>
												<p className="truncate text-[11px] text-muted-foreground">{item.role}</p>
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
