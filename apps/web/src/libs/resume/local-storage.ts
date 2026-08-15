import { useEffect, useState } from "react";
import { defaultResumeData } from "@rbuilder/schema/resume/default";
import {
	deleteResumeFromSupabase,
	getResumesFromSupabase,
	saveResumeToSupabase,
	type SupabaseResumeRecord,
} from "@/libs/supabase/db";

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

// In-memory cache for fast synchronous rendering during state updates
let inMemoryResumesCache: SavedResume[] = [];
const RESUMES_UPDATED_EVENT = "rbuilder_supabase_resumes_updated";

function notifyResumesUpdated() {
	if (typeof window !== "undefined") {
		window.dispatchEvent(new Event(RESUMES_UPDATED_EVENT));
	}
}

function mapSupabaseRecordToSavedResume(rec: SupabaseResumeRecord): SavedResume {
	return {
		id: rec.id,
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

export function getActiveUserEmail(): string | null {
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

export function getLocalResumes(): SavedResume[] {
	return inMemoryResumesCache;
}

export function useLocalResumes(): SavedResume[] {
	const activeEmail = getActiveUserEmail();
	const [resumes, setResumes] = useState<SavedResume[]>(inMemoryResumesCache);

	useEffect(() => {
		let isMounted = true;
		const currentEmail = getActiveUserEmail();

		if (!currentEmail) {
			inMemoryResumesCache = [];
			setResumes([]);
			return;
		}

		const fetchFromSupabase = () => {
			getResumesFromSupabase(currentEmail)
				.then((records) => {
					if (!isMounted) return;
					const mapped = records.map(mapSupabaseRecordToSavedResume);
					inMemoryResumesCache = mapped;
					setResumes(mapped);
				})
				.catch(() => null);
		};

		fetchFromSupabase();

		const handleUpdate = () => {
			if (isMounted) {
				fetchFromSupabase();
			}
		};
		window.addEventListener(RESUMES_UPDATED_EVENT, handleUpdate);

		return () => {
			isMounted = false;
			window.removeEventListener(RESUMES_UPDATED_EVENT, handleUpdate);
		};
	}, [activeEmail]);

	return resumes;
}

export function saveLocalResume(resume: Partial<SavedResume> & { id: string; name: string }): SavedResume {
	const existingIndex = inMemoryResumesCache.findIndex((r) => r.id === resume.id);
	const now = new Date();

	const newResume: SavedResume = {
		id: resume.id,
		userEmail: resume.userEmail || getActiveUserEmail() || "user@example.com",
		name: resume.name,
		slug: resume.slug || resume.name.toLowerCase().replace(/\s+/g, "-"),
		tags: resume.tags || [],
		data: resume.data || structuredClone(defaultResumeData),
		isPublic: resume.isPublic ?? true,
		isLocked: resume.isLocked ?? false,
		hasPassword: resume.hasPassword ?? false,
		createdAt: existingIndex >= 0 ? inMemoryResumesCache[existingIndex].createdAt : now,
		updatedAt: now,
	};

	if (existingIndex >= 0) {
		inMemoryResumesCache[existingIndex] = newResume;
	} else {
		inMemoryResumesCache.unshift(newResume);
	}

	notifyResumesUpdated();

	// Exclusively save directly to Supabase DB
	void saveResumeToSupabase({
		id: newResume.id,
		title: newResume.name,
		data: newResume.data,
	});

	return newResume;
}

export function deleteLocalResume(id: string): void {
	inMemoryResumesCache = inMemoryResumesCache.filter((r) => r.id !== id);
	notifyResumesUpdated();

	// Exclusively delete directly from Supabase DB
	void deleteResumeFromSupabase(id);
}
