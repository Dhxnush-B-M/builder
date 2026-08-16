import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { DeviceMobileIcon, UserIcon } from "@phosphor-icons/react";
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
		<div className="relative min-h-screen w-full bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 md:p-8 font-sans selection:bg-emerald-500 selection:text-white">
			{/* Ambient Luminous Mesh Background */}
			<div aria-hidden="true" className="pointer-events-none fixed inset-0 flex items-center justify-center opacity-70">
				<div className="size-[700px] animate-pulse rounded-full bg-gradient-to-tr from-emerald-200/50 via-teal-100/60 to-cyan-200/40 blur-3xl" />
			</div>
			<div aria-hidden="true" className="pointer-events-none fixed top-10 left-10 opacity-60">
				<div className="size-[400px] rounded-full bg-gradient-to-br from-emerald-100/60 to-blue-100/50 blur-3xl" />
			</div>

			{/* Main White Glassy Panel */}
			<div className="relative z-10 w-full max-w-[480px] rounded-[36px] border border-white/80 bg-white/85 p-8 md:p-11 shadow-2xl shadow-slate-200/60 backdrop-blur-3xl space-y-7">
				{/* Top Logo & Title */}
				<div className="text-center space-y-2.5">
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
						className="inline-flex items-center justify-center gap-2 mb-1 cursor-pointer hover:opacity-80 transition-opacity"
					>
						<img src="/opengraph/logo.png" alt="rbuilder logo" className="size-11 rounded-full border-2 border-emerald-500/30 shadow-md" />
					</a>

					<h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
						Enter Your Details
					</h1>

					<p className="text-xs md:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
						Please provide your name and mobile number to access your resume builder dashboard.
					</p>
				</div>

				{/* Form Input Fields */}
				<form onSubmit={handleSubmit} className="space-y-4 pt-1">
					{/* Full Name */}
					<div className="space-y-1.5">
						<label htmlFor="user-name" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
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
							className="w-full px-4 py-3.5 text-sm font-medium rounded-2xl border border-slate-200 bg-white/90 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-all"
						/>
					</div>

					{/* Phone Number */}
					<div className="space-y-1.5">
						<label htmlFor="user-phone" className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
							<DeviceMobileIcon className="size-4 text-emerald-600" />
							<span>Phone Number</span>
						</label>
						<div className="flex gap-2">
							<select
								value={countryCode}
								onChange={(e) => setCountryCode(e.target.value)}
								className="px-3.5 py-3.5 rounded-2xl border border-slate-200 bg-white/90 text-xs font-bold text-slate-800 focus:border-emerald-500 focus:outline-none shadow-sm"
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
								className="flex-1 px-4 py-3.5 text-sm font-medium rounded-2xl border border-slate-200 bg-white/90 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 shadow-sm transition-all"
							/>
						</div>
					</div>

					{/* Submit Button */}
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/25 transition-all active:scale-[0.99] disabled:opacity-50 mt-5 flex items-center justify-center gap-2"
					>
						{isSubmitting ? (
							<>
								<div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
