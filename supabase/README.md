# Supabase cutover

This directory contains the Supabase-native replacement for the legacy server data layer.

1. Create a Supabase project and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.
2. Apply `migrations/20260807000000_core_schema.sql` with the Supabase CLI or SQL editor.
3. Configure Email and OAuth providers in the Supabase dashboard.
4. Move assets to the private `resume-assets` bucket. Object keys must start with the authenticated user's UUID.
5. Migrate legacy users and resume records with an explicit ID mapping. Existing Better Auth password hashes cannot be copied into Supabase Auth; users must reset passwords unless a controlled admin migration is used.
6. Replace the remaining oRPC calls in `apps/web/src` with the Supabase client, moving privileged AI, payment, password-protected public-resume, and PDF operations to Supabase Edge Functions. Public-resume reads must not query `public.resumes` directly, because an Edge Function must verify a password before returning the resume data.

Do not delete `apps/server`, `packages/api`, `packages/auth`, or `packages/db` until step 6 is complete. They are still required by 44 current oRPC call sites.
