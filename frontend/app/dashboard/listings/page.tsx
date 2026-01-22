"use client";

import React, { useState } from "react";
import InventoryView from "@/components/InventoryView";
import {
  useInventoryItems,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
  useBulkUpdateInventoryStatus,
} from "@/features/inventory";
import type { InventoryItem, InventoryFilters } from "@/features/inventory";
import { toast } from "sonner";

type StatusType = "pending" | "priced" | "listed" | "unlisted" | "sold";

export default function ListingsPage() {
  const [filters, setFilters] = useState<InventoryFilters>({
    status: "listed",
    page: 1,
    limit: 10,
  });

  const {
    data: inventoryData,
    isLoading,
    refetch,
  } = useInventoryItems(filters);
  const updateItem = useUpdateInventoryItem();
  const deleteItem = useDeleteInventoryItem();
  const bulkUpdateStatus = useBulkUpdateInventoryStatus();

  const inventory = inventoryData?.data ?? [];
  const totalCount = inventoryData?.count ?? 0;
  const currentPage = inventoryData?.page ?? 1;
  const totalPages = inventoryData?.totalPages ?? 1;

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleFiltersChange = (newFilters: InventoryFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

  const handleUpdateItem = async (updatedItem: InventoryItem) => {
    try {
      await updateItem.mutateAsync({
        id: updatedItem.id,
        input: {
          title: updatedItem.title,
          brand: updatedItem.brand ?? undefined,
          category: updatedItem.category,
          condition: updatedItem.condition,
          original_price: updatedItem.original_price,
          quantity: updatedItem.quantity,
          resale_price: updatedItem.resale_price ?? undefined,
          is_price_manual: updatedItem.is_price_manual,
          status: updatedItem.status,
        },
      });
      toast.success("Item updated successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to update item");
      console.error(error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await deleteItem.mutateAsync(id);
      toast.success("Item deleted successfully");
      refetch();
    } catch (error) {
      toast.error("Failed to delete item");
      console.error(error);
    }
  };

  const handleBulkStatusUpdate = async (ids: number[], status: StatusType) => {
    try {
      await bulkUpdateStatus.mutateAsync({ ids, status });
      toast.success(`${ids.length} items updated to ${status}`);
      refetch();
    } catch (error) {
      toast.error("Failed to update items");
      console.error(error);
    }
  };

  return (
    <InventoryView
      inventory={inventory}
      isLoading={isLoading}
      totalCount={totalCount}
      currentPage={currentPage}
      totalPages={totalPages}
      limit={filters.limit || 10}
      filters={filters}
      onUpdateItem={handleUpdateItem}
      onDeleteItem={handleDeleteItem}
      onBulkStatusUpdate={handleBulkStatusUpdate}
      onPageChange={handlePageChange}
      onFiltersChange={handleFiltersChange}
    />
  );
}
