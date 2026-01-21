create sequence "public"."upload_errors_id_seq";


  create table "public"."upload_errors" (
    "id" integer not null default nextval('public.upload_errors_id_seq'::regclass),
    "upload_id" integer not null,
    "row_number" integer not null,
    "field_name" text,
    "error_type" text not null,
    "error_message" text not null,
    "raw_data" jsonb,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."upload_errors" enable row level security;

alter sequence "public"."upload_errors_id_seq" owned by "public"."upload_errors"."id";

CREATE INDEX idx_upload_errors_row_number ON public.upload_errors USING btree (row_number);

CREATE INDEX idx_upload_errors_upload_id ON public.upload_errors USING btree (upload_id);

CREATE UNIQUE INDEX upload_errors_pkey ON public.upload_errors USING btree (id);

alter table "public"."upload_errors" add constraint "upload_errors_pkey" PRIMARY KEY using index "upload_errors_pkey";

alter table "public"."upload_errors" add constraint "upload_errors_error_type_check" CHECK ((error_type = ANY (ARRAY['missing_required'::text, 'invalid_format'::text, 'invalid_value'::text, 'duplicate'::text, 'out_of_range'::text]))) not valid;

alter table "public"."upload_errors" validate constraint "upload_errors_error_type_check";

alter table "public"."upload_errors" add constraint "upload_errors_upload_id_fkey" FOREIGN KEY (upload_id) REFERENCES public.uploads(id) ON DELETE CASCADE not valid;

alter table "public"."upload_errors" validate constraint "upload_errors_upload_id_fkey";

grant delete on table "public"."upload_errors" to "anon";

grant insert on table "public"."upload_errors" to "anon";

grant references on table "public"."upload_errors" to "anon";

grant select on table "public"."upload_errors" to "anon";

grant trigger on table "public"."upload_errors" to "anon";

grant truncate on table "public"."upload_errors" to "anon";

grant update on table "public"."upload_errors" to "anon";

grant delete on table "public"."upload_errors" to "authenticated";

grant insert on table "public"."upload_errors" to "authenticated";

grant references on table "public"."upload_errors" to "authenticated";

grant select on table "public"."upload_errors" to "authenticated";

grant trigger on table "public"."upload_errors" to "authenticated";

grant truncate on table "public"."upload_errors" to "authenticated";

grant update on table "public"."upload_errors" to "authenticated";

grant delete on table "public"."upload_errors" to "service_role";

grant insert on table "public"."upload_errors" to "service_role";

grant references on table "public"."upload_errors" to "service_role";

grant select on table "public"."upload_errors" to "service_role";

grant trigger on table "public"."upload_errors" to "service_role";

grant truncate on table "public"."upload_errors" to "service_role";

grant update on table "public"."upload_errors" to "service_role";


  create policy "Users can view own upload errors"
  on "public"."upload_errors"
  as permissive
  for select
  to public
using ((upload_id IN ( SELECT uploads.id
   FROM public.uploads
  WHERE (uploads.user_id = auth.uid()))));



