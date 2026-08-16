import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://auxppvofumzpvpzvgfdw.supabase.co";
const supabaseAnonKey =
	import.meta.env.VITE_SUPABASE_ANON_KEY ||
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1eHBwdm9mdW16cHZwenZnZmR3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjAyNDE1NCwiZXhwIjoyMTAxNjAwMTU0fQ.qbIm37eysTiWY31cWlz51JORwg38LEcTnPG0igkThcE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
	auth: {
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
		storage: typeof window !== "undefined" ? window.localStorage : undefined,
	},
});

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
