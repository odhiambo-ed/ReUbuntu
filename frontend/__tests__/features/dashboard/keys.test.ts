import { dashboardKeys } from "@/features/dashboard/keys";

describe("dashboardKeys", () => {
  describe("all", () => {
    it("should return base key", () => {
      expect(dashboardKeys.all).toEqual(["dashboard"]);
    });
  });

  describe("stats", () => {
    it("should return stats key", () => {
      expect(dashboardKeys.stats()).toEqual(["dashboard", "stats"]);
    });
  });

  describe("byCategory", () => {
    it("should return by-category key", () => {
      expect(dashboardKeys.byCategory()).toEqual(["dashboard", "by-category"]);
    });
  });

  describe("byCondition", () => {
    it("should return by-condition key", () => {
      expect(dashboardKeys.byCondition()).toEqual([
        "dashboard",
        "by-condition",
      ]);
    });
  });

  describe("byStatus", () => {
    it("should return by-status key", () => {
      expect(dashboardKeys.byStatus()).toEqual(["dashboard", "by-status"]);
    });
  });

  describe("recentActivity", () => {
    it("should return recent-activity key", () => {
      expect(dashboardKeys.recentActivity()).toEqual([
        "dashboard",
        "recent-activity",
      ]);
    });
  });
});
