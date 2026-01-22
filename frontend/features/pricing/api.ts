import { createClient } from "@/lib/supabase/client";
import type {
  ConditionMultiplier,
  CategoryMultiplier,
  PricingConfig,
  CalculatePriceInput,
  CalculatedPrice,
} from "./types";

export async function fetchConditionMultipliers(): Promise<
  ConditionMultiplier[]
> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("condition_multipliers")
    .select("*")
    .order("multiplier", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as ConditionMultiplier[]) ?? [];
}

export async function fetchCategoryMultipliers(): Promise<
  CategoryMultiplier[]
> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("category_multipliers")
    .select("*")
    .order("multiplier", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data as CategoryMultiplier[]) ?? [];
}

export async function fetchPricingConfig(): Promise<PricingConfig> {
  const [conditionMultipliers, categoryMultipliers] = await Promise.all([
    fetchConditionMultipliers(),
    fetchCategoryMultipliers(),
  ]);

  return {
    conditionMultipliers,
    categoryMultipliers,
  };
}

export function calculateResalePrice(
  input: CalculatePriceInput,
  config: PricingConfig,
): CalculatedPrice {
  const conditionMult =
    config.conditionMultipliers.find((c) => c.condition === input.condition)
      ?.multiplier ?? 0.5;

  const categoryMult =
    config.categoryMultipliers.find((c) => c.category === input.category)
      ?.multiplier ?? 1.0;

  const resalePrice =
    Math.round(input.originalPrice * conditionMult * categoryMult * 100) / 100;

  const discountPercentage =
    Math.round(
      ((input.originalPrice - resalePrice) / input.originalPrice) * 100 * 10,
    ) / 10;

  return {
    originalPrice: input.originalPrice,
    resalePrice,
    conditionMultiplier: conditionMult,
    categoryMultiplier: categoryMult,
    discountPercentage,
  };
}
