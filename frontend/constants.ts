import { ConditionType } from "./types";

export const CONDITION_MULTIPLIERS: Record<ConditionType, number> = {
  new: 0.7,
  like_new: 0.6,
  good: 0.5,
  fair: 0.35,
};

export const CATEGORY_MULTIPLIERS: Record<string, number> = {
  Outerwear: 1.1,
  Jackets: 1.05,
  Dresses: 1.0,
  Shoes: 0.95,
  Knitwear: 0.9,
  Bottoms: 0.85,
  Tops: 0.8,
  Activewear: 0.8,
  Accessories: 0.75,
};

export const NAVIGATION_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { id: "inventory", label: "Inventory", icon: "Package" },
  { id: "upload", label: "Upload CSV", icon: "Upload" },
  { id: "analytics", label: "Analytics", icon: "BarChart" },
  { id: "orders", label: "Orders", icon: "ShoppingCart" },
  { id: "settings", label: "Settings", icon: "Settings" },
];
