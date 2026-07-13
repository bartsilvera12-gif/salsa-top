"use client";

import { createBrowserClient } from "@supabase/ssr";
import { DB_SCHEMA, SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/env";

/**
 * Cliente de Supabase para componentes de cliente (navegador).
 * Usa la clave anónima y el schema `saltatop` por defecto.
 */
export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: { schema: DB_SCHEMA },
  });
}
