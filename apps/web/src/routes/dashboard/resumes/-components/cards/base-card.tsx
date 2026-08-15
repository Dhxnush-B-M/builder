import { Badge } from "@rbuilder/ui/components/badge";
import { cn } from "@rbuilder/utils/style";
import { CometCard } from "@/components/animation/comet-card";

type BaseCardProps = React.ComponentProps<"div"> & {
	title: string;
	description: string;
	tags?: string[];
	className?: string;
	children?: React.ReactNode;
};

export function BaseCard({ title, description, tags, className, children, ...props }: BaseCardProps) {
	return (
		<CometCard translateDepth={6} rotateDepth={10} glareOpacity={0.25}>
			<div
				{...props}
				className={cn(
					"group relative flex aspect-page size-full cursor-pointer overflow-hidden rounded-3xl border border-emerald-500/20 bg-background/30 p-1 shadow-2xl backdrop-blur-2xl transition-all duration-500 hover:scale-[1.03] hover:border-emerald-400/80 hover:shadow-emerald-500/30 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900/40",
					className,
				)}
			>
				{/* Background Radial Glow */}
				<div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-transparent blur-2xl opacity-50 transition-opacity duration-500 group-hover:opacity-100" />

				{/* Inner Glassy Content Container */}
				<div className="relative flex size-full flex-col overflow-hidden rounded-2xl bg-card/30 backdrop-blur-md">
					{children}

					{/* Bottom Glass Pill */}
					<div className="absolute inset-x-0 bottom-0 flex w-full flex-col justify-end gap-y-1.5 border-t border-white/15 bg-background/80 px-4 py-4 backdrop-blur-2xl transition-all duration-300 group-hover:bg-background/95">
						<h3 className="truncate font-extrabold text-foreground text-sm tracking-tight transition-colors group-hover:text-emerald-400">
							{title}
						</h3>
						<p className="truncate text-muted-foreground text-xs">{description}</p>

						<div className={cn("mt-1.5 hidden flex-wrap items-center gap-1", tags && tags.length > 0 && "flex")}>
							{tags?.map((tag) => (
								<Badge
									key={tag}
									variant="secondary"
									className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-[10px] text-emerald-400 font-semibold shadow-sm"
								>
									{tag}
								</Badge>
							))}
						</div>
					</div>
				</div>
			</div>
		</CometCard>
	);
}
