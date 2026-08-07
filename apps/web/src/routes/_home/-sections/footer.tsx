import type { Icon } from "@phosphor-icons/react";
import { t } from "@lingui/core/macro";
import { Trans } from "@lingui/react/macro";
import { EnvelopeSimpleIcon, LinkedinLogoIcon, XLogoIcon } from "@phosphor-icons/react";
import { m } from "motion/react";
import { useState } from "react";
import { BrandIcon } from "@reactive-resume/ui/components/brand-icon";
import { Button } from "@reactive-resume/ui/components/button";
import { Copyright } from "@/components/ui/copyright";

type FooterLinkItem = {
	url: string;
	label: string;
};

type FooterLinkGroupProps = {
	title: string;
	links: FooterLinkItem[];
};

type SocialLink = {
	url: string;
	label: string;
	icon: Icon;
};

const getResourceLinks = (): FooterLinkItem[] => [
	{ url: "https://docs.rxresu.me", label: t`Documentation` },
	{ url: "https://docs.rxresu.me/changelog", label: t`Changelog` },
];

const getCommunityLinks = (): FooterLinkItem[] => [
	{ url: "mailto:support@rbuilder.com", label: t`Contact Support` },
	{ url: "https://crowdin.com/project/reactive-resume", label: t`Translations` },
];

const socialLinks: SocialLink[] = [
	{ url: "mailto:support@rbuilder.com", label: t`Gmail / Email Support`, icon: EnvelopeSimpleIcon },
	{ url: "https://linkedin.com", label: t`LinkedIn`, icon: LinkedinLogoIcon },
	{ url: "https://x.com", label: t`X (Twitter)`, icon: XLogoIcon },
];

export function Footer() {
	return (
		<m.footer
			id="footer"
			className="container mx-auto border-border/30 border-t p-4 pb-8 will-change-[opacity] md:p-8 md:pb-12"
			initial={{ opacity: 0 }}
			whileInView={{ opacity: 1 }}
			viewport={{ once: true }}
			transition={{ duration: 0.45 }}
		>
			<div className="grid grid-cols-1 gap-8 pb-8 sm:grid-cols-2 lg:grid-cols-3">
				{/* Brand Column */}
				<div className="space-y-4">
					<BrandIcon variant="logo" className="size-10" />

					<div className="space-y-2">
						<h2 className="font-semibold text-lg tracking-tight">rbuilder</h2>
						<p className="max-w-xs text-muted-foreground text-sm leading-relaxed">
							<Trans>
								A modern resume builder designed to empower your career growth with intuitive tools, high impact
								designs, and privacy.
							</Trans>
						</p>
					</div>

					{/* Social Links */}
					<div className="flex items-center gap-2 pt-2">
						{socialLinks.map((social) => (
							<Button
								key={social.label}
								size="icon-sm"
								variant="ghost"
								nativeButton={false}
								render={
									<a
										href={social.url}
										target="_blank"
										rel="noopener noreferrer"
										aria-label={`${social.label} (${t`opens in new tab`})`}
									>
										<social.icon aria-hidden="true" size={18} />
									</a>
								}
							/>
						))}
					</div>
				</div>

				{/* Resources Column */}
				<FooterLinkGroup title={t`Resources`} links={getResourceLinks()} />

				{/* Community Column */}
				<FooterLinkGroup title={t`Community`} links={getCommunityLinks()} />
			</div>

			{/* Copyright Row - Positioned at the bottom side */}
			<div className="flex flex-col items-center justify-between gap-4 border-border/40 border-t pt-6 sm:flex-row">
				<Copyright />
			</div>
		</m.footer>
	);
}

function FooterLinkGroup({ title, links }: FooterLinkGroupProps) {
	return (
		<div className="space-y-4">
			<h2 className="font-medium text-muted-foreground text-sm tracking-tight">{title}</h2>

			<ul className="space-y-3">
				{links.map((link) => (
					<FooterLink key={link.url} url={link.url} label={link.label} />
				))}
			</ul>
		</div>
	);
}

function FooterLink({ url, label }: FooterLinkItem) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<li className="relative">
			<a
				href={url}
				target="_blank"
				rel="noopener noreferrer"
				className="relative inline-block text-sm transition-colors hover:text-foreground"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
			>
				{label}

				<span className="sr-only">
					<Trans>(opens in new tab)</Trans>
				</span>

				<m.div
					aria-hidden="true"
					initial={{ width: 0, opacity: 0 }}
					animate={isHovered ? { width: "100%", opacity: 1 } : { width: 0, opacity: 0 }}
					transition={{ duration: 0.2, ease: "easeOut" }}
					className="pointer-events-none absolute inset-s-0 -bottom-0.5 h-px rounded-md bg-primary will-change-[width,opacity]"
				/>
			</a>
		</li>
	);
}
