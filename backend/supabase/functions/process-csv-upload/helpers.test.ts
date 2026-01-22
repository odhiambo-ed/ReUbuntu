import { assertEquals } from "std/testing/asserts";

import {
  validateRow,
  normalizeCategory,
  normalizeCondition,
  type CSVRow,
  VALID_CONDITIONS,
  VALID_CATEGORIES,
} from "./helpers.ts";

// Test Fixtures

function createValidRow(overrides: Partial<CSVRow> = {}): CSVRow {
  return {
    merchant_id: "MERCH001",
    sku: "SKU-12345",
    title: "Test Product",
    brand: "Test Brand",
    category: "Tops",
    condition: "new",
    original_price: "100.00",
    currency: "ZAR",
    quantity: "5",
    ...overrides,
  };
}

// validateRow Tests

Deno.test("validateRow - valid row returns isValid true", () => {
  const row = createValidRow();
  const result = validateRow(row, 1);

  assertEquals(result.isValid, true);
  assertEquals(result.errors.length, 0);
});

Deno.test("validateRow - missing merchant_id returns error", () => {
  const row = createValidRow({ merchant_id: "" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, false);
  assertEquals(result.errors.length, 1);
  assertEquals(result.errors[0].field, "merchant_id");
  assertEquals(result.errors[0].type, "missing_required");
});

Deno.test("validateRow - missing sku returns error", () => {
  const row = createValidRow({ sku: "" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, false);
  assertEquals(result.errors[0].field, "sku");
  assertEquals(result.errors[0].type, "missing_required");
});

Deno.test("validateRow - missing title returns error", () => {
  const row = createValidRow({ title: "   " });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, false);
  assertEquals(result.errors[0].field, "title");
  assertEquals(result.errors[0].type, "missing_required");
});

Deno.test("validateRow - missing category returns error", () => {
  const row = createValidRow({ category: "" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, false);
  const categoryError = result.errors.find((e) => e.field === "category");
  assertEquals(categoryError?.type, "missing_required");
});

Deno.test("validateRow - missing condition returns error", () => {
  const row = createValidRow({ condition: "" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, false);
  const conditionError = result.errors.find((e) => e.field === "condition");
  assertEquals(conditionError?.type, "missing_required");
});

Deno.test("validateRow - missing original_price returns error", () => {
  const row = createValidRow({ original_price: "" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, false);
  const priceError = result.errors.find((e) => e.field === "original_price");
  assertEquals(priceError?.type, "missing_required");
});

Deno.test("validateRow - invalid condition value returns error", () => {
  const row = createValidRow({ condition: "excellent" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, false);
  const conditionError = result.errors.find(
    (e) => e.field === "condition" && e.type === "invalid_value",
  );
  assertEquals(conditionError?.type, "invalid_value");
});

Deno.test("validateRow - invalid category value returns error", () => {
  const row = createValidRow({ category: "Electronics" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, false);
  const categoryError = result.errors.find(
    (e) => e.field === "category" && e.type === "invalid_value",
  );
  assertEquals(categoryError?.type, "invalid_value");
});

Deno.test("validateRow - negative price returns error", () => {
  const row = createValidRow({ original_price: "-50.00" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, false);
  const priceError = result.errors.find((e) => e.field === "original_price");
  assertEquals(priceError?.type, "invalid_format");
  assertEquals(priceError?.message, "Original price must be a positive number");
});

Deno.test("validateRow - zero price returns error", () => {
  const row = createValidRow({ original_price: "0" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, false);
  const priceError = result.errors.find((e) => e.field === "original_price");
  assertEquals(priceError?.type, "invalid_format");
});

Deno.test("validateRow - non-numeric price returns error", () => {
  const row = createValidRow({ original_price: "abc" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, false);
  const priceError = result.errors.find((e) => e.field === "original_price");
  assertEquals(priceError?.type, "invalid_format");
});

Deno.test("validateRow - zero quantity returns error", () => {
  const row = createValidRow({ quantity: "0" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, false);
  const qtyError = result.errors.find((e) => e.field === "quantity");
  assertEquals(qtyError?.type, "invalid_format");
  assertEquals(qtyError?.message, "Quantity must be a positive integer");
});

Deno.test("validateRow - negative quantity returns error", () => {
  const row = createValidRow({ quantity: "-1" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, false);
  const qtyError = result.errors.find((e) => e.field === "quantity");
  assertEquals(qtyError?.type, "invalid_format");
});

Deno.test("validateRow - non-numeric quantity returns error", () => {
  const row = createValidRow({ quantity: "five" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, false);
  const qtyError = result.errors.find((e) => e.field === "quantity");
  assertEquals(qtyError?.type, "invalid_format");
});

Deno.test("validateRow - multiple errors for multiple invalid fields", () => {
  const row = createValidRow({
    merchant_id: "",
    sku: "",
    original_price: "-10",
  });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, false);
  assertEquals(result.errors.length >= 3, true);
});

Deno.test("validateRow - accepts all valid conditions", () => {
  for (const condition of VALID_CONDITIONS) {
    const row = createValidRow({ condition });
    const result = validateRow(row, 1);

    assertEquals(
      result.errors.filter((e) => e.field === "condition").length,
      0,
      `Condition "${condition}" should be valid`,
    );
  }
});

Deno.test(
  "validateRow - accepts all valid categories (case insensitive)",
  () => {
    for (const category of VALID_CATEGORIES) {
      const row = createValidRow({ category });
      const result = validateRow(row, 1);

      assertEquals(
        result.errors.filter((e) => e.field === "category").length,
        0,
        `Category "${category}" should be valid`,
      );
    }
  },
);

Deno.test("validateRow - handles whitespace in values", () => {
  const row = createValidRow({
    merchant_id: "  MERCH001  ",
    sku: "  SKU-123  ",
    condition: "  new  ",
    category: "  tops  ",
  });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, true);
});

Deno.test("validateRow - brand is optional", () => {
  const row = createValidRow({ brand: undefined });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, true);
});

// normalizeCategory Tests

Deno.test("normalizeCategory - lowercase input returns proper case", () => {
  assertEquals(normalizeCategory("tops"), "Tops");
  assertEquals(normalizeCategory("bottoms"), "Bottoms");
  assertEquals(normalizeCategory("outerwear"), "Outerwear");
  assertEquals(normalizeCategory("jackets"), "Jackets");
  assertEquals(normalizeCategory("dresses"), "Dresses");
  assertEquals(normalizeCategory("knitwear"), "Knitwear");
  assertEquals(normalizeCategory("shoes"), "Shoes");
  assertEquals(normalizeCategory("accessories"), "Accessories");
  assertEquals(normalizeCategory("activewear"), "Activewear");
});

Deno.test("normalizeCategory - uppercase input returns proper case", () => {
  assertEquals(normalizeCategory("TOPS"), "Tops");
  assertEquals(normalizeCategory("BOTTOMS"), "Bottoms");
});

Deno.test("normalizeCategory - mixed case input returns proper case", () => {
  assertEquals(normalizeCategory("ToPs"), "Tops");
  assertEquals(normalizeCategory("BoTtOmS"), "Bottoms");
});

Deno.test("normalizeCategory - handles whitespace", () => {
  assertEquals(normalizeCategory("  tops  "), "Tops");
  assertEquals(normalizeCategory("  bottoms  "), "Bottoms");
});

Deno.test("normalizeCategory - unknown category returns original value", () => {
  assertEquals(normalizeCategory("Unknown"), "Unknown");
  assertEquals(normalizeCategory("Electronics"), "Electronics");
});

// normalizeCondition Tests

Deno.test(
  "normalizeCondition - valid conditions return normalized value",
  () => {
    assertEquals(normalizeCondition("new"), "new");
    assertEquals(normalizeCondition("like_new"), "like_new");
    assertEquals(normalizeCondition("good"), "good");
    assertEquals(normalizeCondition("fair"), "fair");
  },
);

Deno.test(
  "normalizeCondition - 'like new' with space returns 'like_new'",
  () => {
    assertEquals(normalizeCondition("like new"), "like_new");
  },
);

Deno.test("normalizeCondition - handles uppercase", () => {
  assertEquals(normalizeCondition("NEW"), "new");
  assertEquals(normalizeCondition("LIKE_NEW"), "like_new");
  assertEquals(normalizeCondition("GOOD"), "good");
  assertEquals(normalizeCondition("FAIR"), "fair");
});

Deno.test("normalizeCondition - handles whitespace", () => {
  assertEquals(normalizeCondition("  new  "), "new");
  assertEquals(normalizeCondition("  like new  "), "like_new");
});

Deno.test(
  "normalizeCondition - invalid condition returns 'good' as default",
  () => {
    assertEquals(normalizeCondition("excellent"), "good");
    assertEquals(normalizeCondition("poor"), "good");
    assertEquals(normalizeCondition("bad"), "good");
    assertEquals(normalizeCondition("unknown"), "good");
  },
);

Deno.test("normalizeCondition - handles multiple spaces", () => {
  assertEquals(normalizeCondition("like   new"), "like_new");
});

// Edge Case Tests

Deno.test("validateRow - handles decimal prices correctly", () => {
  const row = createValidRow({ original_price: "99.99" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, true);
});

Deno.test("validateRow - handles large quantities", () => {
  const row = createValidRow({ quantity: "10000" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, true);
});

Deno.test("validateRow - handles very small positive price", () => {
  const row = createValidRow({ original_price: "0.01" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, true);
});

Deno.test("validateRow - handles currency field", () => {
  const row = createValidRow({ currency: "USD" });
  const result = validateRow(row, 1);

  assertEquals(result.isValid, true);
});
