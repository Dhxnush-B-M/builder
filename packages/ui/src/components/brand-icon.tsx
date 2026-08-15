import { cn } from "@rbuilder/utils/style";

type Props = {
	variant?: "logo" | "icon";
	className?: string;
};

export function BrandIcon({ variant = "logo", className }: Props) {
	return (
		<div
			className={cn("inline-flex select-none items-center gap-2.5 font-bold text-primary tracking-wider", className)}
		>
			<img
				src="/opengraph/logo.png"
				alt="rbuilder logo"
				className="size-9 shrink-0 rounded-xl object-contain shadow-md transition-transform hover:scale-105"
			/>
			{variant === "logo" && (
				<span className="bg-gradient-to-r from-emerald-400 via-green-500 to-emerald-600 bg-clip-text font-extrabold text-2xl text-transparent tracking-tight">
					rbuilder
				</span>
			)}
		</div>
	);
}
