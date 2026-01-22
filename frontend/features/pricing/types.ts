export interface ConditionMultiplier {
  condition: string;
  multiplier: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface CategoryMultiplier {
  category: string;
  multiplier: number;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface PricingConfig {
  conditionMultipliers: ConditionMultiplier[];
  categoryMultipliers: CategoryMultiplier[];
}

export interface CalculatePriceInput {
  originalPrice: number;
  condition: string;
  category: string;
}

export interface CalculatedPrice {
  originalPrice: number;
  resalePrice: number;
  conditionMultiplier: number;
  categoryMultiplier: number;
  discountPercentage: number;
}
