import { createClient } from "@supabase/supabase-js"

export const SUPABASE_PROJECT_URL = "https://hsluwsyabelecjjqbuzo.supabase.co"
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhzbHV3c3lhYmVsZWNqanFidXpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk1MDgxMjQsImV4cCI6MjA5NTA4NDEyNH0.zd_iw9WfS-raKjpSc7qZy0jf114VRwXx3scFi0JqumU"
export const SUPABASE_EDGE_INTAKE_URL = `${SUPABASE_PROJECT_URL}/functions/v1/academy-intake`

const isTestEnv =
  typeof process !== "undefined" &&
  (process.env.VITEST === "true" || process.env.NODE_ENV === "test")

const supabaseUrl = isTestEnv
  ? process.env.NEXT_PUBLIC_SUPABASE_URL
  : process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_PROJECT_URL

const supabaseKey = isTestEnv
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey)

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null
