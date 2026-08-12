import { defaultResumeData } from "@reactive-resume/schema/resume/default";
import { saveResumeToSupabase } from "@/libs/supabase/db";

export type SavedResume = {
	id: string;
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

export function getLocalResumes(): SavedResume[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return parsed.map((item: any) => ({
			...item,
			createdAt: new Date(item.createdAt),
			updatedAt: new Date(item.updatedAt),
		}));
	} catch {
		return [];
	}
}

export function saveLocalResume(resume: Partial<SavedResume> & { id: string; name: string }): SavedResume {
	const current = getLocalResumes();
	const existingIndex = current.findIndex((r) => r.id === resume.id);
	
	const now = new Date();
	const newResume: SavedResume = {
		id: resume.id,
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
	const current = getLocalResumes();
	const filtered = current.filter((r) => r.id !== id);
	if (typeof window !== "undefined") {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
	}
}
