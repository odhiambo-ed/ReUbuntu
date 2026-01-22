"use client";

import React from "react";
import DashboardView from "@/components/DashboardView";
import { useDashboardStats } from "@/features/dashboard";
import { useUploads } from "@/features/uploads";
import { DashboardSkeleton } from "@/components/Skeletons";

export default function DashboardPage() {
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
  const { data: uploadsData, isLoading: uploadsLoading } = useUploads({
    page: 1,
    limit: 5,
  });

  const isLoading = statsLoading || uploadsLoading;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const stats = {
    totalItems: dashboardStats?.totalItems ?? 0,
    pendingPrice: dashboardStats?.pendingItems ?? 0,
    listed: dashboardStats?.listedItems ?? 0,
    totalValue: dashboardStats?.totalValue ?? 0,
  };

  const uploads = uploadsData?.data ?? [];

  return <DashboardView stats={stats} uploads={uploads} />;
}
