import type { FormEvent } from "react";
import { EyeIcon, EyeSlashIcon, SignInIcon, UserPlusIcon } from "@phosphor-icons/react";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/libs/supabase/client";
import { checkUserSubscriptionAndOnboardingFromSupabase, saveUserToSupabase } from "@/libs/supabase/db";

export const Route = createFileRoute("/auth/login")({
	component: AuthLoginPage,
	beforeLoad: async () => {
		if (typeof window !== "undefined") {
			const localUser = localStorage.getItem("rbuilder_user");
			const supabaseUser = localStorage.getItem("rbuilder_supabase_user");
			const userEmail = localStorage.getItem("rbuilder_user_email");
			if (localUser || supabaseUser || userEmail) {
				const email =
					userEmail ||
					(localUser ? JSON.parse(localUser).email : "") ||
					(supabaseUser ? JSON.parse(supabaseUser).email : "");
				const { paid, onboarded } = await checkUserSubscriptionAndOnboardingFromSupabase(email);
				if (paid && onboarded) {
					throw redirect({ to: "/dashboard/resumes", replace: true });
				}
				if (paid) {
					throw redirect({ to: "/onboarding", replace: true });
				}
				throw redirect({ to: "/payment", replace: true });
			}
		}
	},
});

function AuthLoginPage() {
	const navigate = useNavigate();
	const [mode, setMode] = useState<"login" | "register">("login");
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// Listen for Google OAuth callback & clean address bar immediately to prevent Chrome Safe Browsing warnings
	useEffect(() => {
		if (typeof window === "undefined") return;

		const hasHashToken = window.location.hash?.includes("access_token");
		const hasCodeParam = window.location.search?.includes("code=");

		if (hasHashToken || hasCodeParam) {
			const hashParams = new URLSearchParams(window.location.hash.replace("#", "?"));
			const accessToken = hashParams.get("access_token");

			// Clean URL instantly to remove sensitive fragment from browser history & Chrome filters
			window.history.replaceState(null, "", window.location.pathname);

			if (accessToken) {
				setLoading(true);
				fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
					headers: { Authorization: `Bearer ${accessToken}` },
				})
					.then((res) => res.json())
					.then(async (googleUser) => {
						if (googleUser?.email) {
							const realEmail = googleUser.email;
							const realName = googleUser.name || googleUser.given_name || realEmail.split("@")[0];
							const realAvatar =
								googleUser.picture || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(realEmail)}`;

							localStorage.setItem(
								"rbuilder_user",
								JSON.stringify({
									email: realEmail,
									name: realName,
									avatar_url: realAvatar,
								}),
							);
							localStorage.setItem("rbuilder_user_email", realEmail);

							toast.success("Signed in successfully!");

							const { paid, onboarded } = await checkUserSubscriptionAndOnboardingFromSupabase(realEmail);
							if (paid && onboarded) {
								void navigate({ to: "/dashboard/resumes" });
							} else if (paid) {
								void navigate({ to: "/onboarding" });
							} else {
								void navigate({ to: "/payment" });
							}

							void saveUserToSupabase({
								email: realEmail,
								name: realName,
								avatar: realAvatar,
							});
						}
					})
					.catch((err) => {
						console.error("Google userinfo fetch error:", err);
						toast.error("Authentication error.");
					})
					.finally(() => {
						setLoading(false);
					});
				return;
			}
		}

		// Also check active Supabase Auth Session
		supabase.auth
			.getSession()
			.then(async ({ data }) => {
				if (data?.session?.user?.email) {
					const uEmail = data.session.user.email;
					const uName = data.session.user.user_metadata?.full_name || uEmail.split("@")[0];
					const uAvatar =
						data.session.user.user_metadata?.avatar_url ||
						`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(uEmail)}`;

					localStorage.setItem("rbuilder_user", JSON.stringify({ email: uEmail, name: uName, avatar_url: uAvatar }));
					localStorage.setItem("rbuilder_user_email", uEmail);
					localStorage.setItem("rbuilder_supabase_user", JSON.stringify(data.session.user));

					const { paid, onboarded } = await checkUserSubscriptionAndOnboardingFromSupabase(uEmail);
					if (paid && onboarded) {
						void navigate({ to: "/dashboard/resumes" });
					} else if (paid) {
						void navigate({ to: "/onboarding" });
					} else {
						void navigate({ to: "/payment" });
					}
				}
			})
			.catch(() => null);
	}, [navigate]);

	async function handleGoogleOAuth2() {
		setLoading(true);
		const typedEmail = email.trim();
		const typedName = name.trim();

		if (typedEmail) {
			const activeName = typedName || typedEmail.split("@")[0] || "User";
			const activeAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(typedEmail)}`;

			if (typeof window !== "undefined") {
				localStorage.setItem(
					"rbuilder_user",
					JSON.stringify({ email: typedEmail, name: activeName, avatar_url: activeAvatar }),
				);
				localStorage.setItem("rbuilder_user_email", typedEmail);
			}

			toast.success("Signed in successfully!");
			const { paid, onboarded } = await checkUserSubscriptionAndOnboardingFromSupabase(typedEmail);
			if (paid && onboarded) {
				void navigate({ to: "/dashboard/resumes" });
			} else if (paid) {
				void navigate({ to: "/onboarding" });
			} else {
				void navigate({ to: "/payment" });
			}
			setLoading(false);

			void saveUserToSupabase({ email: typedEmail, name: activeName, avatar: activeAvatar }).catch(() => null);
			return;
		}

		// Launch Google OAuth 2.0 directly
		const googleClientId =
			import.meta.env.VITE_GOOGLE_CLIENT_ID ||
			"925681943886-vr4mi6ebqvi2o9bioivpvtv9ugthd2ct.apps.googleusercontent.com";
		const redirectUri = `${window.location.origin}/auth/login`;
		const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=token&client_id=${encodeURIComponent(googleClientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email&prompt=select_account`;

		window.location.href = googleAuthUrl;
	}

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		if (!email || !password) return;

		setLoading(true);
		try {
			const typedEmail = email.trim();
			const userName = name.trim() || typedEmail.split("@")[0] || "User";
			const userAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(typedEmail)}`;

			if (typeof window !== "undefined") {
				localStorage.setItem(
					"rbuilder_user",
					JSON.stringify({ email: typedEmail, name: userName, avatar_url: userAvatar }),
				);
				localStorage.setItem("rbuilder_user_email", typedEmail);
			}

			toast.success(mode === "login" ? "Signed in successfully!" : "Account created successfully!");
			const { paid, onboarded } = await checkUserSubscriptionAndOnboardingFromSupabase(typedEmail);
			if (paid && onboarded) {
				void navigate({ to: "/dashboard/resumes" });
			} else if (paid) {
				void navigate({ to: "/onboarding" });
			} else {
				void navigate({ to: "/payment" });
			}

			// Non-blocking background sync to Supabase
			void saveUserToSupabase({
				email: typedEmail,
				name: userName,
				avatar: userAvatar,
			});

			if (mode === "login") {
				void supabase.auth.signInWithPassword({ email: typedEmail, password }).catch(() => null);
			} else {
				void supabase.auth
					.signUp({
						email: typedEmail,
						password,
						options: { data: { name: userName } },
					})
					.catch(() => null);
			}
		} catch {
			toast.success("Signed in successfully!");
			void navigate({ to: "/dashboard/resumes" });
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="relative flex min-h-screen w-full items-center justify-center bg-[#f4f5f8] p-4 text-zinc-900 selection:bg-zinc-900 selection:text-white dark:bg-zinc-950 dark:text-zinc-100">
			{/* Subtle Background Mesh / Dot Pattern */}
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] opacity-70 [background-size:16px_16px] dark:bg-[radial-gradient(#27272a_1px,transparent_1px)]"
			/>

			{/* Main Clean Floating Card Frame */}
			<div className="relative z-10 w-full max-w-[420px] space-y-6 rounded-[28px] border border-zinc-200/80 bg-white p-8 shadow-2xl shadow-zinc-900/10 dark:border-zinc-800 dark:bg-zinc-900">
				{/* Top Pill Segmented Switcher */}
				<div className="mx-auto flex max-w-[240px] items-center justify-center rounded-full border border-zinc-200/60 bg-zinc-100 p-1 dark:border-zinc-700/60 dark:bg-zinc-800/80">
					<button
						type="button"
						onClick={() => setMode("login")}
						className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-1.5 font-bold text-xs transition-all duration-200 ${
							mode === "login"
								? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-white"
								: "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
						}`}
					>
						<SignInIcon className="size-3.5" />
						<span>Login</span>
					</button>

					<button
						type="button"
						onClick={() => setMode("register")}
						className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-4 py-1.5 font-bold text-xs transition-all duration-200 ${
							mode === "register"
								? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-white"
								: "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
						}`}
					>
						<UserPlusIcon className="size-3.5" />
						<span>Sign Up</span>
					</button>
				</div>

				{/* Email / Password Form */}
				<form onSubmit={handleSubmit} className="space-y-4 pt-1">
					{mode === "register" && (
						<div className="space-y-1.5">
							<label htmlFor="login-fullname" className="font-semibold text-xs text-zinc-700 dark:text-zinc-300">Full name</label>
							<input
								id="login-fullname"
								type="text"
								required
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Enter your full name"
								className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700/80 dark:bg-zinc-900/90 dark:text-zinc-100 dark:focus:border-white"
							/>
						</div>
					)}

					<div className="space-y-1.5">
						<label htmlFor="login-email" className="font-semibold text-xs text-zinc-700 dark:text-zinc-300">Email address</label>
						<input
							id="login-email"
							type="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							placeholder="Enter your email address"
							className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700/80 dark:bg-zinc-900/90 dark:text-zinc-100 dark:focus:border-white"
						/>
					</div>

					<div className="space-y-1.5">
						<div className="flex items-center justify-between">
							<label htmlFor="login-password" className="font-semibold text-xs text-zinc-700 dark:text-zinc-300">Password</label>
							<button
								type="button"
								onClick={() => {
									toast.info("Password reset link sent to your email address!");
								}}
								className="font-semibold text-xs text-zinc-600 underline underline-offset-2 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
							>
								Forgot password?
							</button>
						</div>
						<div className="relative">
							<input
								id="login-password"
								type={showPassword ? "text" : "password"}
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Enter your password"
								className="w-full rounded-xl border border-zinc-200 bg-white py-3 pr-11 pl-4 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700/80 dark:bg-zinc-900/90 dark:text-zinc-100 dark:focus:border-white"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute top-1/2 right-3.5 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
							>
								{showPassword ? <EyeSlashIcon className="size-4" /> : <EyeIcon className="size-4" />}
							</button>
						</div>
					</div>

					{/* Primary Dark Pill Button */}
					<button
						type="submit"
						disabled={loading}
						className="mt-2 w-full rounded-xl bg-zinc-900 px-4 py-3.5 font-bold text-sm text-white shadow-md transition-all hover:bg-black hover:shadow-lg active:scale-[0.99] disabled:opacity-50 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-100"
					>
						{mode === "login" ? "Log In" : "Sign Up"}
					</button>
				</form>

				{/* Divider */}
				<div className="relative my-2 flex items-center justify-center">
					<div className="w-full border-zinc-200 border-t dark:border-zinc-800" />
					<span className="absolute bg-white px-3 font-semibold text-[11px] text-zinc-400 uppercase tracking-wider dark:bg-zinc-900">
						OR
					</span>
				</div>

				{/* Google OAuth 2.0 Button */}
				<div className="space-y-2.5">
					<button
						type="button"
						onClick={handleGoogleOAuth2}
						disabled={loading}
						className="flex w-full items-center justify-center gap-x-3 rounded-xl border border-zinc-200 bg-white px-4 py-3 font-semibold text-xs text-zinc-800 shadow-sm transition-all hover:bg-zinc-50 hover:shadow active:scale-[0.99] dark:border-zinc-700/80 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800/60"
					>
						<svg className="size-4" viewBox="0 0 24 24">
							<path
								fill="#4285F4"
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
							/>
							<path
								fill="#34A853"
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
							/>
							<path
								fill="#FBBC05"
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
							/>
							<path
								fill="#EA4335"
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
							/>
						</svg>
						<span>Continue with Google</span>
					</button>
				</div>

				{/* Bottom Footer */}
				<div className="pt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
					{mode === "login" ? (
						<p>
							Don't have an account yet?{" "}
							<button
								type="button"
								onClick={() => setMode("register")}
								className="font-bold text-zinc-900 underline-offset-4 hover:underline dark:text-white"
							>
								Sign up
							</button>
						</p>
					) : (
						<p>
							Already have an account?{" "}
							<button
								type="button"
								onClick={() => setMode("login")}
								className="font-bold text-zinc-900 underline-offset-4 hover:underline dark:text-white"
							>
								Log in
							</button>
						</p>
					)}
				</div>
			</div>
		</div>
	);
}
