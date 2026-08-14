import type { RightSidebarSection } from "@/libs/resume/section";
import { t } from "@lingui/core/macro";
import { CaretDownIcon } from "@phosphor-icons/react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@rbuilder/ui/components/accordion";
import { Button } from "@rbuilder/ui/components/button";
import { cn } from "@rbuilder/utils/style";
import { getSectionIcon, getSectionTitle } from "@/libs/resume/section";
import { useSectionStore } from "../../../-store/section";

type Props = React.ComponentProps<typeof AccordionContent> & {
	type: RightSidebarSection;
};

export function SectionBase({ type, className, ...props }: Props) {
	const collapsed = useSectionStore((state) => state.sections[type]?.collapsed ?? false);
	const toggleCollapsed = useSectionStore((state) => state.toggleCollapsed);
	const sectionTitle = getSectionTitle(type);

	return (
		<Accordion
			className="space-y-4 rounded-2xl border border-white/30 dark:border-white/15 bg-white/20 dark:bg-zinc-950/40 backdrop-blur-xl p-4 shadow-[0_8px_32px_0_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] transition-all duration-300 hover:border-primary/50 hover:shadow-[0_8px_32px_0_rgba(59,130,246,0.2)]"
			id={`sidebar-${type}`}
			value={collapsed ? [] : [type]}
			onValueChange={() => toggleCollapsed(type)}
		>
			<AccordionItem value={type} className="group/accordion-item space-y-4">
				<div className="flex items-center">
					<AccordionTrigger
						className="me-2 items-center justify-center"
						render={
							<Button size="icon" variant="ghost" aria-label={t`Toggle ${sectionTitle} section`}>
								<CaretDownIcon className="transition-transform duration-200 group-data-closed/accordion-item:-rotate-90" />
							</Button>
						}
					/>

					<div className="flex flex-1 items-center gap-x-4">
						{getSectionIcon(type)}
						<h2 className="line-clamp-1 font-semibold text-2xl tracking-tight">{sectionTitle}</h2>
					</div>
				</div>

				<AccordionContent className={cn("overflow-hidden pb-0", className)} {...props} />
			</AccordionItem>
		</Accordion>
	);
}
