import { createClient } from "@/lib/supabase/client";
import type {
  InventoryWithPricing,
  InventoryFilters,
  CreateInventoryItemInput,
  UpdateInventoryItemInput,
  PaginatedInventoryResponse,
} from "./types";

const DEFAULT_PAGE_SIZE = 20;

export async function fetchInventoryItems(
  filters: InventoryFilters = {},
): Promise<PaginatedInventoryResponse> {
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
    .from("inventory_with_pricing")
    .select("*", { count: "exact" })
    .eq("user_id", user.id);

  if (filters.status) {
    query = query.eq("status", filters.status);
  }
  if (filters.category) {
    query = query.eq("category", filters.category);
  }
  if (filters.condition) {
    query = query.eq("condition", filters.condition);
  }
  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,sku.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`,
    );
  }

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    throw new Error(error.message);
  }

  const totalCount = count ?? 0;

  return {
    data: (data as InventoryWithPricing[]) ?? [],
    count: totalCount,
    page,
    limit,
    totalPages: Math.ceil(totalCount / limit),
  };
}

export async function fetchInventoryItem(
  id: number,
): Promise<InventoryWithPricing> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("inventory_with_pricing")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as InventoryWithPricing;
}

export async function createInventoryItem(
  input: CreateInventoryItemInput,
  userId: string,
): Promise<InventoryWithPricing> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("inventory_items")
    .insert({
      ...input,
      user_id: userId,
      currency: input.currency ?? "ZAR",
      quantity: input.quantity ?? 1,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return fetchInventoryItem(data.id);
}

export async function updateInventoryItem(
  id: number,
  input: UpdateInventoryItemInput,
): Promise<InventoryWithPricing> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("inventory_items")
    .update({ ...input, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  return fetchInventoryItem(id);
}

export async function deleteInventoryItem(id: number): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("inventory_items")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function bulkUpdateInventoryStatus(
  ids: number[],
  status: string,
): Promise<void> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("inventory_items")
    .update({ status, updated_at: new Date().toISOString() })
    .in("id", ids)
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }
}
