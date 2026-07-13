import "server-only";

import { createClient } from "@supabase/supabase-js";
import { DB_SCHEMA, SUPABASE_URL, getServiceRoleKey } from "@/lib/env";

/**
 * Cliente con privilegios de service_role. SOLO SERVIDOR.
 * El import "server-only" hace fallar el build si se importa en el navegador.
 * Usar exclusivamente en Server Actions / Route Handlers para operaciones
 * que deban saltarse RLS de forma controlada (p. ej. alta de administradores,
 * cálculos de pedidos vía RPC con validación en servidor).
 */
export function createAdminClient() {
  return createClient(SUPABASE_URL, getServiceRoleKey(), {
    db: { schema: DB_SCHEMA },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
