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

function getStorageKey(): string {
	const email = getActiveUserEmail() || "guest";
	return `rbuilder_resumes_${email}`;
}

export function getLocalResumes(): SavedResume[] {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(getStorageKey());
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

function saveToLocalStorageCache(list: SavedResume[]) {
	if (typeof window !== "undefined") {
		try {
			localStorage.setItem(getStorageKey(), JSON.stringify(list));
		} catch {
			// ignore storage errors
		}
	}
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
	const activeEmail = getActiveUserEmail();
	const [resumes, setResumes] = useState<SavedResume[]>(() => getLocalResumes());

	useEffect(() => {
		let isMounted = true;
		const currentEmail = getActiveUserEmail();

		if (!currentEmail) {
			setResumes([]);
			return;
		}

		// Initial state from local storage cache
		const initialLocal = getLocalResumes();
		setResumes(initialLocal);

		// Fetch and merge from Supabase DB
		getResumesFromSupabase(currentEmail)
			.then((records) => {
				if (!isMounted) return;
				const currentLocal = getLocalResumes();
				const mergedMap = new Map<string, SavedResume>();

				// Put local items first
				for (const item of currentLocal) {
					mergedMap.set(item.id, item);
				}

				// Merge remote records
				for (const rec of records) {
					if (!mergedMap.has(rec.id)) {
						mergedMap.set(rec.id, mapSupabaseRecordToSavedResume(rec));
					}
				}

				const mergedList = Array.from(mergedMap.values());
				saveToLocalStorageCache(mergedList);
				setResumes(mergedList);
			})
			.catch(() => null);

		const handleUpdate = () => {
			if (isMounted) {
				setResumes(getLocalResumes());
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
	const current = getLocalResumes();
	const existingIndex = current.findIndex((r) => r.id === resume.id);
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
		createdAt: existingIndex >= 0 ? current[existingIndex].createdAt : now,
		updatedAt: now,
	};

	if (existingIndex >= 0) {
		current[existingIndex] = newResume;
	} else {
		current.unshift(newResume);
	}

	saveToLocalStorageCache(current);
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
	const current = getLocalResumes().filter((r) => r.id !== id);
	saveToLocalStorageCache(current);
	notifyResumesUpdated();

	// Exclusively delete directly from Supabase DB
	void deleteResumeFromSupabase(id);
}
