import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * Standalone Supabase client for the landing page's waitlist form only —
 * intentionally not imported from src/lib/supabaseClient.ts (the dashboard's
 * typed client) so the landing build has zero dependency on the dashboard's
 * schema types. `null` when the env vars aren't set, so the form can fall
 * back to a friendly "try again later" instead of crashing.
 */
export const landingSupabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
