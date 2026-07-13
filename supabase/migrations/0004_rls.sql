-- ============================================================================
-- Salsa Top · 0004 · Row Level Security y políticas
-- ============================================================================
set search_path = saltatop, public;

-- ----------------------------------------------------------------------------
-- Activar RLS en todas las tablas del schema.
-- ----------------------------------------------------------------------------
do $$
declare t text;
begin
  for t in
    select tablename from pg_tables where schemaname = 'saltatop'
  loop
    execute format('alter table saltatop.%I enable row level security;', t);
    execute format('alter table saltatop.%I force row level security;', t);
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- Ocultar el costo de productos/variantes al público (nivel de columna).
-- ----------------------------------------------------------------------------
revoke select (costo) on saltatop.productos from anon;

-- ----------------------------------------------------------------------------
-- Políticas de administración por rol (una por tabla, agrupadas por permisos).
-- CONTENT = super_admin, administrador, editor
-- OPS     = super_admin, administrador, operador_pedidos
-- ADMIN   = super_admin, administrador
-- SUPER   = super_admin
-- ----------------------------------------------------------------------------
do $$
declare r record;
begin
  for r in select * from (values
    ('productos',          'super_admin,administrador,editor'),
    ('producto_imagenes',  'super_admin,administrador,editor'),
    ('producto_variantes', 'super_admin,administrador,editor'),
    ('producto_etiquetas', 'super_admin,administrador,editor'),
    ('categorias',         'super_admin,administrador,editor'),
    ('etiquetas',          'super_admin,administrador,editor'),
    ('banners',            'super_admin,administrador,editor'),
    ('secciones_sitio',    'super_admin,administrador,editor'),
    ('beneficios',         'super_admin,administrador,editor'),
    ('testimonios',        'super_admin,administrador,editor'),
    ('recetas',            'super_admin,administrador,editor'),
    ('receta_productos',   'super_admin,administrador,editor'),
    ('archivos',           'super_admin,administrador,editor'),
    ('configuracion_sitio','super_admin,administrador'),
    ('cupones',            'super_admin,administrador'),
    ('cupon_usos',         'super_admin,administrador'),
    ('metodos_pago',       'super_admin,administrador'),
    ('metodos_entrega',    'super_admin,administrador'),
    ('suscriptores',       'super_admin,administrador'),
    ('clientes',           'super_admin,administrador,operador_pedidos'),
    ('pedidos',            'super_admin,administrador,operador_pedidos'),
    ('pedido_items',       'super_admin,administrador,operador_pedidos'),
    ('pedido_historial',   'super_admin,administrador,operador_pedidos'),
    ('mensajes_contacto',  'super_admin,administrador,operador_pedidos')
  ) as x(tabla, roles) loop
    execute format('drop policy if exists %I on saltatop.%I;', 'admin_all_'||r.tabla, r.tabla);
    execute format(
      'create policy %I on saltatop.%I for all to authenticated
         using (saltatop.usuario_tiene_rol(string_to_array(%L, %L)))
         with check (saltatop.usuario_tiene_rol(string_to_array(%L, %L)));',
      'admin_all_'||r.tabla, r.tabla, r.roles, ',', r.roles, ',');
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- Lectura pública (anon + authenticated): solo contenido activo/aprobado.
-- ----------------------------------------------------------------------------
create policy pub_configuracion on saltatop.configuracion_sitio
  for select to anon, authenticated using (activo = true);

create policy pub_categorias on saltatop.categorias
  for select to anon, authenticated using (activa = true);

create policy pub_productos on saltatop.productos
  for select to anon, authenticated using (activo = true);

create policy pub_producto_imagenes on saltatop.producto_imagenes
  for select to anon, authenticated using (
    exists (select 1 from saltatop.productos p where p.id = producto_id and p.activo = true));

create policy pub_producto_variantes on saltatop.producto_variantes
  for select to anon, authenticated using (
    activa = true and exists (select 1 from saltatop.productos p where p.id = producto_id and p.activo = true));

create policy pub_etiquetas on saltatop.etiquetas
  for select to anon, authenticated using (activa = true);

create policy pub_producto_etiquetas on saltatop.producto_etiquetas
  for select to anon, authenticated using (
    exists (select 1 from saltatop.productos p where p.id = producto_id and p.activo = true));

create policy pub_banners on saltatop.banners
  for select to anon, authenticated using (
    activo = true
    and (fecha_inicio is null or now() >= fecha_inicio)
    and (fecha_fin is null or now() <= fecha_fin));

create policy pub_secciones on saltatop.secciones_sitio
  for select to anon, authenticated using (activa = true);

create policy pub_beneficios on saltatop.beneficios
  for select to anon, authenticated using (activo = true);

create policy pub_testimonios on saltatop.testimonios
  for select to anon, authenticated using (aprobado = true);

create policy pub_recetas on saltatop.recetas
  for select to anon, authenticated using (activa = true);

create policy pub_receta_productos on saltatop.receta_productos
  for select to anon, authenticated using (
    exists (select 1 from saltatop.recetas r where r.id = receta_id and r.activa = true));

create policy pub_metodos_pago on saltatop.metodos_pago
  for select to anon, authenticated using (activo = true);

create policy pub_metodos_entrega on saltatop.metodos_entrega
  for select to anon, authenticated using (activo = true);

-- ----------------------------------------------------------------------------
-- Escritura pública controlada (solo INSERT): contacto y newsletter.
-- No se expone SELECT al público sobre estas tablas.
-- ----------------------------------------------------------------------------
grant insert on saltatop.mensajes_contacto to anon;
grant insert on saltatop.suscriptores to anon;

create policy pub_insert_contacto on saltatop.mensajes_contacto
  for insert to anon, authenticated with check (true);

create policy pub_insert_suscriptor on saltatop.suscriptores
  for insert to anon, authenticated with check (true);

-- ----------------------------------------------------------------------------
-- perfiles: cada usuario ve su propio perfil; super_admin gestiona todos.
-- ----------------------------------------------------------------------------
create policy perfil_propio_select on saltatop.perfiles
  for select to authenticated using (auth_user_id = auth.uid());

create policy perfil_propio_update on saltatop.perfiles
  for update to authenticated
  using (auth_user_id = auth.uid())
  with check (auth_user_id = auth.uid() and rol = (select rol from saltatop.perfiles p where p.auth_user_id = auth.uid()));

create policy perfil_super_admin_all on saltatop.perfiles
  for all to authenticated
  using (saltatop.usuario_tiene_rol(array['super_admin']))
  with check (saltatop.usuario_tiene_rol(array['super_admin']));

-- ----------------------------------------------------------------------------
-- auditoria: lectura para ADMIN; escritura solo vía función registrar_auditoria.
-- ----------------------------------------------------------------------------
create policy auditoria_admin_select on saltatop.auditoria
  for select to authenticated
  using (saltatop.usuario_tiene_rol(array['super_admin','administrador']));
