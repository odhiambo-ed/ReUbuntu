import { calculateResalePrice } from "@/features/pricing/api";
import type {
  PricingConfig,
  CalculatePriceInput,
} from "@/features/pricing/types";

describe("calculateResalePrice", () => {
  const mockPricingConfig: PricingConfig = {
    conditionMultipliers: [
      {
        condition: "new",
        multiplier: 0.7,
        description: "Brand new",
        created_at: "",
        updated_at: "",
      },
      {
        condition: "like_new",
        multiplier: 0.6,
        description: "Like new",
        created_at: "",
        updated_at: "",
      },
      {
        condition: "good",
        multiplier: 0.5,
        description: "Good",
        created_at: "",
        updated_at: "",
      },
      {
        condition: "fair",
        multiplier: 0.35,
        description: "Fair",
        created_at: "",
        updated_at: "",
      },
    ],
    categoryMultipliers: [
      {
        category: "Outerwear",
        multiplier: 1.1,
        description: "Coats",
        created_at: "",
        updated_at: "",
      },
      {
        category: "Dresses",
        multiplier: 1.0,
        description: "Dresses",
        created_at: "",
        updated_at: "",
      },
      {
        category: "Tops",
        multiplier: 0.8,
        description: "Tops",
        created_at: "",
        updated_at: "",
      },
    ],
  };

  it("should calculate resale price with matching condition and category", () => {
    const input: CalculatePriceInput = {
      originalPrice: 100,
      condition: "new",
      category: "Outerwear",
    };

    const result = calculateResalePrice(input, mockPricingConfig);

    expect(result.originalPrice).toBe(100);
    expect(result.conditionMultiplier).toBe(0.7);
    expect(result.categoryMultiplier).toBe(1.1);
    expect(result.resalePrice).toBe(77); // 100 * 0.7 * 1.1
    expect(result.discountPercentage).toBe(23);
  });

  it("should use default multipliers for unknown condition/category", () => {
    const input: CalculatePriceInput = {
      originalPrice: 200,
      condition: "unknown",
      category: "Unknown Category",
    };

    const result = calculateResalePrice(input, mockPricingConfig);

    expect(result.conditionMultiplier).toBe(0.5); // default
    expect(result.categoryMultiplier).toBe(1.0); // default
    expect(result.resalePrice).toBe(100); // 200 * 0.5 * 1.0
    expect(result.discountPercentage).toBe(50);
  });

  it("should calculate correctly for like_new condition", () => {
    const input: CalculatePriceInput = {
      originalPrice: 150,
      condition: "like_new",
      category: "Dresses",
    };

    const result = calculateResalePrice(input, mockPricingConfig);

    expect(result.resalePrice).toBe(90); // 150 * 0.6 * 1.0
    expect(result.discountPercentage).toBe(40);
  });

  it("should handle decimal prices correctly", () => {
    const input: CalculatePriceInput = {
      originalPrice: 99.99,
      condition: "good",
      category: "Tops",
    };

    const result = calculateResalePrice(input, mockPricingConfig);

    // 99.99 * 0.5 * 0.8 = 39.996 -> rounded to 40.00
    expect(result.resalePrice).toBe(40);
  });
});
