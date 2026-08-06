import type { Icon } from "@phosphor-icons/react";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
	CheckCircleIcon,
	FileArrowUpIcon,
	FilePdfIcon,
	LightningIcon,
	PaletteIcon,
	ShieldCheckIcon,
	SparkleIcon,
} from "@phosphor-icons/react";
import { m } from "motion/react";
import { BrandIcon } from "@reactive-resume/ui/components/brand-icon";
import { cn } from "@reactive-resume/utils/style";

type Feature = {
	id: string;
	icon: Icon;
	title: string;
	description: string;
};

type FeatureCardProps = Feature;

const getFeatures = (): Feature[] => [
	{
		id: "ai-assistant",
		icon: SparkleIcon,
		title: t`AI Resume Assistant`,
		description: t`Generate tailored bullet points, optimize keywords, and improve content impact automatically.`,
	},
	{
		id: "live-preview",
		icon: LightningIcon,
		title: t`Real-Time Live Preview`,
		description: t`Instant side-by-side editing with high-precision PDF rendering as you type.`,
	},
	{
		id: "data-privacy",
		icon: ShieldCheckIcon,
		title: t`100% Privacy & Security`,
		description: t`Your career data remains private and secure. Zero tracking, zero third-party data selling.`,
	},
	{
		id: "ats-optimized",
		icon: CheckCircleIcon,
		title: t`ATS Parser Optimized`,
		description: t`Engineered layouts and clean typography designed to achieve maximum match scores on ATS scanners.`,
	},
	{
		id: "export-options",
		icon: FilePdfIcon,
		title: t`Instant PDF & Shareable Links`,
		description: t`Download pixel-perfect PDFs anytime or generate password-protected public web links.`,
	},
	{
		id: "customization",
		icon: PaletteIcon,
		title: t`Unlimited Customization`,
		description: t`Customize colors, typography, section order, and spacing to match your personal brand.`,
	},
	{
		id: "smart-import",
		icon: FileArrowUpIcon,
		title: t`Smart Import & Multi-Resume`,
		description: t`Import existing data from LinkedIn or JSON Resume, and manage unlimited tailored resume versions.`,
	},
];

function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
	return (
		<m.div
			className={cn(
				"group relative flex min-h-48 flex-col gap-4 overflow-hidden rounded-xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-lg",
			)}
			initial={{ opacity: 0, y: 16 }}
			whileInView={{ opacity: 1, y: 0 }}
			viewport={{ once: true, amount: 0.1 }}
			transition={{ duration: 0.35, ease: "easeOut" }}
		>
			{/* Hover gradient overlay */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
			/>

			{/* Icon */}
			<div aria-hidden="true" className="relative">
				<div className="inline-flex rounded-lg bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
					<Icon size={24} weight="duotone" />
				</div>
			</div>

			{/* Content */}
			<div className="relative flex flex-col gap-y-1.5">
				<h3 className="font-bold text-lg tracking-tight transition-colors group-hover:text-primary">{title}</h3>
				<p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
			</div>
		</m.div>
	);
}

export function Features() {
	const features = getFeatures();

	return (
		<section id="features" className="container mx-auto py-16 px-4 md:py-24">
			{/* Header with Brand Logo */}
			<m.div
				className="mb-12 flex flex-col items-center text-center space-y-4 will-change-[transform,opacity]"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.45 }}
			>
				<div className="flex items-center gap-3">
					<BrandIcon variant="logo" />
				</div>

				<h2 className="font-extrabold text-3xl tracking-tight md:text-5xl bg-gradient-to-r from-foreground via-primary to-indigo-500 bg-clip-text text-transparent">
					<Trans>Powerful Resume Building Features</Trans>
				</h2>

				<p className="max-w-2xl text-muted-foreground text-base md:text-lg leading-relaxed">
					<Trans>
						Everything you need to create, customize, and share job-winning resumes effortlessly. 
						Select any feature below to edit or customize for your requirements.
					</Trans>
				</p>
			</m.div>

			{/* Features Grid (7 Selected Features) */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
				{features.map((feature) => (
					<FeatureCard key={feature.id} {...feature} />
				))}
			</div>
		</section>
	);
}
