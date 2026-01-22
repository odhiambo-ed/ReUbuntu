# ReUbuntu Frontend

A modern Next.js 16 application for the Muna Deadstock Intake & Listing Portal. This frontend provides a clean, ops-focused UI for bulk inventory management with robust validation and clear error reporting.

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Live Demo](https://img.shields.io/badge/Live_Demo-14a1f0?style=for-the-badge&logo=vercel&logoColor=white)](https://re-ubuntu.vercel.app)

---

## 📸 Sneak Peek

<!-- Add your screenshot/GIF here -->
![Frontend Preview](reubuntu.gif)

---

## Table of Contents

- [Quick Start](#-quick-start)
- [Test Credentials](#-test-credentials)
- [Data Modeling & Validation](#-data-modeling--validation)
- [Error Reporting](#-clear-error-reporting)
- [Separation of Concerns](#-separation-of-concerns)
- [Tradeoffs Explained](#-tradeoffs-explained)
- [Testing](#-testing)
- [Project Structure](#-project-structure)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 24+
- pnpm or yarn
- Running Supabase instance (local or cloud)

### Installation

```bash
# Navigate to frontend
cd frontend

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Start development server
pnpm dev
```

🌐 Open **[http://localhost:3000](http://localhost:3000)**

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

---

## 🔑 Login Options

You can sign in using either:
- **Google SSO** - Quick and secure login with your Google account
- **Email & Password** - Use your credentials and check your email for confirmation

---

## 📐 Data Modeling & Validation

### Validation Philosophy

The frontend implements a **multi-layer validation strategy** to catch errors early and provide immediate feedback:

```
┌─────────────────────────────────────────────────────────────────────┐
│                      VALIDATION LAYERS                              │
├─────────────────────────────────────────────────────────────────────┤
│  Layer 1: Client-Side (Zod)     → Immediate UI feedback            │
│  Layer 2: API Route (Zod)       → Server-side validation           │
│  Layer 3: Edge Function         → Row-by-row CSV validation        │
│  Layer 4: Database (Constraints)→ Final integrity checks           │
└─────────────────────────────────────────────────────────────────────┘
```

### Zod Schemas

All data is validated using **Zod schemas** that define structure and constraints:

```typescript
// features/uploads/schemas.ts
export const csvRowSchema = z.object({
  merchant_id: z.string().min(1, "Merchant ID is required"),
  sku: z.string().min(1, "SKU is required"),
  title: z.string().min(1, "Title is required"),
  brand: z.string().optional(),
  category: z.enum(VALID_CATEGORIES, {
    errorMap: () => ({ message: `Invalid category. Must be one of: ${VALID_CATEGORIES.join(', ')}` })
  }),
  condition: z.enum(['new', 'like_new', 'good', 'fair'], {
    errorMap: () => ({ message: "Condition must be: new, like_new, good, or fair" })
  }),
  original_price: z.number().positive("Price must be greater than 0"),
  currency: z.string().min(1, "Currency is required"),
  quantity: z.number().int().positive("Quantity must be at least 1").default(1),
});
```

### Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| `merchant_id` | Non-empty string | "Merchant ID is required" |
| `sku` | Non-empty, unique per merchant | "SKU is required" / "Duplicate SKU" |
| `title` | Non-empty string | "Title is required" |
| `category` | Must match allowed list | "Invalid category. Must be one of: ..." |
| `condition` | Enum: new, like_new, good, fair | "Condition must be: new, like_new, good, or fair" |
| `original_price` | Positive number | "Price must be greater than 0" |
| `quantity` | Positive integer ≥ 1 | "Quantity must be at least 1" |

### Valid Categories

```typescript
const VALID_CATEGORIES = [
  'Tops', 'Bottoms', 'Outerwear', 'Jackets', 
  'Dresses', 'Knitwear', 'Shoes', 'Accessories', 'Activewear'
] as const;
```

---

## 🚨 Clear Error Reporting

### Error Reporting Philosophy

Errors are reported with **specificity and actionability**:

1. **Row-Level Precision** — Know exactly which row failed
2. **Field-Level Detail** — Know exactly which field caused the error
3. **Actionable Messages** — Clear instructions on how to fix
4. **Summary + Detail** — High-level counts + drill-down capability

### Error UI Components

```
┌──────────────────────────────────────────────────────────────┐
│  📊 UPLOAD SUMMARY                                           │
│  ────────────────────────────────────────────────────────────│
│  ✅ 145 rows imported successfully                           │
│  ❌ 5 rows failed validation                                 │
│                                                              │
│  [View Errors] [View Inventory]                              │
└──────────────────────────────────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│  ❌ VALIDATION ERRORS                                        │
│  ────────────────────────────────────────────────────────────│
│  Row 15: category — Invalid category. Must be: Tops, ...     │
│  Row 23: original_price — Price must be greater than 0       │
│  Row 47: condition — Condition must be: new, like_new, ...   │
│  Row 89: sku — SKU is required                               │
│  Row 102: quantity — Quantity must be at least 1             │
└──────────────────────────────────────────────────────────────┘
```

### Error Types

| Error Type | Cause | User Guidance |
|------------|-------|---------------|
| `missing_required` | Required field empty/null | "Field X is required" |
| `invalid_value` | Value doesn't match constraints | "Must be one of: ..." |
| `invalid_format` | Wrong data type | "Must be a number" |
| `duplicate` | SKU already exists | "Duplicate SKU for merchant" |
| `out_of_range` | Value below minimum | "Must be greater than 0" |

### Error Storage

Errors are persisted in the `upload_errors` table for audit and retry:

```typescript
interface UploadError {
  upload_id: string;
  row_number: number;
  field: string;
  value: string | null;
  error_type: string;
  message: string;
}
```

---

## 🧩 Separation of Concerns

### Architecture Overview

The frontend follows a **feature-based architecture** with clear boundaries:

```
frontend/
├── app/                    # Next.js App Router (routing only)
│   ├── api/                # API routes (thin handlers)
│   ├── auth/               # Auth pages
│   └── dashboard/          # Protected pages
│
├── components/             # Reusable UI components (presentation)
│   ├── UploadView.tsx      # Upload UI
│   ├── InventoryView.tsx   # Inventory table
│   └── Sidebar.tsx         # Navigation
│
├── features/               # Business logic modules
│   ├── inventory/
│   │   ├── api.ts          # Supabase queries
│   │   ├── hooks.ts        # React hooks
│   │   ├── types.ts        # TypeScript types
│   │   └── utils.ts        # Helper functions
│   ├── uploads/
│   │   ├── api.ts          # Upload API calls
│   │   ├── hooks.ts        # useUpload, useUploadProgress
│   │   ├── schemas.ts      # Zod validation schemas
│   │   └── types.ts        # Upload types
│   └── pricing/
│       ├── api.ts          # Pricing API calls
│       └── utils.ts        # Calculation helpers
│
├── lib/                    # Shared utilities
│   ├── supabase/           # Supabase client setup
│   └── utils.ts            # Generic helpers
│
└── __tests__/              # Test files mirror feature structure
    └── features/
        ├── inventory/
        ├── uploads/
        └── pricing/
```

### Layer Responsibilities

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Pages (`app/`)** | Routing, layout, page composition | `dashboard/upload/page.tsx` |
| **Components** | UI rendering, user interaction | `<UploadView />` |
| **Features** | Business logic, API calls, state | `useUpload()`, `validateCSVRow()` |
| **Lib** | Infrastructure, shared utilities | `createClient()`, `cn()` |

### Data Flow

```
User Action → Component → Hook → API Function → Supabase → Database
                                      ↓
                              Edge Function (async)
                                      ↓
                              Realtime → Hook → Component → UI Update
```

---

## ⚖️ Tradeoffs Explained

### TD-1: Client-Side CSV Parsing vs Server-Side

**Decision:** Parse CSV on the server (Edge Function) after upload

| Option | Pros | Cons |
|--------|------|------|
| Client-side | Immediate feedback, no upload for invalid files | Large files freeze UI, security concerns |
| **Server-side** ✅ | Handles any file size, secure, consistent | Requires upload before validation |

**Reasoning:** Server-side parsing handles large files reliably and prevents malicious file injection. The async Edge Function with Realtime progress maintains good UX.

---

### TD-2: Strict Category Validation vs Accept-All

**Decision:** Strict validation against predefined category list

| Option | Pros | Cons |
|--------|------|------|
| Accept-all | Flexible, user-friendly | Breaks pricing (no multiplier) |
| **Strict** ✅ | Consistent pricing, clean data | Users must match exact values |

**Reasoning:** Category directly affects pricing calculations. Unknown categories would have no multiplier, breaking the core business logic. Future enhancement: category management UI.

---

### TD-3: Partial Success vs All-or-Nothing

**Decision:** Process all valid rows even if some fail

| Option | Pros | Cons |
|--------|------|------|
| All-or-nothing | Simple mental model | 1 bad row blocks 999 good ones |
| **Partial success** ✅ | Maximizes value, realistic | More complex error UI |

**Reasoning:** Real-world CSVs often have errors. Users should get value from valid data immediately while fixing errors separately.

---

### TD-4: Realtime Progress vs Polling

**Decision:** Use Supabase Realtime Broadcast for progress updates

| Option | Pros | Cons |
|--------|------|------|
| Polling | Simple, works everywhere | High server load, delayed updates |
| **Realtime** ✅ | Instant feedback, efficient | WebSocket complexity |

**Reasoning:** Upload processing can take time. Realtime provides a significantly better UX with instant progress updates without server polling overhead.

---

### TD-5: Database Triggers for Pricing vs Application Logic

**Decision:** Calculate resale price in PostgreSQL trigger

| Option | Pros | Cons |
|--------|------|------|
| Application | Easy to test, visible logic | Can be bypassed, inconsistent |
| **Database trigger** ✅ | Single source of truth, always runs | Harder to unit test |

**Reasoning:** Pricing must be consistent regardless of how data enters (API, CSV, direct SQL). Database triggers guarantee this.

---

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode (TDD)
npm test -- --watch

# Run specific test file
npm test -- uploads.test.ts
```

### Test Structure

```
__tests__/
├── features/
│   ├── uploads/
│   │   ├── hooks.test.ts       # Upload hook tests
│   │   └── validation.test.ts  # CSV validation tests
│   ├── inventory/
│   │   ├── hooks.test.ts       # Inventory hook tests
│   │   └── actions.test.ts     # Bulk action tests
│   └── pricing/
│       ├── calculation.test.ts # Price calculation tests
│       └── multipliers.test.ts # Multiplier lookup tests
├── hooks/
│   └── useRealtime.test.ts     # Realtime subscription tests
└── contexts/
    └── auth.test.ts            # Auth context tests
```

### Test Coverage Areas

#### ✅ CSV Validation & Parsing

```typescript
describe('CSV Validation', () => {
  it('validates required fields', () => {
    const row = { merchant_id: '', sku: 'SKU-1', title: 'Test' };
    const result = validateCSVRow(row);
    expect(result.success).toBe(false);
    expect(result.errors).toContain('merchant_id: Merchant ID is required');
  });

  it('validates category against allowed list', () => {
    const row = { ...validRow, category: 'Invalid' };
    const result = validateCSVRow(row);
    expect(result.errors).toContain('category: Invalid category');
  });

  it('rejects negative prices', () => {
    const row = { ...validRow, original_price: -100 };
    const result = validateCSVRow(row);
    expect(result.errors).toContain('original_price: Must be greater than 0');
  });
});
```

#### ✅ Pricing Logic

```typescript
describe('Pricing Calculation', () => {
  it('calculates resale price correctly', () => {
    const result = calculateResalePrice(899, 'good', 'Jackets');
    // 899 × 0.50 (good) × 1.05 (Jackets) = 471.975 → 471.98
    expect(result).toBe(471.98);
  });

  it('rounds to 2 decimal places', () => {
    const result = calculateResalePrice(100, 'new', 'Tops');
    // 100 × 0.70 × 0.80 = 56.00
    expect(result).toBe(56.00);
  });

  it('handles unknown condition with fallback', () => {
    const result = calculateResalePrice(100, 'unknown' as any, 'Tops');
    expect(result).toBe(35.00); // Uses 'fair' multiplier as fallback
  });
});
```

#### ✅ Upload Workflow

```typescript
describe('useUpload Hook', () => {
  it('handles successful upload', async () => {
    const { result } = renderHook(() => useUpload());
    
    await act(async () => {
      await result.current.uploadFile(mockFile);
    });
    
    expect(result.current.status).toBe('completed');
    expect(result.current.successCount).toBe(10);
  });

  it('captures validation errors', async () => {
    const { result } = renderHook(() => useUpload());
    
    await act(async () => {
      await result.current.uploadFile(mockFileWithErrors);
    });
    
    expect(result.current.errors).toHaveLength(3);
    expect(result.current.errors[0]).toMatchObject({
      row_number: 5,
      field: 'category',
    });
  });
});
```

---

## 📁 Project Structure

```
frontend/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   └── uploads/              # Upload endpoints
│   ├── auth/                     # Login/Register pages
│   │   └── page.tsx
│   ├── dashboard/                # Protected dashboard
│   │   ├── layout.tsx            # Dashboard layout
│   │   ├── page.tsx              # Dashboard home
│   │   ├── inventory/            # Inventory management
│   │   ├── upload/               # CSV upload
│   │   ├── uploads/              # Upload history
│   │   └── settings/             # User settings
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   └── globals.css               # Global styles
│
├── components/                   # UI Components
│   ├── AuthView.tsx              # Auth forms
│   ├── DashboardView.tsx         # Dashboard home
│   ├── InventoryView.tsx         # Inventory table
│   ├── UploadView.tsx            # CSV upload UI
│   ├── Header.tsx                # App header
│   ├── Sidebar.tsx               # Navigation sidebar
│   ├── FilterSelect.tsx          # Filter dropdowns
│   ├── StatusBadge.tsx           # Status indicators
│   ├── StatCard.tsx              # Metric cards
│   ├── Skeletons.tsx             # Loading states
│   └── Spinner.tsx               # Loading spinner
│
├── features/                     # Feature modules
│   ├── inventory/
│   │   ├── api.ts                # Inventory API calls
│   │   ├── hooks.ts              # useInventory, etc.
│   │   ├── types.ts              # Inventory types
│   │   └── utils.ts              # Helper functions
│   ├── uploads/
│   │   ├── api.ts                # Upload API calls
│   │   ├── hooks.ts              # useUpload, useProgress
│   │   ├── schemas.ts            # Zod schemas
│   │   └── types.ts              # Upload types
│   └── pricing/
│       ├── api.ts                # Pricing API calls
│       └── utils.ts              # Calculation helpers
│
├── lib/                          # Shared utilities
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── middleware.ts         # Auth middleware
│   └── utils.ts                  # Generic helpers
│
├── __tests__/                    # Test suites
│   ├── features/                 # Feature tests
│   ├── hooks/                    # Hook tests
│   └── contexts/                 # Context tests
│
├── .env.example                  # Environment template
├── next.config.mjs               # Next.js config
├── tailwind.config.ts            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── package.json                  # Dependencies
```

---

## 🔗 Related Documentation

- **[Root README](../README.md)** — Project overview and setup
- **[Backend README](../backend/supabase/README.md)** — Supabase setup and Edge Functions

---

<p align="center">
  <sub>Built with ❤️ using Next.js 14 and Supabase</sub>
</p>
