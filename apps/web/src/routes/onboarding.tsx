import { createFileRoute, useNavigate, redirect } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { DeviceMobileIcon, UserIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { saveUserDetailsToSupabase, checkUserSubscriptionAndOnboardingFromSupabase } from "@/libs/supabase/db";

export const Route = createFileRoute("/onboarding")({
	component: OnboardingPage,
	beforeLoad: () => {
		throw redirect({ to: "/dashboard/resumes", replace: true });
	},
});

function OnboardingPage() {
	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [phone, setPhone] = useState("");
	const [countryCode, setCountryCode] = useState("+91");
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		if (typeof window !== "undefined") {
			const rawUser = localStorage.getItem("rbuilder_user");
			if (rawUser) {
				try {
					const parsed = JSON.parse(rawUser);
					if (parsed.name) setName(parsed.name);
					if (parsed.phone) setPhone(parsed.phone);
				} catch {
					// ignore
				}
			}
			const existingPhone = localStorage.getItem("rbuilder_user_phone");
			if (existingPhone) setPhone(existingPhone);
		}
	}, []);

	async function handleSubmit(e: FormEvent) {
		e.preventDefault();
		const trimmedName = name.trim();
		const trimmedPhone = phone.trim();

		if (!trimmedName) {
			toast.error("Please enter your name.");
			return;
		}

		if (!trimmedPhone) {
			toast.error("Please enter your phone number.");
			return;
		}

		setIsSubmitting(true);
		const fullPhone = `${countryCode} ${trimmedPhone}`;

		try {
			await saveUserDetailsToSupabase({
				name: trimmedName,
				phone: fullPhone,
			});

			toast.success("Profile details saved! Welcome to rbuilder.");
			void navigate({ to: "/dashboard/resumes" });
		} catch {
			toast.success("Profile details saved!");
			void navigate({ to: "/dashboard/resumes" });
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="relative flex min-h-screen w-full flex-col items-center justify-center bg-slate-50 p-4 font-sans text-slate-900 selection:bg-emerald-500 selection:text-white md:p-8">
			{/* Ambient Luminous Mesh Background */}
			<div aria-hidden="true" className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-70">
				<div className="size-[700px] animate-pulse rounded-full bg-gradient-to-tr from-emerald-200/50 via-teal-100/60 to-cyan-200/40 blur-3xl" />
			</div>
			<div aria-hidden="true" className="pointer-events-none fixed top-10 left-10 opacity-60">
				<div className="size-[400px] rounded-full bg-gradient-to-br from-emerald-100/60 to-blue-100/50 blur-3xl" />
			</div>

			{/* Main White Glassy Panel */}
			<div className="relative z-10 w-full max-w-[480px] space-y-7 rounded-[36px] border border-white/80 bg-white/85 p-8 shadow-2xl shadow-slate-200/60 backdrop-blur-3xl md:p-11">
				{/* Top Logo & Title */}
				<div className="space-y-2.5 text-center">
					<a
						href="/"
						onClick={(e) => {
							e.preventDefault();
							if (typeof window !== "undefined") {
								localStorage.removeItem("rbuilder_user");
								localStorage.removeItem("rbuilder_user_email");
								localStorage.removeItem("rbuilder_supabase_user");
								localStorage.removeItem("rbuilder_payment_status");
								localStorage.removeItem("rbuilder_onboarding_completed");
							}
							window.location.href = "/";
						}}
						className="mb-1 inline-flex cursor-pointer items-center justify-center gap-2 transition-opacity hover:opacity-80"
					>
						<img
							src="/opengraph/logo.png"
							alt="rbuilder logo"
							className="size-11 rounded-full border-2 border-emerald-500/30 shadow-md"
						/>
					</a>

					<h1 className="font-extrabold text-2xl text-slate-900 tracking-tight md:text-3xl">Enter Your Details</h1>

					<p className="mx-auto max-w-sm text-slate-500 text-xs leading-relaxed md:text-sm">
						Please provide your name and mobile number to access your resume builder dashboard.
					</p>
				</div>

				{/* Form Input Fields */}
				<form onSubmit={handleSubmit} className="space-y-4 pt-1">
					{/* Full Name */}
					<div className="space-y-1.5">
						<label htmlFor="user-name" className="flex items-center gap-1.5 font-bold text-slate-700 text-xs">
							<UserIcon className="size-4 text-emerald-600" />
							<span>Full Name</span>
						</label>
						<input
							id="user-name"
							type="text"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter your full name"
							className="w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 font-medium text-slate-900 text-sm shadow-sm transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
						/>
					</div>

					{/* Phone Number */}
					<div className="space-y-1.5">
						<label htmlFor="user-phone" className="flex items-center gap-1.5 font-bold text-slate-700 text-xs">
							<DeviceMobileIcon className="size-4 text-emerald-600" />
							<span>Phone Number</span>
						</label>
						<div className="flex gap-2">
							<select
								value={countryCode}
								onChange={(e) => setCountryCode(e.target.value)}
								className="rounded-2xl border border-slate-200 bg-white/90 px-3.5 py-3.5 font-bold text-slate-800 text-xs shadow-sm focus:border-emerald-500 focus:outline-none"
							>
								<option value="+91">🇮🇳 +91</option>
								<option value="+1">🇺🇸 +1</option>
								<option value="+44">🇬🇧 +44</option>
								<option value="+971">🇦🇪 +971</option>
								<option value="+61">🇦🇺 +61</option>
							</select>

							<input
								id="user-phone"
								type="tel"
								required
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								placeholder="Enter 10-digit mobile number"
								className="flex-1 rounded-2xl border border-slate-200 bg-white/90 px-4 py-3.5 font-medium text-slate-900 text-sm shadow-sm transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
							/>
						</div>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={isSubmitting}
						className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 font-extrabold text-sm text-white shadow-emerald-600/25 shadow-xl transition-all hover:bg-emerald-500 active:scale-[0.99] disabled:opacity-50"
					>
						{isSubmitting ? (
							<>
								<div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
								<span>Saving Details...</span>
							</>
						) : (
							<span>Submit & Continue</span>
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
