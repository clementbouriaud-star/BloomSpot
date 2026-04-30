import { supabase } from "./supabaseClient";

export async function signInWithPassword({ email, password }) {
  if (!supabase) throw new Error("Supabase not configured.");
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithPassword({ email, password }) {
  if (!supabase) throw new Error("Supabase not configured.");
  return supabase.auth.signUp({ email, password });
}

export async function signOutAuth() {
  if (!supabase) throw new Error("Supabase not configured.");
  return supabase.auth.signOut();
}

export async function getCurrentSession() {
  if (!supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthChange(callback) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange((_event, session) => callback(session));
}
