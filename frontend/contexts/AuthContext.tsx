"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type {
  User,
  Session,
  AuthError,
  AuthChangeEvent,
} from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  logoutInProgress: boolean;
  error: AuthError | null;
  signInWithEmail: (
    email: string,
    password: string,
  ) => Promise<{ error: AuthError | null }>;
  signUpWithEmail: (
    email: string,
    password: string,
    userData?: { name?: string },
  ) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function postJson<TResponse>(
  url: string,
  body: unknown,
): Promise<TResponse> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const json = (await res.json()) as { error?: unknown; message?: unknown };
      if (typeof json?.error === "string") message = json.error;
      else if (typeof json?.message === "string") message = json.message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return (await res.json()) as TResponse;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabaseRef = useRef<ReturnType<typeof createClient> | null>(null);

  const getSupabase = useCallback(() => {
    if (!supabaseRef.current) {
      supabaseRef.current = createClient();
    }
    return supabaseRef.current;
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [logoutInProgress, setLogoutInProgress] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const refreshSession = useCallback(async () => {
    const supabase = getSupabase();
    const {
      data: { session },
    } = await supabase.auth.getSession();
    setSession(session);
    setUser(session?.user ?? null);
  }, [getSupabase]);

  // Bootstrap session
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const supabase = getSupabase();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session) {
          setSession(session);
          setUser(session.user);
        } else {
          setSession(null);
          setUser(null);
        }
      } catch (err) {
        if (!mounted) return;
        setError(err as AuthError);
        setSession(null);
        setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [getSupabase]);

  // Listen for auth state changes
  useEffect(() => {
    let mounted = true;

    const supabase = getSupabase();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, nextSession: Session | null) => {
        if (!mounted) return;

        setError(null);

        if (event === "SIGNED_OUT" || !nextSession) {
          setSession(null);
          setUser(null);
          setLoading(false);
          return;
        }

        setSession(nextSession);
        setUser(nextSession.user);
        setLoading(false);
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [getSupabase]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);

      try {
        const supabase = getSupabase();
        const { data: loginData, error } =
          await supabase.auth.signInWithPassword({
            email,
            password,
          });

        if (!error && loginData?.session) {
          const { access_token, refresh_token } = loginData.session;
          try {
            await postJson<{ success: boolean }>("/api/callback", {
              access_token,
              refresh_token,
            });
          } catch {
            // If cookie sync fails, the app can still work client-side
          }
        }

        if (error) {
          setError(error);
          return { error };
        }

        return { error: null };
      } catch (err) {
        const authError = err as AuthError;
        setError(authError);
        return { error: authError };
      } finally {
        setLoading(false);
      }
    },
    [getSupabase],
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string, userData?: { name?: string }) => {
      setLoading(true);
      setError(null);

      try {
        const supabase = getSupabase();
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: userData,
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          setError(error);
          return { error };
        }

        return { error: null };
      } catch (err) {
        const authError = err as AuthError;
        setError(authError);
        return { error: authError };
      } finally {
        setLoading(false);
      }
    },
    [getSupabase],
  );

  const signInWithGoogle = useCallback(async () => {
    setError(null);

    const callbackUrl = `${window.location.origin}/auth/callback`;

    const supabase = getSupabase();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: callbackUrl,
      },
    });

    if (error) setError(error);
    return { error };
  }, [getSupabase]);

  const signOut = useCallback(async () => {
    setLogoutInProgress(true);
    setError(null);

    // Instant UI update
    setUser(null);
    setSession(null);
    setLoading(false);

    // Immediate redirect for better UX
    window.location.href = "/auth";

    // Background cleanup
    const cleanup = async () => {
      try {
        const supabase = getSupabase();
        await supabase.auth.signOut({ scope: "global" });
      } catch {
        // ignore
      }

      try {
        await fetch("/api/logout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          keepalive: true,
        });
      } catch {
        // ignore
      }
    };

    setTimeout(() => {
      cleanup().finally(() => {
        setLogoutInProgress(false);
      });
    }, 0);
  }, [getSupabase]);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      session,
      loading,
      logoutInProgress,
      error,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      refreshSession,
    }),
    [
      user,
      session,
      loading,
      logoutInProgress,
      error,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
      refreshSession,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
