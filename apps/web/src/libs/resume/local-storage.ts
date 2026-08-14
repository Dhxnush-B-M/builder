import { useEffect, useState } from "react";
import { defaultResumeData } from "@rbuilder/schema/resume/default";
import { deleteResumeFromSupabase, getResumesFromSupabase, saveResumeToSupabase } from "@/libs/supabase/db";

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
const RESUMES_UPDATED_EVENT = "rbuilder_resumes_updated";

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
			return list.filter((r: SavedResume) => !r.userEmail || r.userEmail === currentEmail);
		}

		return list;
	} catch {
		return [];
	}
}

export function useLocalResumes(): SavedResume[] {
	const [resumes, setResumes] = useState<SavedResume[]>(() => getLocalResumes());

	useEffect(() => {
		const refresh = () => setResumes(getLocalResumes());
		refresh();

		// Fetch and merge resumes from Supabase DB
		getResumesFromSupabase()
			.then((supabaseRecords) => {
				if (supabaseRecords && supabaseRecords.length > 0) {
					const current = getLocalResumes();
					const currentMap = new Map(current.map((r) => [r.id, r]));
					let updated = false;

					for (const rec of supabaseRecords) {
						if (!currentMap.has(rec.id)) {
							currentMap.set(rec.id, {
								id: rec.id,
								name: rec.title || "My Resume",
								slug: (rec.title || "My Resume").toLowerCase().replace(/\s+/g, "-"),
								tags: [],
								data: (rec.content as any) || defaultResumeData,
								isPublic: true,
								isLocked: false,
								hasPassword: false,
								createdAt: new Date(rec.updated_at || Date.now()),
								updatedAt: new Date(rec.updated_at || Date.now()),
							});
							updated = true;
						}
					}

					if (updated && typeof window !== "undefined") {
						const merged = Array.from(currentMap.values());
						localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
						setResumes(merged);
					}
				}
			})
			.catch(() => null);

		window.addEventListener(RESUMES_UPDATED_EVENT, refresh);
		window.addEventListener("storage", refresh);

		return () => {
			window.removeEventListener(RESUMES_UPDATED_EVENT, refresh);
			window.removeEventListener("storage", refresh);
		};
	}, []);

	return resumes;
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
		window.dispatchEvent(new Event(RESUMES_UPDATED_EVENT));
	}

	// Sync resume directly to Supabase DB
	void saveResumeToSupabase({
		id: newResume.id,
		title: newResume.name,
		data: newResume.data,
	});

	return newResume;
}

export function deleteLocalResume(id: string): void {
	if (typeof window !== "undefined") {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				const filtered = parsed.filter((r: any) => r.id !== id);
				localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
				window.dispatchEvent(new Event(RESUMES_UPDATED_EVENT));
			}
		} catch {
			// ignore storage errors
		}
	}

	// Delete from Supabase DB as well
	void deleteResumeFromSupabase(id);
}
