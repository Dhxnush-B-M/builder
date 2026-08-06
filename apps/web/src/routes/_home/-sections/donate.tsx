import type { IconProps } from "@phosphor-icons/react";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import {
	EnvelopeSimpleIcon,
	HeadsetIcon,
	HeartIcon,
	PhoneCallIcon,
	RocketIcon,
	SparkleIcon,
	TranslateIcon,
} from "@phosphor-icons/react";
import { m } from "motion/react";
import { BrandIcon } from "@reactive-resume/ui/components/brand-icon";
import { Button } from "@reactive-resume/ui/components/button";
import { cn } from "@reactive-resume/utils/style";

type FloatingIconProps = {
	icon: React.ElementType;
	className?: string;
	delay?: number;
};

const FloatingIcon = ({ icon: Icon, className, delay = 0 }: FloatingIconProps) => (
	<m.div
		className={cn("absolute text-primary/20", className)}
		animate={{
			y: [0, -12, 0],
			rotate: [0, 5, -5, 0],
			scale: [1, 1.1, 1],
		}}
		transition={{
			duration: 4,
			repeat: Number.POSITIVE_INFINITY,
			delay,
			ease: "easeInOut",
		}}
	>
		<Icon size={32} weight="duotone" />
	</m.div>
);

const PulsingHeart = () => (
	<m.div
		className="relative inline-flex items-center justify-center"
		animate={{
			scale: [1, 1.15, 1],
		}}
		transition={{
			duration: 1.5,
			repeat: Number.POSITIVE_INFINITY,
			ease: "easeInOut",
		}}
	>
		<HeartIcon size={48} weight="fill" className="text-rose-500" />
		<m.div
			className="absolute inset-0 flex items-center justify-center"
			animate={{
				scale: [1, 1.8],
				opacity: [0.6, 0],
			}}
			transition={{
				duration: 1.5,
				repeat: Number.POSITIVE_INFINITY,
				ease: "easeOut",
			}}
		>
			<HeartIcon size={48} weight="fill" className="text-rose-500" />
		</m.div>
	</m.div>
);

type SparkleEffectProps = {
	className?: string;
};

const SparkleEffect = ({ className }: SparkleEffectProps) => (
	<m.div
		className={cn("absolute", className)}
		animate={{
			scale: [0, 1, 0],
			opacity: [0, 1, 0],
			rotate: [0, 180],
		}}
		transition={{
			duration: 2,
			repeat: Number.POSITIVE_INFINITY,
			ease: "easeInOut",
		}}
	>
		<SparkleIcon size={16} weight="fill" className="text-amber-400" />
	</m.div>
);

type FeatureCardProps = {
	icon: React.ElementType<IconProps>;
	title: string;
	description: string;
	delay: number;
};

const FeatureCard = ({ icon: Icon, title, description, delay }: FeatureCardProps) => (
	<m.div
		className="group relative flex flex-col items-center gap-3 rounded-2xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm transition-colors hover:border-primary/30 hover:bg-card/80"
		initial={{ opacity: 0, y: 20 }}
		whileInView={{ opacity: 1, y: 0 }}
		viewport={{ once: true }}
		transition={{ duration: 0.5, delay }}
		whileHover={{ y: -4 }}
	>
		<m.div
			aria-hidden="true"
			className="flex size-12 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/20"
			whileHover={{ rotate: [0, -10, 10, 0] }}
			transition={{ duration: 0.4 }}
		>
			<Icon size={24} weight="duotone" />
		</m.div>
		<h3 className="font-semibold tracking-tight text-lg">{title}</h3>
		<p className="text-muted-foreground leading-relaxed text-sm">{description}</p>
	</m.div>
);

