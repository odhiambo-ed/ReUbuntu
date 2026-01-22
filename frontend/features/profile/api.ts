import { createClient } from "@/lib/supabase/client";
import type { Profile, UpdateProfileInput } from "./types";

export async function fetchCurrentProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // Profile not found - this might happen before profile is created
      return null;
    }
    throw new Error(error.message);
  }

  return data as Profile;
}

export async function updateProfile(
input: UpdateProfileInput, userId: string,
): Promise<Profile> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("profiles")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Profile;
}
