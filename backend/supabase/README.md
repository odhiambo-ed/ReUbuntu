# ReUbuntu Backend - Supabase

A robust Supabase backend for the ReUbuntu resale pricing platform, featuring CSV inventory uploads, dynamic pricing calculations, and real-time processing.

[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Deno](https://img.shields.io/badge/Deno-white?style=for-the-badge&logo=deno&logoColor=464647)](https://deno.land)

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Database Schema](#database-schema)
- [Edge Functions](#edge-functions)
- [API Reference](#api-reference)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Features

- **CSV Bulk Upload** - Process thousands of inventory items via CSV
- **Dynamic Pricing** - Automatic resale price calculation based on condition & category multipliers
- **Real-time Progress** - Live updates during CSV processing via Supabase Realtime
- **Row-Level Security** - Secure multi-tenant data isolation
- **Automatic Triggers** - Price recalculation on item updates

---

## Architecture

```
backend/supabase/
├── config.toml              # Supabase local configuration
├── functions/               # Edge Functions (Deno)
│   ├── _shared/             # Shared utilities
│   │   ├── cors.ts          # CORS headers
│   │   ├── realtime.ts      # Broadcast helpers
│   │   └── supabase.ts      # Service client
│   └── process-csv-upload/  # CSV processing function
│       ├── index.ts         # Main handler
│       ├── helpers.ts       # Validation & normalization
│       ├── helpers.test.ts  # Unit tests
│       └── deno.json        # Deno config
├── migrations/              # Database migrations
└── schemas/                 # SQL schema definitions
```

---

## 📤 Upload Architecture (Deep Dive)

### Design Philosophy

The upload system is built on three core principles:

1. **Non-blocking UX** — Users never wait for processing; uploads are processed asynchronously
2. **Single Source of Truth** — One Edge Function, one Realtime channel, one status update path
3. **Fault Tolerance** — Failed rows don't block successful ones; comprehensive error capture

### High-Level Flow

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT                                        │
│  ┌──────────────┐    ┌──────────────┐    ┌────────────────────────────────┐    │
│  │  File Picker │───▶│ Upload Hook  │───▶│ Realtime Subscription Listener │    │
│  └──────────────┘    └──────────────┘    └────────────────────────────────┘    │
└─────────────────────────────────────┬───────────────────▲──────────────────────┘
                                      │                   │
                              1. Upload File        4. Progress Events
                                      │                   │
                                      ▼                   │
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              SUPABASE PLATFORM                                  │
│                                                                                 │
│  ┌─────────────────┐     ┌─────────────────┐     ┌─────────────────────────┐   │
│  │     Storage     │     │    Database     │     │       Realtime          │   │
│  │  (csv-uploads)  │     │  (PostgreSQL)   │     │   (upload:{id} ch)      │   │
│  └────────┬────────┘     └────────┬────────┘     └───────────▲─────────────┘   │
│           │                       │                          │                  │
│           │              2. Create Upload Record             │                  │
│           │                 (status: pending)                │                  │
│           │                       │                          │                  │
│           ▼                       ▼                          │                  │
│  ┌──────────────────────────────────────────────────────────────────────────┐  │
│  │                         EDGE FUNCTION                                     │  │
│  │                    (process-csv-upload)                                   │  │
│  │                                                                           │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────────┐   │  │
│  │  │ Download   │─▶│   Parse    │─▶│  Validate  │─▶│  Batch Insert    │   │  │
│  │  │ from Store │  │   CSV      │  │   Rows     │  │  + Update Status │   │  │
│  │  └────────────┘  └────────────┘  └────────────┘  └──────────────────┘   │  │
│  │                                                           │              │  │
│  │                                            3. Broadcast progress ────────┘  │
│  └──────────────────────────────────────────────────────────────────────────┘  │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Detailed Sequence Diagram

#### Phase 1: File Upload & Storage

```
┌──────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │ Next.js  │          │ Supabase │          │ Supabase │
│          │          │   API    │          │ Storage  │          │    DB    │
└────┬─────┘          └────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │                     │
     │ 1. POST /api/uploads│                     │                     │
     │  (multipart/form)   │                     │                     │
     │────────────────────▶│                     │                     │
     │                     │                     │                     │
     │                     │ 2. Validate file    │                     │
     │                     │    (type, size)     │                     │
     │                     │                     │                     │
     │                     │ 3. Upload to bucket │                     │
     │                     │────────────────────▶│                     │
     │                     │                     │                     │
     │                     │    Storage path     │                     │
     │                     │◀────────────────────│                     │
     │                     │                     │                     │
     │                     │ 4. INSERT upload record (status: 'pending')
     │                     │─────────────────────────────────────────▶│
     │                     │                     │                     │
     │                     │                     │    upload_id        │
     │                     │◀─────────────────────────────────────────│
     │                     │                     │                     │
     │  5. Return upload_id│                     │                     │
     │◀────────────────────│                     │                     │
```

#### Phase 2: Async Processing Trigger

```
┌──────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │ Next.js  │          │   Edge   │          │ Supabase │
│          │          │   API    │          │ Function │          │    DB    │
└────┬─────┘          └────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │                     │
     │ 1. POST /api/uploads/process              │                     │
     │    { upload_id }    │                     │                     │
     │────────────────────▶│                     │                     │
     │                     │                     │                     │
     │                     │ 2. Invoke Edge Function (fire-and-forget) │
     │                     │────────────────────▶│                     │
     │                     │                     │                     │
     │  3. Return 202      │                     │                     │
     │     Accepted        │                     │                     │
     │◀────────────────────│                     │                     │
     │                     │                     │                     │
     │ 4. Subscribe to     │                     │ 5. UPDATE status    │
     │    Realtime channel │                     │    → 'processing'   │
     │                     │                     │────────────────────▶│
```

#### Phase 3: CSV Processing Pipeline

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         EDGE FUNCTION INTERNALS                              │
└──────────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Download   │     │    Parse    │     │   Validate  │     │   Batch     │
│  CSV from   │────▶│   with      │────▶│   Each Row  │────▶│   Insert    │
│  Storage    │     │  Papa Parse │     │             │     │   (upsert)  │
└─────────────┘     └─────────────┘     └──────┬──────┘     └──────┬──────┘
       │                   │                   │                   │
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
   Broadcast           Broadcast           Broadcast           Broadcast
   "Downloading"       "Parsing"          "Validating"        "Inserting"
       │                   │                   │                   │
       └───────────────────┴───────────────────┴───────────────────┘
                                    │
                                    ▼
                          ┌─────────────────────────────────────┐
                          │     Update Upload Record            │
                          │  - status: 'completed'/'failed'     │
                          │  - success_count / error_count      │
                          │  + Broadcast "Complete"             │
                          └─────────────────────────────────────┘
```

### What's NOT in This Architecture (Intentionally)

| Feature | Why Deferred |
|---------|--------------|
| DB Triggers for Progress | Edge Function already controls status; triggers add complexity |
| Progress Table | Redundant; Realtime broadcast is ephemeral and sufficient |
| Cron Jobs | Workflow is event-driven, not time-driven |
| Queue/DLQ | Edge Functions scale well for expected volume |
| Retry Logic | Documented for v2; not needed for MVP |

> **💡 Interview Answer**: "I intentionally scoped this as an async, event-driven pipeline. I avoided queues, cron jobs, and retries in the MVP to keep the system explainable and reliable. However, I documented clear evolution paths for when volume increases."

### Realtime Progress Events

The Edge Function broadcasts progress to a channel the client subscribes to:

```typescript
// Client subscription
const channel = supabase
  .channel(`upload:${uploadId}`)
  .on('broadcast', { event: 'progress' }, (payload) => {
    // payload: { progress: 45, message: 'Validating rows...', phase: 'validating' }
    setProgress(payload.progress);
    setMessage(payload.message);
  })
  .subscribe();

// Edge Function broadcast
await supabase.channel(`upload:${uploadId}`).send({
  type: 'broadcast',
  event: 'progress',
  payload: { progress: 45, message: 'Validating rows...', phase: 'validating' }
});
```

### Error Handling Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                    ERROR HANDLING FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Row Error (validation failure)                                 │
│  ├─▶ Record in upload_errors table                             │
│  ├─▶ Continue processing remaining rows                        │
│  └─▶ Include in error_count on completion                      │
│                                                                 │
│  System Error (DB failure, network issue)                       │
│  ├─▶ Update upload status → 'failed'                           │
│  ├─▶ Store error message in upload record                      │
│  └─▶ Broadcast failure event to client                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Quick Start

### Prerequisites

- [Supabase CLI](https://supabase.com/docs/guides/cli) v1.0+
- [Docker](https://www.docker.com/) (for local development)
- [Deno](https://deno.land/) v1.30+ (for Edge Functions)

### 1. Install Supabase CLI

```bash
# macOS
brew install supabase/tap/supabase

# npm
npm install -g supabase

# Verify installation
supabase --version
```

### 2. Start Local Development

```bash
cd backend/supabase

# Start Supabase services (Postgres, Auth, Storage, etc.)
supabase start

# You'll see output with local URLs:
# API URL: http://127.0.0.1:54321
# DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
# Studio URL: http://127.0.0.1:54323
```

### 3. Apply Migrations

```bash
# Migrations run automatically on `supabase start`
# To reset and reapply all migrations:
supabase db reset
```

### 4. Serve Edge Functions Locally

```bash
supabase functions serve --env-file .env.local
```

---

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `profiles` | User profiles linked to `auth.users` |
| `uploads` | CSV upload metadata and status |
| `upload_errors` | Row-level validation errors |
| `inventory_items` | Product inventory with pricing |
| `condition_multipliers` | Pricing multipliers by condition |
| `category_multipliers` | Pricing multipliers by category |

### Views

| View | Description |
|------|-------------|
| `inventory_with_pricing` | Items with calculated resale prices |
| `upload_summary` | Upload stats with success rates |

### Database Functions

| Function | Description |
|----------|-------------|
| `calculate_resale_price(price, condition, category)` | Calculates resale price |
| `auto_calculate_resale_price()` | Trigger function for auto-pricing |
| `handle_new_user()` | Creates profile on user signup |

### Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────┐     ┌─────────────────┐
│   profiles   │     │   uploads    │────▶│  upload_errors  │
│──────────────│     │──────────────│     │─────────────────│
│ id (FK→auth) │◀────│ user_id      │     │ upload_id       │
│ email        │     │ file_name    │     │ row_number      │
│ full_name    │     │ status       │     │ field           │
└──────────────┘     │ total_rows   │     │ error_type      │
                     └──────────────┘     └─────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │ inventory_items │
                   │─────────────────│
                   │ upload_id       │
                   │ sku             │
                   │ original_price  │──▶ Triggers auto pricing
                   │ resale_price    │
                   │ condition       │──▶ condition_multipliers
                   │ category        │──▶ category_multipliers
                   └─────────────────┘
```

---

## Edge Functions

### `process-csv-upload`

Processes uploaded CSV files, validates rows, and bulk inserts inventory items.

#### Endpoint

```
POST /functions/v1/process-csv-upload
```

#### Request Body

```json
{
  "upload_id": "uuid",
  "user_id": "uuid"
}
```

#### Response

```json
{
  "success": true,
  "upload_id": "uuid",
  "processed": 150,
  "success_count": 145,
  "error_count": 5
}
```

#### Processing Flow

1. **Mark Processing** → Sets upload status to `processing`
2. **Download CSV** → Retrieves file from Storage bucket
3. **Parse CSV** → Uses PapaParse with header detection
4. **Validate Rows** → Checks required fields, values, formats
5. **Batch Insert** → Inserts valid items in batches of 100
6. **Record Errors** → Stores validation errors with details
7. **Finalize** → Updates upload with final counts

#### Realtime Progress

Subscribe to real-time updates during processing:

```typescript
const channel = supabase
  .channel(`upload:${uploadId}`)
  .on('broadcast', { event: 'progress' }, (payload) => {
    console.log(payload.progress, payload.message);
  })
  .subscribe();
```

---

## API Reference

### REST API

All tables with RLS are accessible via the REST API at `http://localhost:54321/rest/v1/`.

#### Authentication

```bash
# Include in headers
Authorization: Bearer <access_token>
apikey: <anon_key>
```

#### Inventory Items

```bash
# List user's inventory
GET /rest/v1/inventory_items?select=*

# Get with pricing calculations
GET /rest/v1/inventory_with_pricing?select=*

# Insert item
POST /rest/v1/inventory_items
Content-Type: application/json
{
  "sku": "ITEM-001",
  "title": "Designer Jacket",
  "category": "Outerwear",
  "condition": "like_new",
  "original_price": 250.00
}
```

#### Uploads

```bash
# List uploads with summary
GET /rest/v1/upload_summary?select=*

# Get upload errors
GET /rest/v1/upload_errors?upload_id=eq.<uuid>
```

### Storage API

```bash
# Upload CSV file
POST /storage/v1/object/csv-uploads/<user_id>/<filename>
Content-Type: text/csv

# Download file
GET /storage/v1/object/csv-uploads/<user_id>/<filename>
```

---

## Testing

### Run Edge Function Tests

```bash
cd functions/process-csv-upload

# Run all tests
deno test --allow-read

# Run with verbose output
deno test --allow-read -- --verbose

# Run specific test file
deno test --allow-read helpers.test.ts

# Watch mode
deno test --allow-read --watch
```

### Test Coverage

The test suite covers:

- ✅ **Validation Logic** - Required fields, value validation, format checks
- ✅ **Category Normalization** - Case handling, whitespace trimming
- ✅ **Condition Normalization** - Value mapping, default fallbacks
- ✅ **Edge Cases** - Decimal prices, large quantities, special characters

### Database Testing

```bash
# Run migrations on shadow database
supabase db reset

# Test specific migration
supabase migration repair --status reverted <version>
supabase db push
```

### Manual Function Testing

```bash
# Invoke locally with test data
curl -i --location --request POST \
  'http://127.0.0.1:54321/functions/v1/process-csv-upload' \
  --header 'Authorization: Bearer <access_token>' \
  --header 'Content-Type: application/json' \
  --data '{"upload_id": "<uuid>", "user_id": "<uuid>"}'
```

---

## Environment Variables

### Local Development (`.env.local`)

```bash
# Supabase
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<your-local-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-local-service-role-key>
```

### Production

Set these in your Supabase Dashboard → Settings → Edge Functions:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Your project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin operations |

---

## Deployment

### Deploy Edge Functions

```bash
# Deploy all functions
supabase functions deploy

# Deploy specific function
supabase functions deploy process-csv-upload

# Deploy with secrets
supabase secrets set MY_SECRET=value
supabase functions deploy process-csv-upload
```

### Push Database Migrations

```bash
# Link to remote project
supabase link --project-ref <project-id>

# Push migrations
supabase db push

# Generate types for frontend
supabase gen types typescript --local > ../types/database.types.ts
```

### Production Checklist

- [ ] All migrations applied to production
- [ ] Edge Functions deployed
- [ ] Storage bucket policies configured
- [ ] RLS policies enabled on all tables
- [ ] Environment secrets set
- [ ] Realtime enabled for required tables

---

## Troubleshooting

### Common Issues

#### Docker not running

```bash
# Error: Cannot connect to Docker daemon
# Solution: Start Docker Desktop or daemon
docker info
```

#### Port conflicts

```bash
# Error: Port 54321 already in use
# Solution: Stop other Supabase instances
supabase stop
supabase start
```

#### Migration failures

```bash
# View migration status
supabase migration list

# Reset and reapply
supabase db reset

# Check logs
supabase db logs
```

#### Edge Function errors

```bash
# View function logs
supabase functions logs process-csv-upload

# Test locally with debug
supabase functions serve --debug
```

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)


---

<p align="center">
  <sub>Built with ❤️ using Supabase</sub>
</p>
