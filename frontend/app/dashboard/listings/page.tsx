"use client";

import React, { useState } from "react";
import InventoryView from "@/components/InventoryView";
import { MOCK_INVENTORY } from "@/services/mockData";
import { InventoryItem, StatusType } from "@/types";

export default function ListingsPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(
    MOCK_INVENTORY.filter((i) => i.status === "listed"),
  );

  const handleUpdateItem = (updatedItem: InventoryItem) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
    );
  };

  const handleDeleteItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  const handleBulkStatusUpdate = (ids: string[], status: StatusType) => {
    setInventory((prev) =>
      prev.map((item) => (ids.includes(item.id) ? { ...item, status } : item)),
    );
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
