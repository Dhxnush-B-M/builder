import { m } from "motion/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@rbuilder/ui/components/accordion";
import { cn } from "@rbuilder/utils/style";

type FAQItemData = {
	question: string;
	answer: string;
};

const faqItems: FAQItemData[] = [
	{
		question: "Is rbuilder really free?",
		answer: "Yes! rbuilder is completely free to use, with no hidden costs, premium tiers, or subscription fees. It's open-source and will always remain free.",
	},
	{
		question: "How is my data protected?",
		answer: "Your data is stored securely in your browser's local memory and is never shared with third parties.",
	},
	{
		question: "Can I export my resume to PDF?",
		answer: "Absolutely! You can export your resume to PDF with a single click. The exported PDF maintains all your formatting and styling perfectly.",
	},
	{
		question: "Is rbuilder available in multiple languages?",
		answer: "Yes, rbuilder is available in over 50 languages with multi-language font support.",
	},
	{
		question: "What makes rbuilder different from other resume builders?",
		answer: "rbuilder is open-source, privacy-focused, and completely free. Unlike other resume builders, it doesn't show ads, track your data, or limit your features behind a paywall.",
	},
	{
		question: "How do I share my resume?",
		answer: "You can share your resume via a unique public URL, protect it with a password, or download it as a PDF to share directly.",
	},
];

export function Faq() {
	return (
		<section
			id="frequently-asked-questions"
			className="relative overflow-hidden py-16 md:py-24 border-b border-border/40"
		>
			{/* Ambient Glowing Glass Highlights */}
			<div className="pointer-events-none absolute -left-20 top-1/2 size-96 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl" />
			<div className="pointer-events-none absolute -right-20 top-1/3 size-96 rounded-full bg-indigo-500/10 blur-3xl" />

			<div className="relative mx-auto max-w-6xl px-4 md:px-8">
				<div className="flex flex-col gap-x-12 gap-y-10 lg:flex-row lg:items-start">
					{/* Left Title Column */}
					<m.div
						className="flex-1 space-y-4"
						initial={{ opacity: 0, x: -20 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.45 }}
					>
						<span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 font-semibold text-xs text-primary uppercase tracking-widest backdrop-blur-md">
							Got Questions?
						</span>
						<h2 className="bg-gradient-to-r from-foreground via-foreground/90 to-primary bg-clip-text font-extrabold text-3xl text-transparent tracking-tight sm:text-4xl md:text-5xl">
							Frequently Asked Questions
						</h2>
						<p className="max-w-md text-base text-muted-foreground leading-relaxed">
							Everything you need to know about rbuilder, data privacy, and resume exporting.
						</p>
					</m.div>

					{/* Right Glass Accordion Container */}
					<m.div
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.45, delay: 0.08 }}
						className="w-full flex-2 lg:max-w-2xl 2xl:max-w-3xl"
					>
						<div className="relative overflow-hidden rounded-3xl border border-white/20 bg-card/40 p-3 md:p-6 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/40">
							<Accordion multiple className="space-y-2">
								{faqItems.map((item, index) => (
									<FAQItemComponent key={item.question} item={item} index={index} />
								))}
							</Accordion>
						</div>
					</m.div>
				</div>
			</div>
		</section>
	);
}

type FAQItemComponentProps = {
	item: FAQItemData;
	index: number;
};

function FAQItemComponent({ item, index }: FAQItemComponentProps) {
	return (
		<m.div
			className="will-change-[transform,opacity]"
			initial={{ opacity: 0, y: 10 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true }}
			transition={{ duration: 0.24, delay: Math.min(0.16, index * 0.03) }}
		>
			<AccordionItem
				value={item.question}
				className="group overflow-hidden rounded-2xl border border-border/40 bg-background/50 px-4 transition-all duration-300 hover:border-primary/40 hover:bg-background/80 hover:shadow-lg dark:bg-background/30"
			>
				<AccordionTrigger className="py-5 font-semibold text-base tracking-tight transition-colors group-hover:text-primary">
					{item.question}
				</AccordionTrigger>
				<AccordionContent className="pb-5 text-muted-foreground text-sm leading-relaxed">
					{item.answer}
				</AccordionContent>
			</AccordionItem>
		</m.div>
	);
}
