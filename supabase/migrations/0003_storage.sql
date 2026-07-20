-- Private storage bucket for uploaded contracts. Files are stored under
-- {auth.uid()}/... so ownership can be checked from the object path alone.

insert into storage.buckets (id, name, public)
values ('contracts', 'contracts', false)
on conflict (id) do nothing;

create policy "Users can read own contract files"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'contracts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can upload own contract files"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'contracts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can update own contract files"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'contracts'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'contracts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "Users can delete own contract files"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'contracts'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
