import { cn } from "@rbuilder/utils/style";

type Props = {
	side: "left" | "right";
	children: React.ReactNode;
};

export function BuilderSidebarEdge({ side, children }: Props) {
	return (
		<div
			className={cn(
				// `md:` (not `sm:`) so the strip only shows on real desktop; the mobile shell takes over below 768px.
				"absolute inset-y-0 z-30 hidden min-h-0 w-12 flex-col items-center overflow-hidden border-white/20 bg-background/50 py-2.5 shadow-md backdrop-blur-2xl md:flex dark:border-white/10",
				side === "left" ? "inset-s-0 border-r" : "inset-e-0 border-l",
			)}
		>
			{children}
		</div>
	);
}
