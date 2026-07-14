// Repositorio tipado de Recetas (sobre crearCrud). Los componentes usan
// `recetasRepo`; nunca llaman a crearCrud directamente.
import { crearCrud } from "@/lib/crud/crud-cliente";
import { getSupabase } from "@/lib/supabase/browser";

export type Receta = {
  id: string;
  titulo: string;
  slug: string;
  descripcion_corta: string | null;
  contenido: string | null;
  ingredientes: string | null;
  instrucciones: string | null;
  imagen_principal_url: string | null;
  tiempo_preparacion_minutos: number | null;
  porciones: number | null;
  dificultad: string | null;
  activa: boolean;
  destacada: boolean;
  meta_titulo: string | null;
  meta_descripcion: string | null;
};

const crud = crearCrud({
  tabla: "recetas",
  ordenDefault: { campo: "creada_en", asc: false },
  traducirError: (m) =>
    m.includes("recetas_slug") ? "Ya existe una receta con ese slug." : m,
});

export const recetasRepo = {
  /** Listado completo ordenado por fecha de creación (misma consulta que la vista admin). */
  async listar(): Promise<Receta[]> {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("recetas")
      .select("*")
      .order("creada_en", { ascending: false });
    return (data as Receta[]) ?? [];
  },
  obtener: (id: string) => crud.obtener<Receta>(id, "*"),
  crear: (payload: Record<string, unknown>) => crud.insertar(payload),
  actualizar: (id: string, payload: Record<string, unknown>) => crud.actualizar(id, payload),
  alternarActiva: (id: string, activa: boolean) => crud.alternar(id, "activa", activa),
  eliminar: (id: string) => crud.eliminar(id),
};
