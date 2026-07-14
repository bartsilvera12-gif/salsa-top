import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { DB_SCHEMA, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";

/**
 * Cliente Supabase PÚBLICO (anónimo, sin cookies/sesión).
 *
 * A diferencia de `createClient()` de server.ts, este NO lee cookies, por lo
 * que NO fuerza el render dinámico. Úsalo para leer contenido público
 * (productos, secciones, config, beneficios) en páginas que queremos cachear
 * con ISR (`export const revalidate`). El acceso de solo lectura anónimo está
 * permitido por RLS. Nunca lo uses para datos que dependan del usuario.
 */
export function createPublicClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: { schema: DB_SCHEMA },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
