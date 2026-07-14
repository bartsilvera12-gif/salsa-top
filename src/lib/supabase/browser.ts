import { createClient } from "@/lib/supabase/client";

// Cliente de navegador ÚNICO (singleton) para todo el panel.
// Evita recrear el cliente en cada lectura/escritura (punto 10).
let instancia: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (!instancia) instancia = createClient();
  return instancia;
}
