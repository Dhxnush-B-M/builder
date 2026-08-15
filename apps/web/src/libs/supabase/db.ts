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
export async function saveUserToSupabase(user: { email: string; name: string; avatar?: string }) {
	const userEmail = user.email || "user@example.com";
	const userName = user.name || userEmail.split("@")[0] || "User";
	const userAvatar =
		user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(userEmail);
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

	const activeEmail = getActiveUserEmailFromStorage() || "guest@example.com";

	const record: SupabaseResumeRecord = {
		id: resumeId,
		user_id: activeEmail,
		title,
		content: data,
		updated_at: new Date().toISOString(),
	};

	try {
		const { error } = await supabase.from("resumes").upsert(record, { onConflict: "id" });
		if (error) {
			console.warn("Supabase resume save note:", error.message);
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
 * Fetch resumes for a specific user from Supabase Database ('resumes' table)
 */
export async function getResumesFromSupabase(targetEmail?: string): Promise<SupabaseResumeRecord[]> {
	try {
		const email = targetEmail || getActiveUserEmailFromStorage();
		if (!email) return [];

		const { data, error } = await supabase
			.from("resumes")
			.select("*")
			.eq("user_id", email);

		if (error || !data) return [];
		return data as SupabaseResumeRecord[];
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
