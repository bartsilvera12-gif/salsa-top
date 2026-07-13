-- ============================================================================
-- Salsa Top · 0001 · Schema, extensiones y permisos base
-- ----------------------------------------------------------------------------
-- Todas las tablas, vistas, funciones y triggers del proyecto viven en el
-- schema `saltatop`. NO se usa `public` para datos comerciales del proyecto.
-- NO se modifica ningún otro schema existente.
-- ============================================================================

create schema if not exists saltatop;

-- Extensiones necesarias (idempotentes). pgcrypto expone gen_random_uuid().
create extension if not exists pgcrypto with schema public;

-- ----------------------------------------------------------------------------
-- Permisos de uso del schema.
-- El acceso real a filas queda controlado por RLS (ver 0004_rls.sql).
-- Estos GRANT solo habilitan el schema y los privilegios de tabla; RLS decide.
-- ----------------------------------------------------------------------------
grant usage on schema saltatop to anon, authenticated, service_role;

-- Privilegios por defecto para objetos que se creen a continuación.
alter default privileges in schema saltatop
  grant select on tables to anon;
alter default privileges in schema saltatop
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema saltatop
  grant all on tables to service_role;
alter default privileges in schema saltatop
  grant usage, select on sequences to anon, authenticated, service_role;
alter default privileges in schema saltatop
  grant execute on functions to anon, authenticated, service_role;

-- ============================================================================
-- IMPORTANTE (Supabase self-hosted / PostgREST):
-- Para exponer el schema `saltatop` en la API REST, agregarlo a los schemas
-- expuestos por PostgREST. En Coolify/Supabase self-hosted, en el servicio
-- `rest` (PostgREST) definir:
--
--     PGRST_DB_SCHEMAS=public,graphql_public,storage,saltatop
--
-- y reiniciar el servicio. En Supabase Cloud: Dashboard → Project Settings →
-- API → "Exposed schemas" → agregar `saltatop`.
-- Los clientes de la app ya piden el schema `saltatop` por defecto
-- (db.schema en los helpers de Supabase).
-- ============================================================================
