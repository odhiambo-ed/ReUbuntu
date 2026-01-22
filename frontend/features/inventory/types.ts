export type ConditionType = "new" | "like_new" | "good" | "fair";
export type StatusType = "pending" | "priced" | "listed" | "unlisted" | "sold";

export interface InventoryItem {
  id: number;
  user_id: string;
  upload_id: number | null;
  merchant_id: string;
  sku: string;
  title: string;
  brand: string | null;
  category: string;
  condition: ConditionType;
  original_price: number;
  currency: string;
  quantity: number;
  resale_price: number | null;
  is_price_manual: boolean;
  status: StatusType;
  listed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface InventoryWithPricing extends InventoryItem {
  condition_multiplier: number | null;
  category_multiplier: number | null;
  calculated_price: number | null;
  price_difference: number | null;
  discount_percentage: number | null;
}

export interface InventoryFilters {
  status?: StatusType;
  category?: string;
  condition?: ConditionType;
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateInventoryItemInput {
  merchant_id: string;
  sku: string;
  title: string;
  brand?: string;
  category: string;
  condition: ConditionType;
  original_price: number;
  currency?: string;
  quantity?: number;
}

export interface UpdateInventoryItemInput {
  title?: string;
  brand?: string;
  category?: string;
  condition?: ConditionType;
  original_price?: number;
  quantity?: number;
  resale_price?: number;
  is_price_manual?: boolean;
  status?: StatusType;
}

export interface PaginatedInventoryResponse {
  data: InventoryWithPricing[];
  count: number;
  page: number;
  limit: number;
  totalPages: number;
}
