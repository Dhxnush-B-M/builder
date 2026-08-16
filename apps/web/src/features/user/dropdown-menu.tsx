import { Trans } from "@lingui/react/macro";
import { PaletteIcon, SignOutIcon } from "@phosphor-icons/react";
import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@rbuilder/ui/components/dropdown-menu";
import { useTheme } from "@/features/theme/provider";
import { authClient } from "@/libs/auth/client";
import { isTheme } from "@/libs/theme";

type AuthSession = {
	user?: {
		id?: string;
		name?: string;
		email?: string;
		image?: string;
	};
} | null;

type Props = {
	children: ({ session }: { session: AuthSession }) => React.ComponentProps<typeof DropdownMenuTrigger>["render"];
};

export function UserDropdownMenu({ children }: Props) {
	const router = useRouter();
	const { theme, setTheme } = useTheme();
	const { data: session } = authClient.useSession();

	const handleThemeChange = (value: string) => {
		if (!isTheme(value)) return;
		setTheme(value);
	};

	const handleLogout = async () => {
		const toastId = toast.loading(t`Signing out...`);

		if (typeof window !== "undefined") {
			localStorage.clear();
		}

		try {
			await authClient.signOut({
				fetchOptions: {
					onSuccess: async () => {
						toast.dismiss(toastId);
						await router.invalidate();
						window.location.href = "/";
					},
					onError: () => {
						toast.dismiss(toastId);
						window.location.href = "/";
					},
				},
			});
		} catch {
			toast.dismiss(toastId);
			window.location.href = "/";
		}
	};

	// Helper to load authenticated user from localStorage if backend auth session is offline
	const getSavedUser = () => {
		if (typeof window === "undefined") return null;
		try {
			const rawSupabase = localStorage.getItem("rbuilder_supabase_user");
			if (rawSupabase) return JSON.parse(rawSupabase);
			const rawLocal = localStorage.getItem("rbuilder_user");
			if (rawLocal) return JSON.parse(rawLocal);
		} catch {
			return null;
		}
		return null;
	};

	const saved = getSavedUser();
	const userName = saved?.name || "Logged In User";
	const userEmail = saved?.email || "user@rbuilder.com";
	const userAvatar =
		saved?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userEmail)}`;

	const activeSession: AuthSession = session?.user
		? (session as AuthSession)
		: {
				user: {
					id: saved?.id || "logged_in_user",
					name: userName,
					email: userEmail,
					image: userAvatar,
					emailVerified: true,
					createdAt: new Date(),
					updatedAt: new Date(),
					username: userEmail.split("@")[0] || "user",
				},
				session: {
					id: "auth-session",
					userId: saved?.id || "logged_in_user",
					token: "",
					expiresAt: new Date(),
					createdAt: new Date(),
					updatedAt: new Date(),
				},
			};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger render={children({ session: activeSession })} />

			<DropdownMenuContent align="start" side="top">
				<DropdownMenuGroup>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							<PaletteIcon />
							<Trans comment="Menu item that opens appearance theme selection submenu">Theme</Trans>
						</DropdownMenuSubTrigger>
						<DropdownMenuSubContent>
							<DropdownMenuRadioGroup value={theme} onValueChange={handleThemeChange}>
								<DropdownMenuRadioItem value="light">
									<Trans comment="Appearance theme option for light mode">Light</Trans>
								</DropdownMenuRadioItem>
								<DropdownMenuRadioItem value="dark">
									<Trans comment="Appearance theme option for dark mode">Dark</Trans>
								</DropdownMenuRadioItem>
							</DropdownMenuRadioGroup>
						</DropdownMenuSubContent>
					</DropdownMenuSub>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuItem onClick={handleLogout}>
					<SignOutIcon />
					<Trans comment="User menu action to sign out of current account">Logout</Trans>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
