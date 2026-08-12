import { createFileRoute } from "@tanstack/react-router";
import { createNoindexFollowMeta } from "@/libs/seo";
import { Faq } from "./-sections/faq";
import { Features } from "./-sections/features";
import { Footer } from "./-sections/footer";
import { Header } from "./-sections/header";
import { Hero } from "./-sections/hero";
import { Prefooter } from "./-sections/prefooter";
import { Sponsors } from "./-sections/sponsors";
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
		<main id="main-content" className="relative bg-background text-foreground min-h-screen">
			<Header />
			<Hero />

			<div className="container mx-auto px-4 sm:px-6 lg:px-12">
				<div className="border-border border-x [&>section:first-child]:border-t-0 [&>section]:border-border [&>section]:border-t">
					<Statistics />
					<Sponsors />
					<Features />
					<Templates />
					<Testimonials />
					<Support />
					<Faq />
					<Prefooter />
					<Footer />
				</div>
			</div>
		</main>
	);
}
