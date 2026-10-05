// Reads and validates the two PUBLIC Supabase values.
// The anon key is designed to be public (it is shipped to the browser).
// NEVER put the "service_role" key anywhere in this project.
export function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Check your .env.local file."
    );
  }
  return { url, anonKey };
}
