export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileInput {
  full_name?: string;
  metadata?: Record<string, unknown>;
}
