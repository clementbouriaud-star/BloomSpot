import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const hasSupabaseEnv = Boolean(supabaseUrl && supabasePublishableKey);

if (!hasSupabaseEnv) {
  console.warn("Supabase env vars are missing: VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY.");
}

export const supabase = hasSupabaseEnv ? createClient(supabaseUrl, supabasePublishableKey) : null;
