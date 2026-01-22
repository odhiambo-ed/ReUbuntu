-- View: Upload summary with success rate
CREATE OR REPLACE VIEW upload_summary AS
SELECT 
  u.id,
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
    WHEN u.total_rows > 0 
    THEN ROUND(((u.success_count::numeric / u.total_rows) * 100), 1)
    ELSE 0
  END AS success_rate,
  COALESCE(error_counts.error_details_count, 0) AS error_details_count
FROM uploads u
LEFT JOIN (
  SELECT upload_id, COUNT(*) AS error_details_count
  FROM upload_errors
  GROUP BY upload_id
) error_counts ON u.id = error_counts.upload_id;

-- Grant access to views for authenticated users
GRANT SELECT ON upload_summary TO authenticated;
