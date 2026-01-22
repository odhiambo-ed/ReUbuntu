import { serve } from "std/http/server";
import Papa from "papaparse";

import { corsHeaders, handleCors } from "../_shared/cors.ts";
import { createServiceSupabaseClient } from "../_shared/supabase.ts";
import { broadcastProgress } from "../_shared/realtime.ts";

interface ProcessRequest {
  upload_id: string;
  user_id: string;
}

interface CSVRow {
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

interface InventoryItemInsert {
  user_id: string;
  upload_id: string;
  merchant_id: string;
  sku: string;
  title: string;
  brand: string | null;
  category: string;
  condition: string;
  original_price: number;
  currency: string;
  quantity: number;
  status: "pending";
}

interface UploadErrorInsert {
  upload_id: string;
  row_number: number;
  field_name: string;
  error_type: string;
  error_message: string;
  raw_data: CSVRow;
}

serve(async (req: Request) => {
  // Handle CORS preflight
  const corsResponse = handleCors(req);
  if (corsResponse) return corsResponse;

  try {
    const { upload_id, user_id }: ProcessRequest = await req.json();

    // Initialize Supabase client with service role for admin operations
    const supabase = createServiceSupabaseClient();

    // ─────────────────────────────────────────────────────────────
    // STEP 1: Mark upload as processing
    // ─────────────────────────────────────────────────────────────
    await supabase
      .from("uploads")
      .update({
        status: "processing",
        processing_started_at: new Date().toISOString(),
      })
      .eq("id", upload_id);

    // Broadcast initial progress
    await broadcastProgress(supabase, upload_id, {
      status: "processing",
      message: "Starting CSV processing...",
      progress: 0,
    });

    // ─────────────────────────────────────────────────────────────
    // STEP 2: Download CSV from Storage
    // ─────────────────────────────────────────────────────────────
    const { data: upload, error: uploadError } = await supabase
      .from("uploads")
      .select("file_path")
      .eq("id", upload_id)
      .single();

    if (uploadError) throw uploadError;
    if (!upload?.file_path) {
      throw new Error(
        `Upload record not found or missing file_path for upload_id=${upload_id}`,
      );
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from("csv-uploads")
      .download(upload.file_path);

    if (downloadError) throw downloadError;

    if (!fileData) {
      throw new Error(
        `Storage download returned no data for file_path=${upload.file_path}`,
      );
    }

    const csvText = await fileData.text();

    // ─────────────────────────────────────────────────────────────
    // STEP 3: Parse CSV
    // ─────────────────────────────────────────────────────────────
    const parseResult = Papa.parse<CSVRow>(csvText, {
      header: true,
      skipEmptyLines: true,
      transformHeader: (header: string) =>
        header.trim().toLowerCase().replace(/\s+/g, "_"),
    });

    const rows = parseResult.data;
    const totalRows = rows.length;

    await supabase
      .from("uploads")
      .update({ total_rows: totalRows })
      .eq("id", upload_id);

    await broadcastProgress(supabase, upload_id, {
      status: "processing",
      message: `Parsed ${totalRows} rows. Validating...`,
      progress: 10,
      total_rows: totalRows,
    });

    // ─────────────────────────────────────────────────────────────
    // STEP 4: Validate & Process Rows
    // ─────────────────────────────────────────────────────────────
    const validItems: InventoryItemInsert[] = [];
    const errors: UploadErrorInsert[] = [];
    const BATCH_SIZE = 100;
    const PROGRESS_INTERVAL = Math.max(1, Math.floor(totalRows / 10));

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const rowNumber = i + 2; // Account for header row (1-indexed for humans)

      const validation = validateRow(row, rowNumber);

      if (validation.isValid) {
        validItems.push({
          user_id,
          upload_id,
          merchant_id: row.merchant_id.trim(),
          sku: row.sku.trim(),
          title: row.title.trim(),
          brand: row.brand?.trim() || null,
          category: normalizeCategory(row.category),
          condition: normalizeCondition(row.condition),
          original_price: parseFloat(row.original_price),
          currency: row.currency?.trim().toUpperCase() || "ZAR",
          quantity: parseInt(row.quantity) || 1,
          status: "pending",
        });
      } else {
        errors.push(
          ...validation.errors.map((err) => ({
            upload_id,
            row_number: rowNumber,
            field_name: err.field,
            error_type: err.type,
            error_message: err.message,
            raw_data: row,
          })),
        );
      }

      // Broadcast progress at intervals
      if ((i + 1) % PROGRESS_INTERVAL === 0 || i === rows.length - 1) {
        const progress = 10 + Math.floor(((i + 1) / totalRows) * 60); // 10-70%
        await broadcastProgress(supabase, upload_id, {
          status: "processing",
          message: `Validated ${i + 1}/${totalRows} rows...`,
          progress,
          validated: i + 1,
          valid_count: validItems.length,
          error_count: errors.length,
        });
      }
    }

    // ─────────────────────────────────────────────────────────────
    // STEP 5: Bulk Insert Valid Items
    // ─────────────────────────────────────────────────────────────
    await broadcastProgress(supabase, upload_id, {
      status: "processing",
      message: `Inserting ${validItems.length} valid items...`,
      progress: 75,
    });

    let insertedCount = 0;

    // Process in batches to avoid payload limits
    for (let i = 0; i < validItems.length; i += BATCH_SIZE) {
      const batch = validItems.slice(i, i + BATCH_SIZE);

      const { data, error: insertError } = await supabase
        .from("inventory_items")
        .upsert(batch, {
          onConflict: "user_id,merchant_id,sku",
          ignoreDuplicates: false,
        })
        .select("id");

      if (!insertError && data) {
        insertedCount += data.length;
      }

      // Broadcast batch progress
      const progress =
        75 + Math.floor(((i + batch.length) / validItems.length) * 15); // 75-90%
      await broadcastProgress(supabase, upload_id, {
        status: "processing",
        message: `Inserted ${insertedCount}/${validItems.length} items...`,
        progress,
      });
    }

    // ─────────────────────────────────────────────────────────────
    // STEP 6: Insert Errors
    // ─────────────────────────────────────────────────────────────
    if (errors.length > 0) {
      for (let i = 0; i < errors.length; i += BATCH_SIZE) {
        const batch = errors.slice(i, i + BATCH_SIZE);
        await supabase.from("upload_errors").insert(batch);
      }
    }

    // ─────────────────────────────────────────────────────────────
    // STEP 7: Finalize Upload
    // ─────────────────────────────────────────────────────────────
    const finalStatus = errors.length === totalRows ? "failed" : "completed";

    await supabase
      .from("uploads")
      .update({
        status: finalStatus,
        success_count: insertedCount,
        error_count: errors.length,
        processing_completed_at: new Date().toISOString(),
      })
      .eq("id", upload_id);

    // Final broadcast
    await broadcastProgress(supabase, upload_id, {
      status: finalStatus,
      message:
        finalStatus === "completed"
          ? `Processing complete! ${insertedCount} items added.`
          : "Processing failed. All rows had errors.",
      progress: 100,
      success_count: insertedCount,
      error_count: errors.length,
      total_rows: totalRows,
    });

    return new Response(
      JSON.stringify({
        success: true,
        upload_id,
        status: finalStatus,
        total_rows: totalRows,
        success_count: insertedCount,
        error_count: errors.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "string"
          ? error
          : "Unknown error";

    console.error("Processing error:", error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

// ─────────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────────

interface ValidationResult {
  isValid: boolean;
  errors: Array<{ field: string; type: string; message: string }>;
}

function validateRow(row: CSVRow, _rowNumber: number): ValidationResult {
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
  const validConditions = ["new", "like_new", "like new", "good", "fair"];
  if (
    row.condition &&
    !validConditions.includes(row.condition.toLowerCase().trim())
  ) {
    errors.push({
      field: "condition",
      type: "invalid_value",
      message: `Condition must be one of: new, like_new, good, fair`,
    });
  }

  // Validate category value
  const validCategories = [
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
  if (
    row.category &&
    !validCategories.includes(row.category.toLowerCase().trim())
  ) {
    errors.push({
      field: "category",
      type: "invalid_value",
      message: `Category must be one of: ${validCategories.join(", ")}`,
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

function normalizeCategory(category: string): string {
  const mapping: Record<string, string> = {
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
  return mapping[category.toLowerCase().trim()] || category;
}

function normalizeCondition(condition: string): string {
  const normalized = condition.toLowerCase().trim().replace(/\s+/g, "_");
  return ["new", "like_new", "good", "fair"].includes(normalized)
    ? normalized
    : "good";
}

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/process-csv-upload' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