export const DonationBanner = () => (
	<section className="relative overflow-hidden bg-gradient-to-b from-background via-primary/5 to-background py-24">
		{/* Background decorative elements */}
		<div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
			<FloatingIcon icon={HeartIcon} className="top-[20%] left-[10%]" delay={0} />
			<FloatingIcon icon={SparkleIcon} className="top-[15%] right-[15%]" delay={0.5} />
			<FloatingIcon icon={HeadsetIcon} className="bottom-[25%] left-[8%]" delay={1} />
			<FloatingIcon icon={PhoneCallIcon} className="right-[12%] bottom-[30%]" delay={1.5} />
			<FloatingIcon icon={RocketIcon} className="top-[35%] right-[25%]" delay={2} />
			<FloatingIcon icon={TranslateIcon} className="bottom-[20%] left-[20%]" delay={2.5} />
		</div>

		<div className="container relative px-8 mx-auto">
			{/* Header */}
			<m.div
				className="flex flex-col items-center text-center space-y-4"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
			>
				<div aria-hidden="true" className="relative mb-2">
					<PulsingHeart />
					<SparkleEffect className="-inset-e-4 -top-2" />
					<SparkleEffect className="-inset-s-3 bottom-0" />
				</div>

				<div className="flex items-center justify-center gap-3 sm:gap-5">
					<m.div
						animate={{
							y: [0, -8, 0],
							scale: [1, 1.1, 1],
							rotate: [-6, 6, -6],
						}}
						transition={{
							duration: 3,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
						}}
					>
						<BrandIcon variant="icon" />
					</m.div>

					<m.h2
						className="font-extrabold text-3xl tracking-tight md:text-4xl xl:text-5xl bg-gradient-to-r from-foreground via-primary to-indigo-500 bg-clip-text text-transparent"
						initial={{ opacity: 0, y: 20 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.6, delay: 0.1 }}
					>
						<Trans>Support rbuilder</Trans>
					</m.h2>

					<m.div
						animate={{
							y: [0, -8, 0],
							scale: [1, 1.1, 1],
							rotate: [6, -6, 6],
						}}
						transition={{
							duration: 3,
							repeat: Number.POSITIVE_INFINITY,
							ease: "easeInOut",
							delay: 0.5,
						}}
					>
						<BrandIcon variant="icon" />
					</m.div>
				</div>

				<m.p
					className="max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed"
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6, delay: 0.2 }}
				>
					<Trans>
						rbuilder is committed to helping professionals craft standout resumes. We provide full guidance, round-the-clock support, and continuous platform enhancements.
					</Trans>
				</m.p>
			</m.div>

			{/* Feature cards (Requested: Full Support, 24/7 Calling Support, Multilingual Support) */}
			<div className="mx-auto my-12 grid max-w-5xl gap-6 md:grid-cols-3">
				<FeatureCard
					icon={RocketIcon}
					title={t`Full Resume Building Support`}
					description={t`Get full step-by-step guidance and dedicated support to construct your perfect professional resume.`}
					delay={0.3}
				/>
				<FeatureCard
					icon={PhoneCallIcon}
					title={t`24/7 Calling & Live Support`}
					description={t`Our team is available 24/7 via call and message to answer questions and assist with your resume formatting.`}
					delay={0.4}
				/>
				<FeatureCard
					icon={TranslateIcon}
					title={t`Available in Multiple Languages`}
					description={t`Create, translate, and export your resume in a wide variety of global languages effortlessly.`}
					delay={0.5}
				/>
			</div>

			{/* CTA Button (Gmail Email Support) */}
			<m.div
				className="flex flex-col items-center justify-center gap-4 sm:flex-row"
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6, delay: 0.6 }}
			>
				<Button
					size="lg"
					nativeButton={false}
					className="h-12 gap-2.5 px-8 font-semibold text-base shadow-md"
					render={
						<a href="mailto:support@rbuilder.com" target="_blank" rel="noopener noreferrer">
							<EnvelopeSimpleIcon aria-hidden="true" weight="bold" className="size-5 text-primary" />
							Contact Support via Gmail
							<span className="sr-only"> ({t`opens in new tab`})</span>
						</a>
					}
				/>
			</m.div>

			{/* Footer note */}
			<m.p
				className="mt-8 text-center text-muted-foreground leading-relaxed text-sm"
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6, delay: 0.8 }}
			>
				<Trans>
					Reach out anytime for assistance or feedback. We are here to support your career journey!
				</Trans>
			</m.p>
		</div>
	</section>
);
