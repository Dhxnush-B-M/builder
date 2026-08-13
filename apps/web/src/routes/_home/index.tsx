import { createFileRoute } from "@tanstack/react-router";
import { createNoindexFollowMeta } from "@/libs/seo";
import { Faq } from "./-sections/faq";
import { Features } from "./-sections/features";
import { Footer } from "./-sections/footer";
import { Header } from "./-sections/header";
import { Hero } from "./-sections/hero";
import { Prefooter } from "./-sections/prefooter";
import { Statistics } from "./-sections/statistics";
import { Support } from "./-sections/support";
import { Templates } from "./-sections/templates";
import { Testimonials } from "./-sections/testimonials";

export const Route = createFileRoute("/_home/")({
	component: RouteComponent,
	head: () => ({
		meta: [createNoindexFollowMeta()],
	}),
});

function RouteComponent() {
	return (
		<main id="main-content" className="relative min-h-screen bg-slate-50/80 text-foreground dark:bg-background overflow-hidden">
			{/* Light Resume Watermark Background Grid */}
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-[0.12] dark:opacity-[0.05]">
				{/* Background Resume Floating Cards */}
				<img
					src="/templates/jpg/ditgar.jpg"
					alt=""
					className="absolute -top-12 left-5 w-72 rounded-xl shadow-2xl border border-slate-300 transform -rotate-6 blur-[1px]"
				/>
				<img
					src="/templates/jpg/azurill.jpg"
					alt=""
					className="absolute top-1/4 -right-16 w-80 rounded-xl shadow-2xl border border-slate-300 transform rotate-6 blur-[1px]"
				/>
				<img
					src="/templates/jpg/kakuna.jpg"
					alt=""
					className="absolute top-1/2 -left-20 w-80 rounded-xl shadow-2xl border border-slate-300 transform -rotate-3 blur-[1px]"
				/>
				<img
					src="/templates/jpg/leafish.jpg"
					alt=""
					className="absolute bottom-1/4 -right-10 w-72 rounded-xl shadow-2xl border border-slate-300 transform rotate-3 blur-[1px]"
				/>
			</div>

			{/* Soft Radial Ambient Glow */}
			<div className="pointer-events-none absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-blue-100/60 via-indigo-50/40 to-transparent dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-transparent" />

			<div className="relative z-10">
				<Header />
				<Hero />

				<div className="container mx-auto px-4 sm:px-6 lg:px-12">
					<div className="border-border/60 border-x bg-background/60 backdrop-blur-sm [&>section:first-child]:border-t-0 [&>section]:border-border/60 [&>section]:border-t">
						<Statistics />
						<Features />
						<Templates />
						<Testimonials />
						<Support />
						<Faq />
						<Prefooter />
						<Footer />
					</div>
				</div>
			</div>
		</main>
	);
}
