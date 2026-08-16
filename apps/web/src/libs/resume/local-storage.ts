import type { SupabaseResumeRecord } from "@/libs/supabase/db";
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

// Pure in-memory cache (zero localStorage usage for resume documents)
let inMemoryStore: SavedResume[] = [];
const RESUMES_UPDATED_EVENT = "rbuilder_supabase_resumes_updated";

export function getActiveUserEmail(): string | null {
	if (typeof window === "undefined") return null;
	try {
		const rawEmail = localStorage.getItem("rbuilder_user_email");
		if (rawEmail) return rawEmail.trim().toLowerCase();
		const rawSupabase = localStorage.getItem("rbuilder_supabase_user");
		if (rawSupabase) return (JSON.parse(rawSupabase).email || "").trim().toLowerCase() || null;
		const rawLocal = localStorage.getItem("rbuilder_user");
		if (rawLocal) return (JSON.parse(rawLocal).email || "").trim().toLowerCase() || null;
		return null;
	} catch {
		return null;
	}
}

export function getLocalResumes(): SavedResume[] {
	return inMemoryStore;
}

function notifyResumesUpdated() {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new Event(RESUMES_UPDATED_EVENT));
	}
}

function mapSupabaseRecordToSavedResume(rec: SupabaseResumeRecord): SavedResume {
	return {
		id: rec.id,
		userEmail: rec.user_id,
		name: rec.title || "My Resume",
		slug: (rec.title || "My Resume").toLowerCase().replace(/\s+/g, "-"),
		tags: [],
		data: (rec.content as any) || structuredClone(defaultResumeData),
		isPublic: true,
		isLocked: false,
		hasPassword: false,
		createdAt: new Date(rec.updated_at || Date.now()),
		updatedAt: new Date(rec.updated_at || Date.now()),
	};
}

export function useLocalResumes(): SavedResume[] {
	const _activeEmail = getActiveUserEmail();
	const [resumes, setResumes] = useState<SavedResume[]>(inMemoryStore);

	useEffect(() => {
		let isMounted = true;
		const currentEmail = getActiveUserEmail();

		if (!currentEmail) {
			inMemoryStore = [];
			setResumes([]);
			return;
		}

		// Query Supabase DB directly
		const fetchFromSupabase = () => {
			getResumesFromSupabase(currentEmail)
				.then((records) => {
					if (!isMounted) return;
					const remoteMapped = records.map(mapSupabaseRecordToSavedResume);
					const mergedMap = new Map<string, SavedResume>();

					// Preserve in-memory local creations first
					for (const item of inMemoryStore) {
						mergedMap.set(item.id, item);
					}

					// Merge remote records from Supabase
					for (const item of remoteMapped) {
						if (!mergedMap.has(item.id)) {
							mergedMap.set(item.id, item);
						}
					}

					const mergedList = Array.from(mergedMap.values());
					inMemoryStore = mergedList;
					setResumes([...mergedList]);
				})
				.catch(() => null);
		};

		fetchFromSupabase();

		const handleUpdate = () => {
			if (isMounted) {
				setResumes([...inMemoryStore]);
			}
		};

		window.addEventListener(RESUMES_UPDATED_EVENT, handleUpdate);

		return () => {
			isMounted = false;
			window.removeEventListener(RESUMES_UPDATED_EVENT, handleUpdate);
		};
	}, []);

	return resumes;
}

export function saveLocalResume(resume: Partial<SavedResume> & { id: string; name: string }): SavedResume {
	const existingIndex = inMemoryStore.findIndex((r) => r.id === resume.id);
	const now = new Date();
	const activeEmail = getActiveUserEmail() || "user@example.com";

	const newResume: SavedResume = {
		id: resume.id,
		userEmail: resume.userEmail || activeEmail,
		name: resume.name,
		slug: resume.slug || resume.name.toLowerCase().replace(/\s+/g, "-"),
		tags: resume.tags || [],
		data: resume.data || structuredClone(defaultResumeData),
		isPublic: resume.isPublic ?? true,
		isLocked: resume.isLocked ?? false,
		hasPassword: resume.hasPassword ?? false,
		createdAt: existingIndex >= 0 ? inMemoryStore[existingIndex].createdAt : now,
		updatedAt: now,
	};

	if (existingIndex >= 0) {
		inMemoryStore[existingIndex] = newResume;
	} else {
		inMemoryStore.unshift(newResume);
	}

	notifyResumesUpdated();

	// Exclusively save directly to Supabase DB
	saveResumeToSupabase({
		id: newResume.id,
		title: newResume.name,
		data: newResume.data,
	})
		.then(() => {
			notifyResumesUpdated();
		})
		.catch(() => null);

	return newResume;
}

export function deleteLocalResume(id: string): void {
	inMemoryStore = inMemoryStore.filter((r) => r.id !== id);
	notifyResumesUpdated();

	// Exclusively delete directly from Supabase DB
	void deleteResumeFromSupabase(id);
}
