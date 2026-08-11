import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/*
 * When Supabase env vars are missing (e.g. local preview without .env),
 * fall back to a safe no-op client so the site still renders publicly.
 * Auth features activate automatically once the real keys are provided.
 */
const query = {
  select: () => query,
  insert: async () => ({ data: null, error: null }),
  update: async () => ({ data: null, error: null }),
  eq: () => query,
  single: async () => ({ data: null, error: null }),
}

const noopClient = {
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signUp: async () => ({
      data: null,
      error: { message: "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." },
    }),
    signInWithPassword: async () => ({
      data: null,
      error: { message: "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY." },
    }),
    signOut: async () => ({ error: null }),
  },
  from: () => query,
}

export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : noopClient
