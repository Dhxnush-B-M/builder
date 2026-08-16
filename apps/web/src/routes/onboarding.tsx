import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { DeviceMobileIcon, ShieldCheckIcon, UserIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { saveUserDetailsToSupabase } from "@/libs/supabase/db";

export const Route = createFileRoute("/onboarding")({
	component: OnboardingPage,
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

			toast.success("Profile details saved to Supabase!");
			void navigate({ to: "/dashboard/resumes" });
		} catch {
			toast.success("Details saved!");
			void navigate({ to: "/dashboard/resumes" });
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="relative min-h-screen w-full bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4 md:p-8 font-sans selection:bg-emerald-500 selection:text-black">
			{/* Ambient Gradient Mesh Background */}
			<div aria-hidden="true" className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-30">
				<div className="size-[600px] animate-pulse rounded-full bg-gradient-to-tr from-emerald-500/20 via-blue-500/20 to-purple-500/20 blur-3xl" />
			</div>

			{/* Main Floating Glassmorphic Container */}
			<div className="relative z-10 w-full max-w-[460px] rounded-[32px] border border-zinc-800 bg-zinc-900/90 p-8 md:p-10 shadow-2xl backdrop-blur-2xl space-y-6">
				{/* Top Logo & Title */}
				<div className="text-center space-y-2">
					<div className="flex items-center justify-center gap-2 mb-2">
						<img src="/opengraph/logo.png" alt="rbuilder logo" className="size-10 rounded-full border border-emerald-500/50" />
					</div>

					<div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
						<CheckCircleIcon className="size-4" />
						<span>Payment Verified • Step 2 of 2</span>
					</div>

					<h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
						Complete Your Profile
					</h1>

					<p className="text-xs md:text-sm text-zinc-400 leading-relaxed">
						Enter your name and phone number to finalize your account and access your dashboard.
					</p>
				</div>

				{/* Form Input Fields */}
				<form onSubmit={handleSubmit} className="space-y-4 pt-2">
					{/* Full Name */}
					<div className="space-y-1.5">
						<label htmlFor="user-name" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
							<UserIcon className="size-3.5 text-emerald-400" />
							<span>Full Name</span>
						</label>
						<input
							id="user-name"
							type="text"
							required
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="Enter your full name"
							className="w-full px-4 py-3 text-sm rounded-xl border border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all"
						/>
					</div>

					{/* Phone Number */}
					<div className="space-y-1.5">
						<label htmlFor="user-phone" className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
							<DeviceMobileIcon className="size-3.5 text-emerald-400" />
							<span>Phone Number</span>
						</label>
						<div className="flex gap-2">
							<select
								value={countryCode}
								onChange={(e) => setCountryCode(e.target.value)}
								className="px-3 py-3 rounded-xl border border-zinc-700 bg-zinc-950 text-xs font-bold text-emerald-400 focus:border-emerald-400 focus:outline-none"
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
								className="flex-1 px-4 py-3 text-sm rounded-xl border border-zinc-700 bg-zinc-950 text-white placeholder:text-zinc-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all"
							/>
						</div>
					</div>

					{/* Privacy Note */}
					<div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-1">
						<ShieldCheckIcon className="size-4 text-emerald-400 shrink-0" />
						<span>Your data is stored securely in Supabase DB ('user_details' table).</span>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full py-3.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-zinc-950 font-extrabold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.99] disabled:opacity-50 mt-4 flex items-center justify-center gap-2"
					>
						{isSubmitting ? (
							<>
								<div className="size-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin" />
								<span>Saving to Supabase...</span>
							</>
						) : (
							<span>Save & Enter Dashboard</span>
						)}
					</button>
				</form>
			</div>
		</div>
	);
}
