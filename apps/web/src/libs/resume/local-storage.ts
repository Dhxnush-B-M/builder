import { defaultResumeData } from "@rbuilder/schema/resume/default";
import { saveResumeToSupabase } from "@/libs/supabase/db";

export type SavedResume = {
	id: string;
	userEmail?: string;
	name: string;
	slug: string;
	tags: string[];
	data: typeof defaultResumeData;
	isPublic: boolean;
	isLocked: boolean;
	hasPassword: boolean;
	createdAt: Date;
	updatedAt: Date;
};

const STORAGE_KEY = "rbuilder_saved_resumes";

export function getActiveUserEmail(): string | null {
	if (typeof window === "undefined") return null;
	try {
		const raw = localStorage.getItem("rbuilder_user");
		if (!raw) return null;
		const user = JSON.parse(raw);
		return user?.email || null;
	} catch {
		return null;
	}
}

export function getLocalResumes(): SavedResume[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		const currentEmail = getActiveUserEmail();

		const list = parsed.map((item: any) => ({
			...item,
			createdAt: new Date(item.createdAt),
			updatedAt: new Date(item.updatedAt),
		}));

		if (currentEmail) {
			// Filter resumes to return only those belonging to the currently logged in user
			return list.filter((r: SavedResume) => !r.userEmail || r.userEmail === currentEmail);
		}

		return list;
	} catch {
		return [];
	}
}

export function saveLocalResume(resume: Partial<SavedResume> & { id: string; name: string }): SavedResume {
	const current = getLocalResumes();
	const existingIndex = current.findIndex((r) => r.id === resume.id);
	const currentEmail = getActiveUserEmail() || "guest@example.com";
	
	const now = new Date();
	const newResume: SavedResume = {
		id: resume.id,
		userEmail: resume.userEmail || currentEmail,
		name: resume.name,
		slug: resume.slug || resume.name.toLowerCase().replace(/\s+/g, "-"),
		tags: resume.tags || [],
		data: resume.data || structuredClone(defaultResumeData),
		isPublic: resume.isPublic ?? true,
		isLocked: resume.isLocked ?? false,
		hasPassword: resume.hasPassword ?? false,
		createdAt: existingIndex >= 0 ? current[existingIndex].createdAt : now,
		updatedAt: now,
	};

	if (existingIndex >= 0) {
		current[existingIndex] = newResume;
	} else {
		current.unshift(newResume);
	}

	if (typeof window !== "undefined") {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
	}

	// Also sync to Supabase DB asynchronously
	void saveResumeToSupabase({
		id: newResume.id,
		title: newResume.name,
		data: newResume.data,
	});

	return newResume;
}

export function deleteLocalResume(id: string): void {
	if (typeof window === "undefined") return;
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return;
		const parsed = JSON.parse(raw);
		const filtered = parsed.filter((r: any) => r.id !== id);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
	} catch {
		// ignore storage errors
	}
}
