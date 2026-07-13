/**
 * Acceso centralizado a variables de entorno.
 * Las variables NEXT_PUBLIC_* son seguras para el navegador.
 * SUPABASE_SERVICE_ROLE_KEY solo debe leerse en el servidor.
 */

export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://salsatop.com.py";

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "595994208200";

/** Schema de PostgREST donde viven todas las tablas del proyecto. */
export const DB_SCHEMA = "saltatop" as const;

/** Lee la service role key. Lanza si se invoca sin configurarla. Solo servidor. */
export function getServiceRoleKey(): string {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY no está configurada (solo servidor).",
    );
  }
  return key;
}

export function assertPublicEnv() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    throw new Error(
      "Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
}
