export interface CSVRow {
  merchant_id: string;
  sku: string;
  title: string;
  brand?: string;
  category: string;
  condition: string;
  original_price: string;
  currency: string;
  quantity: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{ field: string; type: string; message: string }>;
}

export const VALID_CONDITIONS = ["new", "like_new", "like new", "good", "fair"];

export const VALID_CATEGORIES = [
  "tops",
  "bottoms",
  "outerwear",
  "jackets",
  "dresses",
  "knitwear",
  "shoes",
  "accessories",
  "activewear",
];

export const CATEGORY_MAPPING: Record<string, string> = {
  tops: "Tops",
  bottoms: "Bottoms",
  outerwear: "Outerwear",
  jackets: "Jackets",
  dresses: "Dresses",
  knitwear: "Knitwear",
  shoes: "Shoes",
  accessories: "Accessories",
  activewear: "Activewear",
};

export function validateRow(row: CSVRow, _rowNumber: number): ValidationResult {
  const errors: Array<{ field: string; type: string; message: string }> = [];

  // Required fields
  if (!row.merchant_id?.trim()) {
    errors.push({
      field: "merchant_id",
      type: "missing_required",
      message: "Merchant ID is required",
    });
  }
  if (!row.sku?.trim()) {
    errors.push({
      field: "sku",
      type: "missing_required",
      message: "SKU is required",
    });
  }
  if (!row.title?.trim()) {
    errors.push({
      field: "title",
      type: "missing_required",
      message: "Title is required",
    });
  }
  if (!row.category?.trim()) {
    errors.push({
      field: "category",
      type: "missing_required",
      message: "Category is required",
    });
  }
  if (!row.condition?.trim()) {
    errors.push({
      field: "condition",
      type: "missing_required",
      message: "Condition is required",
    });
  }
  if (!row.original_price?.trim()) {
    errors.push({
      field: "original_price",
      type: "missing_required",
      message: "Original price is required",
    });
  }

  // Validate condition value
  if (
    row.condition &&
    !VALID_CONDITIONS.includes(row.condition.toLowerCase().trim())
  ) {
    errors.push({
      field: "condition",
      type: "invalid_value",
      message: `Condition must be one of: new, like_new, good, fair`,
    });
  }

  // Validate category value
  if (
    row.category &&
    !VALID_CATEGORIES.includes(row.category.toLowerCase().trim())
  ) {
    errors.push({
      field: "category",
      type: "invalid_value",
      message: `Category must be one of: ${VALID_CATEGORIES.join(", ")}`,
    });
  }

  // Validate price is numeric and positive
  const price = parseFloat(row.original_price);
  if (row.original_price && (isNaN(price) || price <= 0)) {
    errors.push({
      field: "original_price",
      type: "invalid_format",
      message: "Original price must be a positive number",
    });
  }

  // Validate quantity is positive integer
  const qty = parseInt(row.quantity);
  if (row.quantity && (isNaN(qty) || qty < 1)) {
    errors.push({
      field: "quantity",
      type: "invalid_format",
      message: "Quantity must be a positive integer",
    });
  }

  return { isValid: errors.length === 0, errors };
}

export function normalizeCategory(category: string): string {
  return CATEGORY_MAPPING[category.toLowerCase().trim()] || category;
}

export function normalizeCondition(condition: string): string {
  const normalized = condition.toLowerCase().trim().replace(/\s+/g, "_");
  return ["new", "like_new", "good", "fair"].includes(normalized)
    ? normalized
    : "good";
}
