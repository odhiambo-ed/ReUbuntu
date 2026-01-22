
  create table "public"."category_multipliers" (
    "category" text not null,
    "multiplier" numeric(4,2) not null,
    "description" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."category_multipliers" enable row level security;

CREATE UNIQUE INDEX category_multipliers_pkey ON public.category_multipliers USING btree (category);

alter table "public"."category_multipliers" add constraint "category_multipliers_pkey" PRIMARY KEY using index "category_multipliers_pkey";

grant delete on table "public"."category_multipliers" to "anon";

grant insert on table "public"."category_multipliers" to "anon";

grant references on table "public"."category_multipliers" to "anon";

grant select on table "public"."category_multipliers" to "anon";

grant trigger on table "public"."category_multipliers" to "anon";

grant truncate on table "public"."category_multipliers" to "anon";

grant update on table "public"."category_multipliers" to "anon";

grant delete on table "public"."category_multipliers" to "authenticated";

grant insert on table "public"."category_multipliers" to "authenticated";

grant references on table "public"."category_multipliers" to "authenticated";

grant select on table "public"."category_multipliers" to "authenticated";

grant trigger on table "public"."category_multipliers" to "authenticated";

grant truncate on table "public"."category_multipliers" to "authenticated";

grant update on table "public"."category_multipliers" to "authenticated";

grant delete on table "public"."category_multipliers" to "service_role";

grant insert on table "public"."category_multipliers" to "service_role";

grant references on table "public"."category_multipliers" to "service_role";

grant select on table "public"."category_multipliers" to "service_role";

grant trigger on table "public"."category_multipliers" to "service_role";

grant truncate on table "public"."category_multipliers" to "service_role";

grant update on table "public"."category_multipliers" to "service_role";


  create policy "Authenticated users can view"
  on "public"."category_multipliers"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



