// Repositorio tipado de Secciones (sobre crearCrud). Los componentes usan
// `seccionesRepo`; nunca llaman a crearCrud directamente.
import { crearCrud } from "@/lib/crud/crud-cliente";
import { getSupabase } from "@/lib/supabase/browser";
import type { SeccionRow } from "@/lib/admin-datos";

export type Seccion = SeccionRow;

const crud = crearCrud({
  tabla: "secciones_sitio",
  ordenDefault: { campo: "orden", asc: true },
  traducirError: (msg) => (msg.includes("clave") ? "Ya existe una sección con esa clave." : msg),
});

export const seccionesRepo = {
  /** Listado completo ordenado por `orden` (misma consulta que la vista admin). */
  async listar(): Promise<Seccion[]> {
    const supabase = getSupabase();
    const { data } = await supabase.from("secciones_sitio").select("*").order("orden");
    return (data as Seccion[]) ?? [];
  },
  obtener: (id: string) => crud.obtener<Seccion>(id, "*"),
  crear: (payload: Record<string, unknown>) => crud.insertar(payload),
  actualizar: (id: string, payload: Record<string, unknown>) => crud.actualizar(id, payload),
  alternarActiva: (id: string, activa: boolean) => crud.alternar(id, "activa", activa),
};
