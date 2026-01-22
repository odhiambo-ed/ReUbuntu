create sequence "public"."uploads_id_seq";


  create table "public"."uploads" (
    "id" integer not null default nextval('public.uploads_id_seq'::regclass),
    "user_id" uuid not null,
    "filename" text not null,
    "file_path" text,
    "file_size_bytes" integer,
    "status" text not null default 'pending'::text,
    "total_rows" integer default 0,
    "success_count" integer default 0,
    "error_count" integer default 0,
    "processing_started_at" timestamp with time zone,
    "processing_completed_at" timestamp with time zone,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."uploads" enable row level security;

alter sequence "public"."uploads_id_seq" owned by "public"."uploads"."id";

CREATE INDEX idx_uploads_created_at ON public.uploads USING btree (created_at DESC);

CREATE INDEX idx_uploads_status ON public.uploads USING btree (status);

CREATE INDEX idx_uploads_user_id ON public.uploads USING btree (user_id);

CREATE UNIQUE INDEX uploads_pkey ON public.uploads USING btree (id);

alter table "public"."uploads" add constraint "uploads_pkey" PRIMARY KEY using index "uploads_pkey";

alter table "public"."uploads" add constraint "uploads_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'processing'::text, 'completed'::text, 'failed'::text]))) not valid;

alter table "public"."uploads" validate constraint "uploads_status_check";

alter table "public"."uploads" add constraint "uploads_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."uploads" validate constraint "uploads_user_id_fkey";

grant delete on table "public"."uploads" to "anon";

grant insert on table "public"."uploads" to "anon";

grant references on table "public"."uploads" to "anon";

grant select on table "public"."uploads" to "anon";

grant trigger on table "public"."uploads" to "anon";

grant truncate on table "public"."uploads" to "anon";

grant update on table "public"."uploads" to "anon";

grant delete on table "public"."uploads" to "authenticated";

grant insert on table "public"."uploads" to "authenticated";

grant references on table "public"."uploads" to "authenticated";

grant select on table "public"."uploads" to "authenticated";

grant trigger on table "public"."uploads" to "authenticated";

grant truncate on table "public"."uploads" to "authenticated";

grant update on table "public"."uploads" to "authenticated";

grant delete on table "public"."uploads" to "service_role";

grant insert on table "public"."uploads" to "service_role";

grant references on table "public"."uploads" to "service_role";

grant select on table "public"."uploads" to "service_role";

grant trigger on table "public"."uploads" to "service_role";

grant truncate on table "public"."uploads" to "service_role";

grant update on table "public"."uploads" to "service_role";


  create policy "Users can create own uploads"
  on "public"."uploads"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Users can update own uploads"
  on "public"."uploads"
  as permissive
  for update
  to public
using ((auth.uid() = user_id));



  create policy "Users can view own uploads"
  on "public"."uploads"
  as permissive
  for select
  to public
using ((auth.uid() = user_id));



