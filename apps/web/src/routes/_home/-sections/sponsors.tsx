export const Sponsors = () => {
	return (
		<section className="px-8 py-20 border-b border-border/40">
			<div className="mx-auto flex max-w-4xl flex-col items-center text-center">
				<h2 className="max-w-3xl font-semibold text-2xl tracking-tight md:text-4xl">
					Thank you to our sponsors
				</h2>
				<p className="mt-5 max-w-2xl text-base text-muted-foreground leading-relaxed">
					rbuilder stays free, open-source, and independent because companies choose to support the work behind it.
				</p>

				<div className="mt-10 inline-block p-6 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm">
					<span className="font-mono font-bold text-2xl text-foreground tracking-tight">Atlas Cloud</span>
				</div>

				<p className="mt-8 max-w-2xl text-muted-foreground leading-relaxed text-sm">
					Atlas Cloud supports rbuilder as a project sponsor.
				</p>
			</div>
		</section>
	);
};
