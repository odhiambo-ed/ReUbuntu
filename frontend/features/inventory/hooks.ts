"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryKeys } from "./keys";
import {
  fetchInventoryItems,
  fetchInventoryItem,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  bulkUpdateInventoryStatus,
} from "./api";
import type {
  InventoryFilters,
  CreateInventoryItemInput,
  UpdateInventoryItemInput,
} from "./types";

export function useInventoryItems(filters: InventoryFilters = {}) {
  return useQuery({
    queryKey: inventoryKeys.list(filters),
    queryFn: () => fetchInventoryItems(filters),
  });
}

export function useInventoryItem(id: number) {
  return useQuery({
    queryKey: inventoryKeys.detail(id),
    queryFn: () => fetchInventoryItem(id),
    enabled: !!id,
  });
}

export function useCreateInventoryItem(userId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateInventoryItemInput) =>
      createInventoryItem(input, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
}

export function useUpdateInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
    }: {
      id: number;
      input: UpdateInventoryItemInput;
    }) => updateInventoryItem(id, input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
      queryClient.setQueryData(inventoryKeys.detail(data.id), data);
    },
  });
}

export function useDeleteInventoryItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteInventoryItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.lists() });
    },
  });
}

export function useBulkUpdateInventoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: string }) =>
      bulkUpdateInventoryStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inventoryKeys.all });
    },
  });
}
