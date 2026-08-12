import { ArrowRightIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { m, useMotionValue, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
import { BrandIcon } from "@reactive-resume/ui/components/brand-icon";
import { Button } from "@reactive-resume/ui/components/button";
import { ThemeToggleButton } from "@/features/theme/toggle-button";

export function Header() {
	const y = useMotionValue(0);
	const lastScroll = useRef(0);
	const ticking = useRef(false);
	const springY = useSpring(y, { stiffness: 300, damping: 40 });

	useEffect(() => {
		if (typeof window === "undefined") return;

		function onScroll() {
			const current = window.scrollY ?? 0;
			if (!ticking.current) {
				window.requestAnimationFrame(() => {
					if (current > 32 && current > lastScroll.current) {
						y.set(-100);
					} else {
						y.set(0);
					}
					lastScroll.current = current;
					ticking.current = false;
				});
				ticking.current = true;
			}
		}

		window.addEventListener("scroll", onScroll, { passive: true });
		return () => window.removeEventListener("scroll", onScroll);
	}, [y]);

	return (
		<m.header
			style={{ y: springY }}
			className="fixed inset-x-0 top-0 z-50 border-transparent border-b bg-background/80 backdrop-blur-lg transition-colors"
			initial={{ y: -100, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.35, ease: "easeOut" }}
		>
			<nav aria-label="Main navigation" className="container mx-auto flex items-center gap-x-4 p-3 lg:px-12">
				<Link to="/" className="transition-opacity hover:opacity-80" aria-label="rbuilder - Go to homepage">
					<BrandIcon className="size-10" />
				</Link>

				<div className="ml-auto flex items-center gap-x-2">
					<ThemeToggleButton />

					<div className="flex items-center gap-x-4">
						<Button
							size="icon"
							nativeButton={false}
							aria-label="Go to builder"
							render={
								<Link to="/builder/demo">
									<ArrowRightIcon aria-hidden="true" />
								</Link>
							}
						/>
					</div>
				</div>
			</nav>
		</m.header>
	);
}
