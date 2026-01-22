import type { InventoryFilters } from "./types";

export const inventoryKeys = {
  all: ["inventory"] as const,
  lists: () => [...inventoryKeys.all, "list"] as const,
  list: (filters: InventoryFilters) =>
    [...inventoryKeys.lists(), filters] as const,
  details: () => [...inventoryKeys.all, "detail"] as const,
  detail: (id: number) => [...inventoryKeys.details(), id] as const,
  stats: () => [...inventoryKeys.all, "stats"] as const,
};
