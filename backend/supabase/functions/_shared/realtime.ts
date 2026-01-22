import type { SupabaseClient } from "@supabase/supabase-js";

export interface ProgressPayload {
  status: string;
  message: string;
  progress: number;
  total_rows?: number;
  validated?: number;
  valid_count?: number;
  success_count?: number;
  error_count?: number;
}

export async function broadcastProgress(
  supabase: SupabaseClient,
  uploadId: string,
  payload: ProgressPayload,
): Promise<void> {
  await supabase.channel(`upload:${uploadId}`).send({
    type: "broadcast",
    event: "progress",
    payload,
  });
}
