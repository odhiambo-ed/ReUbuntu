create or replace view "public"."upload_summary" as  SELECT u.id,
    u.user_id,
    u.filename,
    u.file_path,
    u.file_size_bytes,
    u.status,
    u.total_rows,
    u.success_count,
    u.error_count,
    u.processing_started_at,
    u.processing_completed_at,
    u.created_at,
    u.updated_at,
        CASE
            WHEN (u.total_rows > 0) THEN round((((u.success_count)::numeric / (u.total_rows)::numeric) * (100)::numeric), 1)
            ELSE (0)::numeric
        END AS success_rate,
    COALESCE(error_counts.error_details_count, (0)::bigint) AS error_details_count
   FROM (public.uploads u
     LEFT JOIN ( SELECT upload_errors.upload_id,
            count(*) AS error_details_count
           FROM public.upload_errors
          GROUP BY upload_errors.upload_id) error_counts ON ((u.id = error_counts.upload_id)));



