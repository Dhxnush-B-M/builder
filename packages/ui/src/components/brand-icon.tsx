import { cn } from "@reactive-resume/utils/style";

type Props = {
	variant?: "logo" | "icon";
	className?: string;
};

export function BrandIcon({ variant = "logo", className }: Props) {
	return (
		<div className={cn("inline-flex items-center gap-2.5 font-bold tracking-wider text-primary select-none", className)}>
			<span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-primary via-indigo-600 to-purple-600 text-white font-black text-lg shadow-md transition-transform hover:scale-105">
				rB
			</span>
			{variant === "logo" && (
				<span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-foreground via-primary to-indigo-500 bg-clip-text text-transparent">
					rbuilder
				</span>
			)}
		</div>
	);
}
