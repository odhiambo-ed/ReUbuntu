import { pricingKeys } from "@/features/pricing/keys";

describe("pricingKeys", () => {
  describe("all", () => {
    it("should return base key", () => {
      expect(pricingKeys.all).toEqual(["pricing"]);
    });
  });

  describe("conditionMultipliers", () => {
    it("should return condition multipliers key", () => {
      expect(pricingKeys.conditionMultipliers()).toEqual([
        "pricing",
        "condition-multipliers",
      ]);
    });
  });

  describe("categoryMultipliers", () => {
    it("should return category multipliers key", () => {
      expect(pricingKeys.categoryMultipliers()).toEqual([
        "pricing",
        "category-multipliers",
      ]);
    });
  });

  describe("config", () => {
    it("should return config key", () => {
      expect(pricingKeys.config()).toEqual(["pricing", "config"]);
    });
  });
});
