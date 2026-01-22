import { inventoryKeys } from "@/features/inventory/keys";

describe("inventoryKeys", () => {
  describe("all", () => {
    it("should return base key", () => {
      expect(inventoryKeys.all).toEqual(["inventory"]);
    });
  });

  describe("lists", () => {
    it("should return lists key", () => {
      expect(inventoryKeys.lists()).toEqual(["inventory", "list"]);
    });
  });

  describe("list", () => {
    it("should return list key with empty filters", () => {
      expect(inventoryKeys.list({})).toEqual(["inventory", "list", {}]);
    });

    it("should return list key with filters", () => {
      const filters = { status: "pending" as const, page: 1 };
      expect(inventoryKeys.list(filters)).toEqual([
        "inventory",
        "list",
        filters,
      ]);
    });
  });

  describe("details", () => {
    it("should return details key", () => {
      expect(inventoryKeys.details()).toEqual(["inventory", "detail"]);
    });
  });

  describe("detail", () => {
    it("should return detail key with id", () => {
      expect(inventoryKeys.detail(123)).toEqual(["inventory", "detail", 123]);
    });
  });

  describe("stats", () => {
    it("should return stats key", () => {
      expect(inventoryKeys.stats()).toEqual(["inventory", "stats"]);
    });
  });
});
