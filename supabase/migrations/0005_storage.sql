-- ============================================================================
-- Salsa Top · 0005 · Supabase Storage (buckets + políticas)
-- No se modifica la estructura del schema storage; solo se crean buckets
-- propios y políticas acotadas a esos buckets.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- Buckets públicos (lectura por URL) con límite de 5 MB y solo imágenes.
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('saltatop-productos', 'saltatop-productos', true, 5242880,
    array['image/jpeg','image/png','image/webp','image/avif']),
  ('saltatop-banners',   'saltatop-banners',   true, 5242880,
    array['image/jpeg','image/png','image/webp','image/avif']),
  ('saltatop-contenido', 'saltatop-contenido', true, 5242880,
    array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml']),
  ('saltatop-recetas',   'saltatop-recetas',   true, 5242880,
    array['image/jpeg','image/png','image/webp','image/avif']),
  ('saltatop-general',   'saltatop-general',   true, 5242880,
    array['image/jpeg','image/png','image/webp','image/avif','image/svg+xml'])
on conflict (id) do nothing;

-- ----------------------------------------------------------------------------
-- Lectura pública de los buckets de Salsa Top.
-- ----------------------------------------------------------------------------
drop policy if exists "saltatop_storage_lectura_publica" on storage.objects;
create policy "saltatop_storage_lectura_publica" on storage.objects
  for select to anon, authenticated
  using (bucket_id in (
    'saltatop-productos','saltatop-banners','saltatop-contenido','saltatop-recetas','saltatop-general'));

-- ----------------------------------------------------------------------------
-- Escritura / actualización / borrado: solo administradores de contenido.
-- ----------------------------------------------------------------------------
drop policy if exists "saltatop_storage_insert_admin" on storage.objects;
create policy "saltatop_storage_insert_admin" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('saltatop-productos','saltatop-banners','saltatop-contenido','saltatop-recetas','saltatop-general')
    and saltatop.usuario_tiene_rol(array['super_admin','administrador','editor']));

drop policy if exists "saltatop_storage_update_admin" on storage.objects;
create policy "saltatop_storage_update_admin" on storage.objects
  for update to authenticated
  using (
    bucket_id in ('saltatop-productos','saltatop-banners','saltatop-contenido','saltatop-recetas','saltatop-general')
    and saltatop.usuario_tiene_rol(array['super_admin','administrador','editor']));

drop policy if exists "saltatop_storage_delete_admin" on storage.objects;
create policy "saltatop_storage_delete_admin" on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('saltatop-productos','saltatop-banners','saltatop-contenido','saltatop-recetas','saltatop-general')
    and saltatop.usuario_tiene_rol(array['super_admin','administrador','editor']));
