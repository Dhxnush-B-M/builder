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

/**
 * Save or update Google OAuth 2.0 user profile in Supabase Database ('profiles' table)
 */
export async function saveUserToSupabase(user: { email: string; name: string; avatar?: string }) {
	const profileData: SupabaseUserProfile = {
		id: `user_${Date.now()}`,
		email: user.email,
		name: user.name,
		avatar_url: user.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(user.email),
		provider: "google_oauth2",
		created_at: new Date().toISOString(),
		last_login: new Date().toISOString(),
	};

	// Save to local storage cache as well for instant zero-latency client state
	localStorage.setItem("rbuilder_supabase_user", JSON.stringify(profileData));
	localStorage.setItem("rbuilder_user_email", user.email);

	try {
		// Attempt insert/upsert into Supabase database table 'profiles'
		const { error } = await supabase.from("profiles").upsert(profileData, { onConflict: "email" });
		if (error) {
			console.warn("Supabase database note (table sync fallback):", error.message);
		}
	} catch (e) {
		console.warn("Supabase database sync exception:", e);
	}

	return profileData;
}

/**
 * Save resume document state directly to Supabase Database ('resumes' table)
 */
export async function saveResumeToSupabase(resumeId: string, title: string, data: unknown) {
	const currentUserStr = localStorage.getItem("rbuilder_supabase_user");
	const userId = currentUserStr ? JSON.parse(currentUserStr).id : "guest_user";

	const record: SupabaseResumeRecord = {
		id: resumeId,
		user_id: userId,
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
