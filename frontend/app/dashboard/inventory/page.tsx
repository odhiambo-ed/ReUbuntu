"use client";

import React from "react";
import InventoryView from "@/components/InventoryView";
import {
  useInventoryItems,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
  useBulkUpdateInventoryStatus,
} from "@/features/inventory";
import type { InventoryItem } from "@/features/inventory";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type StatusType = "pending" | "priced" | "listed" | "unlisted" | "sold";

export default function InventoryPage() {
  const { data: inventoryData, isLoading } = useInventoryItems({
    page: 1,
    limit: 100,
  });
  const updateItem = useUpdateInventoryItem();
  const deleteItem = useDeleteInventoryItem();
  const bulkUpdateStatus = useBulkUpdateInventoryStatus();

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
      </div>
    );
  }

  const inventory = inventoryData?.data ?? [];

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
    } catch (error) {
      toast.error("Failed to update item");
      console.error(error);
    }
  };

  const handleDeleteItem = async (id: number) => {
    try {
      await deleteItem.mutateAsync(id);
      toast.success("Item deleted successfully");
    } catch (error) {
      toast.error("Failed to delete item");
      console.error(error);
    }
  };

  const handleBulkStatusUpdate = async (ids: number[], status: StatusType) => {
    try {
      await bulkUpdateStatus.mutateAsync({ ids, status });
      toast.success(`${ids.length} items updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update items");
      console.error(error);
    }
  };

  return (
    <InventoryView
      inventory={inventory}
      onUpdateItem={handleUpdateItem}
      onDeleteItem={handleDeleteItem}
      onBulkStatusUpdate={handleBulkStatusUpdate}
    />
  );
}
