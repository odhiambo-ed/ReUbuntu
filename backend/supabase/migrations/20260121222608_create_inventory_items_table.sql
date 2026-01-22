create sequence "public"."inventory_items_id_seq";


  create table "public"."inventory_items" (
    "id" integer not null default nextval('public.inventory_items_id_seq'::regclass),
    "user_id" uuid not null,
    "upload_id" integer,
    "merchant_id" text not null,
    "sku" text not null,
    "title" text not null,
    "brand" text,
    "category" text not null,
    "condition" text not null,
    "original_price" numeric(12,2) not null,
    "currency" text not null default 'ZAR'::text,
    "quantity" integer not null default 1,
    "resale_price" numeric(12,2),
    "is_price_manual" boolean default false,
    "status" text not null default 'pending'::text,
    "listed_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "deleted_at" timestamp with time zone
      );


alter table "public"."inventory_items" enable row level security;

alter sequence "public"."inventory_items_id_seq" owned by "public"."inventory_items"."id";

CREATE INDEX idx_inventory_category ON public.inventory_items USING btree (category);

CREATE INDEX idx_inventory_condition ON public.inventory_items USING btree (condition);

CREATE INDEX idx_inventory_created_at ON public.inventory_items USING btree (created_at DESC);

CREATE INDEX idx_inventory_merchant_id ON public.inventory_items USING btree (merchant_id);

CREATE INDEX idx_inventory_not_deleted ON public.inventory_items USING btree (id) WHERE (deleted_at IS NULL);

CREATE INDEX idx_inventory_search ON public.inventory_items USING gin (to_tsvector('english'::regconfig, ((title || ' '::text) || COALESCE(brand, ''::text))));

CREATE INDEX idx_inventory_sku ON public.inventory_items USING btree (sku);

CREATE INDEX idx_inventory_status ON public.inventory_items USING btree (status);

CREATE INDEX idx_inventory_user_id ON public.inventory_items USING btree (user_id);

CREATE UNIQUE INDEX inventory_items_pkey ON public.inventory_items USING btree (id);

CREATE UNIQUE INDEX unique_merchant_sku ON public.inventory_items USING btree (user_id, merchant_id, sku);

alter table "public"."inventory_items" add constraint "inventory_items_pkey" PRIMARY KEY using index "inventory_items_pkey";

alter table "public"."inventory_items" add constraint "inventory_items_condition_check" CHECK ((condition = ANY (ARRAY['new'::text, 'like_new'::text, 'good'::text, 'fair'::text]))) not valid;

alter table "public"."inventory_items" validate constraint "inventory_items_condition_check";

alter table "public"."inventory_items" add constraint "inventory_items_original_price_check" CHECK ((original_price > (0)::numeric)) not valid;

alter table "public"."inventory_items" validate constraint "inventory_items_original_price_check";

alter table "public"."inventory_items" add constraint "inventory_items_quantity_check" CHECK ((quantity >= 1)) not valid;

alter table "public"."inventory_items" validate constraint "inventory_items_quantity_check";

alter table "public"."inventory_items" add constraint "inventory_items_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'priced'::text, 'listed'::text, 'unlisted'::text, 'sold'::text]))) not valid;

alter table "public"."inventory_items" validate constraint "inventory_items_status_check";

alter table "public"."inventory_items" add constraint "inventory_items_upload_id_fkey" FOREIGN KEY (upload_id) REFERENCES public.uploads(id) ON DELETE SET NULL not valid;

alter table "public"."inventory_items" validate constraint "inventory_items_upload_id_fkey";

alter table "public"."inventory_items" add constraint "inventory_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."inventory_items" validate constraint "inventory_items_user_id_fkey";

alter table "public"."inventory_items" add constraint "unique_merchant_sku" UNIQUE using index "unique_merchant_sku";

grant delete on table "public"."inventory_items" to "anon";

grant insert on table "public"."inventory_items" to "anon";

grant references on table "public"."inventory_items" to "anon";

grant select on table "public"."inventory_items" to "anon";

grant trigger on table "public"."inventory_items" to "anon";

grant truncate on table "public"."inventory_items" to "anon";

grant update on table "public"."inventory_items" to "anon";

grant delete on table "public"."inventory_items" to "authenticated";

grant insert on table "public"."inventory_items" to "authenticated";

grant references on table "public"."inventory_items" to "authenticated";

grant select on table "public"."inventory_items" to "authenticated";

grant trigger on table "public"."inventory_items" to "authenticated";

grant truncate on table "public"."inventory_items" to "authenticated";

grant update on table "public"."inventory_items" to "authenticated";

grant delete on table "public"."inventory_items" to "service_role";

grant insert on table "public"."inventory_items" to "service_role";

grant references on table "public"."inventory_items" to "service_role";

grant select on table "public"."inventory_items" to "service_role";

grant trigger on table "public"."inventory_items" to "service_role";

grant truncate on table "public"."inventory_items" to "service_role";

grant update on table "public"."inventory_items" to "service_role";


  create policy "Users can create own inventory"
  on "public"."inventory_items"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can delete own inventory"
  on "public"."inventory_items"
  as permissive
  for delete
  to public
using ((auth.uid() = user_id));



  create policy "Users can update own inventory"
  on "public"."inventory_items"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own inventory"
  on "public"."inventory_items"
  as permissive
  for select
  to public
using (((auth.uid() = user_id) AND (deleted_at IS NULL)));



