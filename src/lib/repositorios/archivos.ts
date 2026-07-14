// Repositorio tipado de la biblioteca de archivos (multimedia).
import { crearCrud } from "@/lib/crud/crud-cliente";
import { getSupabase } from "@/lib/supabase/browser";

export type Archivo = {
  id: string;
  nombre: string;
  url: string;
  ruta_storage: string;
  mime_type: string | null;
  tamano_bytes: number | null;
  creado_en: string;
};

const crud = crearCrud({ tabla: "archivos" });

export const archivosRepo = {
  /** Últimos 200 archivos (misma consulta que la vista admin). */
  async listar(): Promise<Archivo[]> {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("archivos")
      .select("id, nombre, url, ruta_storage, mime_type, tamano_bytes, creado_en")
      .order("creado_en", { ascending: false })
      .limit(200);
    return (data as Archivo[]) ?? [];
  },
  crear: (payload: Record<string, unknown>) => crud.insertar(payload),
  eliminarRegistro: (id: string) => crud.eliminar(id),
};
