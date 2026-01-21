
  create table "public"."condition_multipliers" (
    "condition" text not null,
    "multiplier" numeric(4,2) not null,
    "description" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."condition_multipliers" enable row level security;

CREATE UNIQUE INDEX condition_multipliers_pkey ON public.condition_multipliers USING btree (condition);

alter table "public"."condition_multipliers" add constraint "condition_multipliers_pkey" PRIMARY KEY using index "condition_multipliers_pkey";

grant delete on table "public"."condition_multipliers" to "anon";

grant insert on table "public"."condition_multipliers" to "anon";

grant references on table "public"."condition_multipliers" to "anon";

grant select on table "public"."condition_multipliers" to "anon";

grant trigger on table "public"."condition_multipliers" to "anon";

grant truncate on table "public"."condition_multipliers" to "anon";

grant update on table "public"."condition_multipliers" to "anon";

grant delete on table "public"."condition_multipliers" to "authenticated";

grant insert on table "public"."condition_multipliers" to "authenticated";

grant references on table "public"."condition_multipliers" to "authenticated";

grant select on table "public"."condition_multipliers" to "authenticated";

grant trigger on table "public"."condition_multipliers" to "authenticated";

grant truncate on table "public"."condition_multipliers" to "authenticated";

grant update on table "public"."condition_multipliers" to "authenticated";

grant delete on table "public"."condition_multipliers" to "service_role";

grant insert on table "public"."condition_multipliers" to "service_role";

grant references on table "public"."condition_multipliers" to "service_role";

grant select on table "public"."condition_multipliers" to "service_role";

grant trigger on table "public"."condition_multipliers" to "service_role";

grant truncate on table "public"."condition_multipliers" to "service_role";

grant update on table "public"."condition_multipliers" to "service_role";


  create policy "Authenticated users can view"
  on "public"."condition_multipliers"
  as permissive
  for select
  to public
using ((auth.role() = 'authenticated'::text));



