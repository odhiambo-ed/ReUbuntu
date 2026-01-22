import { CONDITION_MULTIPLIERS, CATEGORY_MULTIPLIERS } from "../constants";
import { ConditionType } from "../types";

export const calculateResalePrice = (
  originalPrice: number,
  condition: ConditionType,
  category: string,
): number => {
  const conditionMultiplier = CONDITION_MULTIPLIERS[condition] || 0.5;
  const categoryMultiplier = CATEGORY_MULTIPLIERS[category] || 1.0;
  return Math.round(originalPrice * conditionMultiplier * categoryMultiplier);
};
