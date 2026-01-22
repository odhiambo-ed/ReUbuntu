"use client";

import React from "react";
import DashboardView from "@/components/DashboardView";
import { MOCK_UPLOADS, MOCK_INVENTORY } from "@/services/mockData";

export default function DashboardPage() {
  const stats = {
    totalItems: MOCK_INVENTORY.length,
    pendingPrice: MOCK_INVENTORY.filter((i) => i.status === "pending").length,
    listed: MOCK_INVENTORY.filter((i) => i.status === "listed").length,
    totalValue: MOCK_INVENTORY.reduce(
      (acc, i) => acc + (i.resale_price || 0),
      0,
    ),
  };

  return <DashboardView stats={stats} uploads={MOCK_UPLOADS} />;
}
