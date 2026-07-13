-- ============================================================================
-- Salsa Top · Crear el PRIMER super_admin (ejemplo, SIN credenciales reales)
-- ----------------------------------------------------------------------------
-- Pasos:
--   1) Crear el usuario en Supabase Auth (Dashboard → Authentication → Add user,
--      o vía API admin). Esto genera la fila en auth.users. NUNCA guardes la
--      contraseña en tablas propias: la maneja Supabase Auth.
--   2) Copiar el UUID del usuario creado (auth.users.id).
--   3) Ejecutar el INSERT de abajo reemplazando el email y el UUID.
--   4) Verificar que activo = true.
--   5) Probar el acceso en /admin/login.
-- ============================================================================
set search_path = saltatop, public;

-- Opción A) si conocés el email del usuario de Auth, resolvés el UUID solo:
insert into saltatop.perfiles (auth_user_id, nombre, apellido, email, rol, activo)
select u.id, 'Nombre', 'Apellido', u.email, 'super_admin', true
from auth.users u
where u.email = 'admin@tudominio.com'   -- << REEMPLAZAR
on conflict (auth_user_id) do update
  set rol = 'super_admin', activo = true;

-- Opción B) con el UUID a mano:
-- insert into saltatop.perfiles (auth_user_id, nombre, apellido, email, rol, activo)
-- values ('00000000-0000-0000-0000-000000000000', 'Nombre', 'Apellido', 'admin@tudominio.com', 'super_admin', true)
-- on conflict (auth_user_id) do update set rol = 'super_admin', activo = true;

-- Verificación:
-- select id, email, rol, activo from saltatop.perfiles where rol = 'super_admin';
