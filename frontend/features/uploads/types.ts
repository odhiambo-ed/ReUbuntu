export type UploadStatus = "pending" | "processing" | "completed" | "failed";

export type UploadErrorType =
  | "missing_required"
  | "invalid_format"
  | "invalid_value"
  | "duplicate"
  | "out_of_range";

export interface Upload {
  id: number;
  user_id: string;
  filename: string;
  file_path: string | null;
  file_size_bytes: number | null;
  status: UploadStatus;
  total_rows: number;
  success_count: number;
  error_count: number;
  processing_started_at: string | null;
  processing_completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface UploadSummary extends Upload {
  success_rate: number;
  error_details_count: number;
}

export interface UploadError {
  id: number;
  upload_id: number;
  row_number: number;
  field_name: string | null;
  error_type: UploadErrorType;
  error_message: string;
  raw_data: Record<string, unknown> | null;
  created_at: string;
}

export interface UploadFilters {
  status?: UploadStatus;
  page?: number;
  limit?: number;
}

export interface CreateUploadInput {
  filename: string;
  file_path?: string;
  file_size_bytes?: number;
}

export interface PaginatedUploadResponse {
  data: UploadSummary[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}
