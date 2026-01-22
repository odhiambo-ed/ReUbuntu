export type ConditionType = "new" | "like_new" | "good" | "fair";
export type StatusType = "pending" | "priced" | "listed" | "unlisted" | "sold";
export type UploadStatus = "pending" | "processing" | "completed" | "failed";

export interface InventoryItem {
  id: string;
  user_id: string;
  upload_id?: string;
  merchant_id: string;
  sku: string;
  title: string;
  brand?: string;
  category: string;
  condition: ConditionType;
  original_price: number;
  currency: string;
  quantity: number;
  resale_price?: number;
  is_price_manual: boolean;
  status: StatusType;
  listed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Upload {
  id: string;
  user_id: string;
  filename: string;
  status: UploadStatus;
  total_rows: number;
  success_count: number;
  error_count: number;
  created_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string;
  company_name: string;
}

export interface Multiplier {
  key: string;
  multiplier: number;
  description?: string;
}
