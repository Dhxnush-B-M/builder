import type { MessageDescriptor } from "@lingui/core";
import { msg } from "@lingui/core/macro";
import { useLingui } from "@lingui/react";
import { Trans } from "@lingui/react/macro";
import { BriefcaseIcon, LockSimpleIcon, MagnifyingGlassIcon, ReadCvLogoIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@rbuilder/ui/components/avatar";
import { BrandIcon } from "@rbuilder/ui/components/brand-icon";
import { Kbd } from "@rbuilder/ui/components/kbd";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
	SidebarSeparator,
} from "@rbuilder/ui/components/sidebar";
import { getInitials } from "@rbuilder/utils/string";
import { useCommandPaletteStore } from "@/features/command-palette/store";
import { UserDropdownMenu } from "@/features/user/dropdown-menu";

type SidebarItem = {
	icon: React.ReactNode;
	label: MessageDescriptor | string;
	href?: React.ComponentProps<typeof Link>["to"];
	isLocked?: boolean;
};

const appSidebarItems: SidebarItem[] = [
	{
		icon: <ReadCvLogoIcon />,
		label: msg`Resumes`,
		href: "/dashboard/resumes",
	},
	{
		icon: <BriefcaseIcon />,
		label: "Portfolio",
		isLocked: true,
	},
];

type SidebarItemListProps = {
	items: readonly SidebarItem[];
};

function SidebarItemList({ items }: SidebarItemListProps) {
	const { i18n } = useLingui();

	return (
		<SidebarMenu>
			{items.map((item, idx) => {
				const text = typeof item.label === "string" ? item.label : i18n.t(item.label);
				if (item.isLocked) {
					return (
						<SidebarMenuItem key={text}>
							<SidebarMenuButton
								title={text}
								onClick={() => toast.info("Portfolio feature is currently locked.")}
								className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
							>
								<div className="flex w-full items-center justify-between">
									<div className="flex items-center gap-x-2">
										{item.icon}
										<span className="shrink-0 transition-[margin,opacity] duration-200 ease-in-out group-data-[collapsible=icon]:-ms-8 group-data-[collapsible=icon]:opacity-0">
											{text}
										</span>
									</div>
									<LockSimpleIcon className="size-4 shrink-0 opacity-70 group-data-[collapsible=icon]:hidden" />
								</div>
							</SidebarMenuButton>
						</SidebarMenuItem>
					);
				}

				return (
					<SidebarMenuItem key={item.href || idx}>
						<SidebarMenuButton
							title={text}
							render={
								<Link to={item.href!} activeProps={{ className: "bg-sidebar-accent" }}>
									{item.icon}
									<span className="shrink-0 transition-[margin,opacity] duration-200 ease-in-out group-data-[collapsible=icon]:-ms-8 group-data-[collapsible=icon]:opacity-0">
										{text}
									</span>
								</Link>
							}
						/>
					</SidebarMenuItem>
				);
			})}
		</SidebarMenu>
	);
}

function SidebarSearchButton() {
	const { i18n } = useLingui();
	const setOpen = useCommandPaletteStore((state) => state.setOpen);

	const label = i18n.t(msg`Search`);

	return (
		<SidebarMenuItem>
			<SidebarMenuButton title={label} tooltip={label} onClick={() => setOpen(true)}>
				<MagnifyingGlassIcon />
				<span className="flex-1 text-start transition-[margin,opacity] duration-200 ease-in-out group-data-[collapsible=icon]:-ms-8 group-data-[collapsible=icon]:opacity-0">
					{label}
				</span>
				<Kbd className="transition-opacity duration-200 ease-in-out group-data-[collapsible=icon]:opacity-0">⌘K</Kbd>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}

export function DashboardSidebar() {
	const { i18n } = useLingui();

	return (
		<Sidebar variant="floating" collapsible="icon">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							className="h-auto justify-center"
							render={
								<Link to="/">
									<BrandIcon variant="icon" className="size-6" />
									<h1 className="sr-only">rbuilder</h1>
								</Link>
							}
						/>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarSeparator />

			<SidebarContent aria-label={i18n.t(msg`Dashboard`)} role="navigation">
				<SidebarGroup>
					<SidebarGroupLabel>
						<Trans>App</Trans>
					</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarItemList items={appSidebarItems} />
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarSeparator />

			<SidebarFooter className="gap-y-0">
				<SidebarMenu>
					<SidebarMenuItem>
						<UserDropdownMenu>
							{({ session }) => {
								let savedUser: { name?: string; email?: string; avatar_url?: string } | null = null;
								if (typeof window !== "undefined") {
									try {
										const rawSup = localStorage.getItem("rbuilder_supabase_user");
										if (rawSup) savedUser = JSON.parse(rawSup);
										else {
											const rawLoc = localStorage.getItem("rbuilder_user");
											if (rawLoc) savedUser = JSON.parse(rawLoc);
										}
									} catch {}
								}
								const user = session?.user ?? {
									name: savedUser?.name || "Account User",
									email: savedUser?.email || "user@rbuilder.com",
									image: savedUser?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(savedUser?.email || "user")}`,
								};
								return (
									<SidebarMenuButton className="h-auto gap-x-3 group-data-[collapsible=icon]:p-1!">
										<Avatar className="size-8 shrink-0 transition-all group-data-[collapsible=icon]:size-6">
											<AvatarImage src={user.image ?? undefined} />
											<AvatarFallback className="group-data-[collapsible=icon]:text-[0.5rem]">
												{getInitials(user.name)}
											</AvatarFallback>
										</Avatar>

										<div className="transition-[margin,opacity] duration-200 ease-in-out group-data-[collapsible=icon]:-ms-8 group-data-[collapsible=icon]:opacity-0">
											<p className="font-medium">{user.name}</p>
											<p className="text-muted-foreground text-xs">{user.email}</p>
										</div>
									</SidebarMenuButton>
								);
							}}
						</UserDropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>

			<SidebarRail />
		</Sidebar>
	);
}
