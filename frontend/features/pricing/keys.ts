export const pricingKeys = {
  all: ["pricing"] as const,
  conditionMultipliers: () =>
    [...pricingKeys.all, "condition-multipliers"] as const,
  categoryMultipliers: () =>
    [...pricingKeys.all, "category-multipliers"] as const,
  config: () => [...pricingKeys.all, "config"] as const,
};
