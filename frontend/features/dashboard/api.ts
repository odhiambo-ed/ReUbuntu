import { createClient } from "@/lib/supabase/client";
import type {
  DashboardStats,
  InventoryByCategory,
  InventoryByCondition,
  InventoryByStatus,
} from "./types";

interface InventoryStatsRow {
  status: string;
  resale_price: number | null;
  quantity: number;
}

interface CategoryRow {
  category: string;
  resale_price: number | null;
  quantity: number;
}

interface ConditionRow {
  condition: string;
}

interface StatusRow {
  status: string;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Fetch inventory stats
  const { data: inventoryData, error: inventoryError } = await supabase
    .from("inventory_with_pricing")
    .select("status, resale_price, quantity")
    .eq("user_id", user.id);

  if (inventoryError) {
    throw new Error(inventoryError.message);
  }

  const items = (inventoryData ?? []) as InventoryStatsRow[];
  const totalItems = items.length;
  const pendingItems = items.filter(
    (i: InventoryStatsRow) => i.status === "pending",
  ).length;
  const pricedItems = items.filter(
    (i: InventoryStatsRow) => i.status === "priced",
  ).length;
  const listedItems = items.filter(
    (i: InventoryStatsRow) => i.status === "listed",
  ).length;
  const soldItems = items.filter(
    (i: InventoryStatsRow) => i.status === "sold",
  ).length;

  const itemsWithPrice = items.filter(
    (i: InventoryStatsRow) => i.resale_price != null,
  );
  const totalValue = itemsWithPrice.reduce(
    (sum: number, i: InventoryStatsRow) =>
      sum + (i.resale_price ?? 0) * i.quantity,
    0,
  );
  const averagePrice =
    itemsWithPrice.length > 0 ? totalValue / itemsWithPrice.length : 0;

  // Fetch recent uploads count (last 7 days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: recentUploads } = await supabase
    .from("uploads")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", sevenDaysAgo.toISOString());

  return {
    totalItems,
    pendingItems,
    pricedItems,
    listedItems,
    soldItems,
    totalValue: Math.round(totalValue * 100) / 100,
    averagePrice: Math.round(averagePrice * 100) / 100,
    recentUploads: recentUploads ?? 0,
  };
}

export async function fetchInventoryByCategory(): Promise<
  InventoryByCategory[]
> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("inventory_with_pricing")
    .select("category, resale_price, quantity")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  const items = (data ?? []) as CategoryRow[];
  const categoryMap = new Map<string, { count: number; totalValue: number }>();

  for (const item of items) {
    const existing = categoryMap.get(item.category) ?? {
      count: 0,
      totalValue: 0,
    };
    categoryMap.set(item.category, {
      count: existing.count + 1,
      totalValue:
        existing.totalValue + (item.resale_price ?? 0) * item.quantity,
    });
  }

  return Array.from(categoryMap.entries())
    .map(([category, stats]) => ({
      category,
      count: stats.count,
      totalValue: Math.round(stats.totalValue * 100) / 100,
    }))
    .sort((a, b) => b.count - a.count);
}

export async function fetchInventoryByCondition(): Promise<
  InventoryByCondition[]
> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("inventory_with_pricing")
    .select("condition")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  const items = (data ?? []) as ConditionRow[];
  const conditionMap = new Map<string, number>();

  for (const item of items) {
    const count = conditionMap.get(item.condition) ?? 0;
    conditionMap.set(item.condition, count + 1);
  }

  return Array.from(conditionMap.entries())
    .map(([condition, count]) => ({ condition, count }))
    .sort((a, b) => b.count - a.count);
}

export async function fetchInventoryByStatus(): Promise<InventoryByStatus[]> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("inventory_with_pricing")
    .select("status")
    .eq("user_id", user.id);

  if (error) {
    throw new Error(error.message);
  }

  const items = (data ?? []) as StatusRow[];
  const statusMap = new Map<string, number>();

  for (const item of items) {
    const count = statusMap.get(item.status) ?? 0;
    statusMap.set(item.status, count + 1);
  }

  return Array.from(statusMap.entries())
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);
}
