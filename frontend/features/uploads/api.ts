import { createClient } from "@/lib/supabase/client";
import type {
  UploadSummary,
  UploadError,
  UploadFilters,
  CreateUploadInput,
  PaginatedUploadResponse,
} from "./types";

const DEFAULT_PAGE_SIZE = 20;

export async function fetchUploads(
  filters: UploadFilters = {},
): Promise<PaginatedUploadResponse> {
  const supabase = createClient();
  const page = filters.page ?? 1;
  const limit = filters.limit ?? DEFAULT_PAGE_SIZE;
  const offset = (page - 1) * limit;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  let query = supabase
    .from("upload_summary")
    .select("*", { count: "exact" })
    .eq("user_id", user.id);

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(error.message);
  }

  const totalCount = count ?? 0;

  return {
    data: (data as UploadSummary[]) ?? [],
    count: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
}

export async function fetchUpload(id: number): Promise<UploadSummary> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("upload_summary")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as UploadSummary;
}

export async function fetchUploadErrors(
  uploadId: number,
): Promise<UploadError[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // First verify the upload belongs to the user
  const { data: upload, error: uploadError } = await supabase
    .from("uploads")
    .select("user_id")
    .eq("id", uploadId)
    .eq("user_id", user.id)
    .single();

  if (uploadError || !upload) {
    throw new Error("Upload not found or access denied");
  }

  const { data, error } = await supabase
    .from("upload_errors")
    .select("*")
    .eq("upload_id", uploadId)
    .order("row_number", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data as UploadError[]) ?? [];
}

export async function createUpload(
  input: CreateUploadInput,
  userId: string,
): Promise<UploadSummary> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("uploads")
    .insert({
      ...input,
      user_id: userId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return fetchUpload(data.id);
}

export async function uploadCsvFile(
  file: File,
  userId: string,
): Promise<{ path: string; uploadId: number }> {
  const supabase = createClient();

  const timestamp = Date.now();
  const filePath = `${userId}/${timestamp}-${file.name}`;

  const { error: storageError } = await supabase.storage
    .from("csv-uploads")
    .upload(filePath, file);

  if (storageError) {
    throw new Error(storageError.message);
  }

  const { data: uploadData, error: uploadError } = await supabase
    .from("uploads")
    .insert({
      user_id: userId,
      filename: file.name,
      file_path: filePath,
      file_size_bytes: file.size,
      status: "pending",
    })
    .select()
    .single();

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  return { path: filePath, uploadId: uploadData.id };
}

export async function processUpload(
  uploadId: number,
  userId: string,
): Promise<void> {
  const supabase = createClient();

  const { error } = await supabase.functions.invoke("process-csv-upload", {
    body: { upload_id: uploadId.toString(), user_id: userId },
  });

  if (error) {
    throw new Error(error.message);
  }
}
