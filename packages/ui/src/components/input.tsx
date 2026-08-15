import type * as React from "react";
import { Input as InputPrimitive } from "@base-ui/react/input";
import { cn } from "@rbuilder/utils/style";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<InputPrimitive
			type={type}
			data-slot="input"
			className={cn(
				"h-10 w-full min-w-0 rounded-xl border border-emerald-500/30 bg-background/50 px-3.5 py-2 text-sm outline-none shadow-sm backdrop-blur-md transition-all duration-300 placeholder:text-muted-foreground focus-visible:border-emerald-400 focus-visible:ring-4 focus-visible:ring-emerald-500/20 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20",
				className,
			)}
			{...props}
		/>
	);
}

export { Input };
