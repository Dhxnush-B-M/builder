import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || "https://auxppvofumzpvpzvgfdw.supabase.co";
const supabaseAnonKey =
	(import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
	"sb_publishable_DCZpWmFGiWaFsVHhNOjzLQ_SS6c8zXZ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
