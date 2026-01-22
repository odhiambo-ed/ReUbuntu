export const dashboardKeys = {
  all: ["dashboard"] as const,
  stats: () => [...dashboardKeys.all, "stats"] as const,
  byCategory: () => [...dashboardKeys.all, "by-category"] as const,
  byCondition: () => [...dashboardKeys.all, "by-condition"] as const,
  byStatus: () => [...dashboardKeys.all, "by-status"] as const,
  recentActivity: () => [...dashboardKeys.all, "recent-activity"] as const,
};
