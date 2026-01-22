import { createBrowserClient } from "@supabase/ssr";

// Singleton client instance for SSR-compatible client
let browserClientInstance: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  // Return existing instance if available
  if (browserClientInstance) {
    return browserClientInstance;
  }

  // Guard against missing env vars during build/SSR
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
    );
  }

  // Create new instance only if none exists, with full session persistence
  browserClientInstance = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
    },
  });

  return browserClientInstance;
}
