"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardKeys } from "./keys";
import {
  fetchDashboardStats,
  fetchInventoryByCategory,
  fetchInventoryByCondition,
  fetchInventoryByStatus,
} from "./api";

export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: fetchDashboardStats,
  });
}

export function useInventoryByCategory() {
  return useQuery({
    queryKey: dashboardKeys.byCategory(),
    queryFn: fetchInventoryByCategory,
  });
}

export function useInventoryByCondition() {
  return useQuery({
    queryKey: dashboardKeys.byCondition(),
    queryFn: fetchInventoryByCondition,
  });
}

export function useInventoryByStatus() {
  return useQuery({
    queryKey: dashboardKeys.byStatus(),
    queryFn: fetchInventoryByStatus,
  });
}
