export interface DashboardStats {
  totalItems: number;
  pendingItems: number;
  pricedItems: number;
  listedItems: number;
  soldItems: number;
  totalValue: number;
  averagePrice: number;
  recentUploads: number;
}

export interface InventoryByCategory {
  category: string;
  count: number;
  totalValue: number;
}

export interface InventoryByCondition {
  condition: string;
  count: number;
}

export interface InventoryByStatus {
  status: string;
  count: number;
}

export interface RecentActivity {
  type: "upload" | "inventory" | "price_update";
  description: string;
  timestamp: string;
}
