"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { pricingKeys } from "./keys";
import {
  fetchConditionMultipliers,
  fetchCategoryMultipliers,
  fetchPricingConfig,
  calculateResalePrice,
} from "./api";
import type { CalculatePriceInput } from "./types";

export function useConditionMultipliers() {
  return useQuery({
    queryKey: pricingKeys.conditionMultipliers(),
    queryFn: fetchConditionMultipliers,
    staleTime: 1000 * 60 * 60, // 1 hour - these rarely change
  });
}

export function useCategoryMultipliers() {
  return useQuery({
    queryKey: pricingKeys.categoryMultipliers(),
    queryFn: fetchCategoryMultipliers,
    staleTime: 1000 * 60 * 60, // 1 hour - these rarely change
  });
}

export function usePricingConfig() {
  return useQuery({
    queryKey: pricingKeys.config(),
    queryFn: fetchPricingConfig,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useCalculatePrice(input: CalculatePriceInput | null) {
  const { data: config } = usePricingConfig();

  return useMemo(() => {
    if (!input || !config) return null;
    return calculateResalePrice(input, config);
  }, [input, config]);
}
