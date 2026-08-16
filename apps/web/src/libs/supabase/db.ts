import { supabase } from "./client";

export interface SupabaseUserProfile {
	id: string;
	email: string;
	name: string;
	avatar_url?: string;
	provider: "google_oauth2" | "email";
	created_at: string;
	last_login: string;
}

export interface SupabaseResumeRecord {
	id: string;
	user_id: string;
	title: string;
	content: unknown;
	updated_at: string;
}

function getActiveUserEmailFromStorage(): string | null {
	if (typeof window === "undefined") return null;
	try {
		const rawEmail = localStorage.getItem("rbuilder_user_email");
		if (rawEmail) return rawEmail;
		const rawSupabase = localStorage.getItem("rbuilder_supabase_user");
		if (rawSupabase) return JSON.parse(rawSupabase).email || null;
		const rawLocal = localStorage.getItem("rbuilder_user");
		if (rawLocal) return JSON.parse(rawLocal).email || null;
		return null;
	} catch {
		return null;
	}
}

/**
 * Save or update user profile in Supabase Database ('profiles' table)
 */
export async function saveUserToSupabase(user: { email: string; name: string; avatar?: string; plan?: string }) {
	const userEmail = user.email || "user@example.com";
	const userName = user.name || userEmail.split("@")[0] || "User";
	const userAvatar = user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(userEmail)}`;
	const userId = userEmail;
	const isoNow = new Date().toISOString();

	const profileData: SupabaseUserProfile = {
		id: userId,
		email: userEmail,
		name: userName,
		avatar_url: userAvatar,
		provider: "google_oauth2",
		created_at: isoNow,
		last_login: isoNow,
	};

	const userData = {
		id: userId,
		email: userEmail,
		name: userName,
		image: userAvatar,
		email_verified: true,
		created_at: isoNow,
		updated_at: isoNow,
	};

	if (typeof window !== "undefined") {
		localStorage.setItem("rbuilder_supabase_user", JSON.stringify(profileData));
		localStorage.setItem("rbuilder_user_email", userEmail);
	}

	try {
		await Promise.allSettled([
			supabase.from("profiles").upsert(profileData, { onConflict: "email" }),
			supabase.from("users").upsert(userData, { onConflict: "email" }),
		]);
	} catch (e) {
		console.warn("Supabase user sync exception:", e);
	}

	return profileData;
}

/**
 * Save resume document state directly to Supabase Database ('resumes' table)
 */
export async function saveResumeToSupabase(
	paramOrId: string | { id: string; title: string; data: unknown },
	titleParam?: string,
	dataParam?: unknown,
) {
	let resumeId: string;
	let title: string;
	let data: unknown;

	if (typeof paramOrId === "object" && paramOrId !== null) {
		resumeId = paramOrId.id;
		title = paramOrId.title;
		data = paramOrId.data;
	} else {
		resumeId = paramOrId;
		title = titleParam || "My Resume";
		data = dataParam;
	}

	const activeEmail = (getActiveUserEmailFromStorage() || "guest@example.com").trim().toLowerCase();

	const record: SupabaseResumeRecord = {
		id: resumeId,
		user_id: activeEmail,
		title: title || "My Resume",
		content: data || {},
		updated_at: new Date().toISOString(),
	};

	try {
		const { error: upsertErr } = await supabase.from("resumes").upsert(record);
		if (upsertErr) {
			console.warn("Supabase upsert note, executing fallback insert/update:", upsertErr.message);
			const { data: existing } = await supabase.from("resumes").select("id").eq("id", record.id).maybeSingle();
			if (existing) {
				await supabase
					.from("resumes")
					.update({
						user_id: record.user_id,
						title: record.title,
						content: record.content,
						updated_at: record.updated_at,
					})
					.eq("id", record.id);
			} else {
				await supabase.from("resumes").insert(record);
			}
		}
	} catch (e) {
		console.warn("Supabase resume save exception:", e);
	}

	return record;
}

/**
 * Fetch a single resume directly from Supabase Database ('resumes' table) by ID
 */
export async function getResumeByIdFromSupabase(id: string): Promise<SupabaseResumeRecord | null> {
	try {
		const { data, error } = await supabase.from("resumes").select("*").eq("id", id).maybeSingle();
		if (error || !data) return null;
		return data as SupabaseResumeRecord;
	} catch {
		return null;
	}
}

/**
 * Fetch total logged-in user count directly from Supabase Database ('profiles' or 'users' table)
 */
export async function getUsersCountFromSupabase(): Promise<number> {
	try {
		const { count: profileCount, error: profileErr } = await supabase
			.from("profiles")
			.select("*", { count: "exact", head: true });
		if (!profileErr && profileCount !== null && profileCount > 0) return profileCount;

		const { count: usersCount, error: usersErr } = await supabase
			.from("users")
			.select("*", { count: "exact", head: true });
		if (!usersErr && usersCount !== null && usersCount > 0) return usersCount;

		return 1;
	} catch {
		return 1;
	}
}

/**
 * Fetch total resumes count directly from Supabase Database ('resumes' table) across all users
 */
export async function getAllResumesCountFromSupabase(): Promise<number> {
	try {
		const { count, error } = await supabase.from("resumes").select("*", { count: "exact", head: true });
		if (!error && count !== null) return count;
		return 0;
	} catch {
		return 0;
	}
}

/**
 * Fetch registered user profiles from Supabase Database ('profiles' or 'users' table)
 */
export async function getRegisteredProfilesFromSupabase(): Promise<SupabaseUserProfile[]> {
	try {
		const { data: profiles, error } = await supabase.from("profiles").select("*").limit(10);
		if (!error && profiles && profiles.length > 0) return profiles as SupabaseUserProfile[];

		const { data: users, error: usersErr } = await supabase.from("users").select("*").limit(10);
		if (!usersErr && users && users.length > 0) {
			return users.map((u: any) => ({
				id: u.id || u.email,
				email: u.email,
				name: u.name || (u.email || "").split("@")[0] || "User",
				avatar_url: u.image,
				provider: "email",
				created_at: u.created_at || new Date().toISOString(),
				last_login: u.updated_at || new Date().toISOString(),
			}));
		}

		return [];
	} catch {
		return [];
	}
}

/**
 * Fetch resumes for a specific user from Supabase Database ('resumes' table)
 */
export async function getResumesFromSupabase(targetEmail?: string): Promise<SupabaseResumeRecord[]> {
	try {
		const email = (targetEmail || getActiveUserEmailFromStorage() || "").trim().toLowerCase();
		if (!email) return [];

		// Query by case-insensitive email matching in Supabase
		const { data, error } = await supabase.from("resumes").select("*").ilike("user_id", email);

		if (!error && data && data.length > 0) {
			return data as SupabaseResumeRecord[];
		}

		// Fallback query by exact eq in case ilike is restricted
		const { data: fallbackData } = await supabase.from("resumes").select("*").eq("user_id", email);

		return (fallbackData || []) as SupabaseResumeRecord[];
	} catch {
		return [];
	}
}

/**
 * Delete resume directly from Supabase Database ('resumes' table)
 */
export async function deleteResumeFromSupabase(id: string) {
	try {
		const { error } = await supabase.from("resumes").delete().eq("id", id);
		if (error) {
			console.warn("Supabase resume delete note:", error.message);
		}
	} catch (e) {
		console.warn("Supabase resume delete exception:", e);
	}
}

export interface SupabaseFeedbackRecord {
	id: string;
	name: string;
	description: string;
	rating: number;
	created_at: string;
}

/**
 * Save user feedback to Supabase Database ('feedback' table) & LocalStorage fallback
 */
export async function saveFeedbackToSupabase(feedback: { name: string; description: string; rating: number }) {
	const record: SupabaseFeedbackRecord = {
		id: String(Date.now()),
		name: feedback.name || "User",
		description: feedback.description,
		rating: feedback.rating || 5,
		created_at: new Date().toISOString(),
	};

	if (typeof window !== "undefined") {
		try {
			const existingRaw = localStorage.getItem("rbuilder_feedbacks");
			const list: SupabaseFeedbackRecord[] = existingRaw ? JSON.parse(existingRaw) : [];
			list.unshift(record);
			localStorage.setItem("rbuilder_feedbacks", JSON.stringify(list));
		} catch {
			// ignore
		}
	}

	try {
		await supabase.from("feedback").insert(record);
	} catch (e) {
		console.warn("Supabase feedback save exception:", e);
	}

	return record;
}

/**
 * Fetch all user feedback from Supabase Database ('feedback' table) & LocalStorage fallback
 */
export async function getFeedbacksFromSupabase(): Promise<SupabaseFeedbackRecord[]> {
	const localItems: SupabaseFeedbackRecord[] = [];
	if (typeof window !== "undefined") {
		try {
			const existingRaw = localStorage.getItem("rbuilder_feedbacks");
			if (existingRaw) {
				localItems.push(...JSON.parse(existingRaw));
			}
		} catch {
			// ignore
		}
	}

	try {
		const { data, error } = await supabase
			.from("feedback")
			.select("*")
			.order("created_at", { ascending: false })
			.limit(20);

		if (!error && data && data.length > 0) {
			const remoteMap = new Map<string, SupabaseFeedbackRecord>();
			for (const item of localItems) remoteMap.set(item.id, item);
			for (const item of data) remoteMap.set(item.id, item as SupabaseFeedbackRecord);
			return Array.from(remoteMap.values()).sort(
				(a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
			);
		}
	} catch {
		// ignore
	}

	return localItems;
}

export interface SupabaseUserDetailsRecord {
	id?: string;
	email: string;
	name: string;
	phone: string;
	plan?: string;
	created_at?: string;
}

/**
 * Save user name and phone number directly into Supabase Database ('user_details' table) & LocalStorage
 */
export async function saveUserDetailsToSupabase(details: {
	email?: string;
	name: string;
	phone: string;
	plan?: string;
}) {
	const activeEmail = (details.email || getActiveUserEmailFromStorage() || "user@example.com").trim().toLowerCase();
	const record: SupabaseUserDetailsRecord = {
		id: activeEmail,
		email: activeEmail,
		name: details.name || "User",
		phone: details.phone || "",
		plan:
			details.plan ||
			(typeof window !== "undefined" ? localStorage.getItem("rbuilder_subscription_plan") || "monthly" : "monthly"),
		created_at: new Date().toISOString(),
	};

	if (typeof window !== "undefined") {
		localStorage.setItem("rbuilder_user_phone", details.phone);
		localStorage.setItem("rbuilder_onboarding_completed", "true");
		localStorage.setItem(`rbuilder_onboarded_${activeEmail}`, "true");
		try {
			const existingUser = localStorage.getItem("rbuilder_user");
			const parsed = existingUser ? JSON.parse(existingUser) : {};
			localStorage.setItem(
				"rbuilder_user",
				JSON.stringify({ ...parsed, name: details.name, phone: details.phone, email: activeEmail }),
			);
		} catch {
			// ignore
		}
	}

	try {
		// Subscription state is written only by the verified server-side payment endpoint.
		// The browser may update profile details, but must never be able to grant a plan.
		await supabase
			.from("profiles")
			.upsert(
				{ id: activeEmail, email: activeEmail, name: details.name, phone: details.phone },
				{ onConflict: "email" },
			);
	} catch (e) {
		console.warn("Supabase user details sync exception:", e);
	}

	return record;
}

/**
 * Check if a specific Gmail/user email has already completed payment & onboarding in Supabase
 */
export async function checkUserSubscriptionAndOnboardingFromSupabase(
	email: string,
): Promise<{ paid: boolean; onboarded: boolean }> {
	const cleanEmail = (email || "").trim().toLowerCase();
	if (!cleanEmail) return { paid: false, onboarded: false };

	if (typeof window !== "undefined") {
		const paymentStatus = localStorage.getItem("rbuilder_payment_status");
		const onboardingCompleted = localStorage.getItem("rbuilder_onboarding_completed");
		const paymentEmail = localStorage.getItem("rbuilder_payment_email");
		const paidLocally =
			(paymentStatus === "active" && (!paymentEmail || paymentEmail === cleanEmail)) ||
			localStorage.getItem(`rbuilder_paid_${cleanEmail}`) === "true";
		const onboardedLocally =
			onboardingCompleted === "true" || localStorage.getItem(`rbuilder_onboarded_${cleanEmail}`) === "true";

		if (paidLocally || onboardedLocally) {
			return { paid: paidLocally, onboarded: onboardedLocally };
		}
	}

	try {
		const { data: detail } = await supabase.from("user_details").select("*").eq("email", cleanEmail).maybeSingle();
		if (detail?.plan === "monthly" || detail?.plan === "quarterly") {
			const { data: profile } = await supabase.from("profiles").select("phone").eq("email", cleanEmail).maybeSingle();
			if (typeof window !== "undefined") {
				localStorage.setItem("rbuilder_payment_status", "active");
			}
			return { paid: true, onboarded: Boolean(profile?.phone) };
		}
	} catch {
		// ignore
	}

	return { paid: false, onboarded: false };
}
