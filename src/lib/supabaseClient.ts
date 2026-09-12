import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const hasSupabase = Boolean(supabaseUrl && supabaseAnonKey);

/**
 * `null` when VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY aren't set, so the
 * app (and the src/hooks/* data hooks) can fall back to demo mock data
 * instead of crashing — useful for running the frontend before a Supabase
 * project is connected. Copy .env.example to .env.local to enable it.
 */
export const supabase: SupabaseClient<Database> | null = hasSupabase
  ? createClient<Database>(supabaseUrl, supabaseAnonKey)
  : null;
