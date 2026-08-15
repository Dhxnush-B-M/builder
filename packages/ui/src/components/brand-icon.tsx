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
			<div className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-black shadow-md ring-1 ring-emerald-500/30 transition-transform hover:scale-105">
				<img
					src="/opengraph/logo.png"
					alt="rbuilder logo"
					className="size-full object-cover"
				/>
			</div>
			{variant === "logo" && (
				<span className="bg-gradient-to-r from-emerald-400 via-green-400 to-teal-400 bg-clip-text font-extrabold text-2xl text-transparent tracking-tight">
					rbuilder
				</span>
			)}
		</div>
	);
}
