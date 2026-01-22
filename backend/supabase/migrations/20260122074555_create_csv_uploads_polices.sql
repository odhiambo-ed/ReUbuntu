
  create policy "Users can delete own uploads"
  on "storage"."objects"
  as permissive
  for delete
  to public
using (((bucket_id = 'csv-uploads'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



  create policy "Users can read own uploads"
  on "storage"."objects"
  as permissive
  for select
  to public
using (((bucket_id = 'csv-uploads'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



  create policy "Users can upload to own folder"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'csv-uploads'::text) AND ((auth.uid())::text = (storage.foldername(name))[1])));



