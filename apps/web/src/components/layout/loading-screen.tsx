import { BrandIcon } from "@rbuilder/ui/components/brand-icon";

export function LoadingScreen() {
	return (
		<div className="fixed inset-0 z-50 flex h-svh w-svw flex-col items-center justify-center gap-y-4 bg-background transition-opacity duration-150">
			<BrandIcon variant="logo" className="scale-110" />
		</div>
	);
}
