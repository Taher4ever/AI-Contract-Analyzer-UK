-- Public storage bucket for blog post cover images. Writes only ever happen
-- through the admin panel's service-role client (which bypasses RLS), so no
-- authenticated write policies are needed here — only public read.

insert into storage.buckets (id, name, public)
values ('blog', 'blog', true)
on conflict (id) do nothing;

create policy "Anyone can view blog cover images"
  on storage.objects for select
  to public
  using (bucket_id = 'blog');
