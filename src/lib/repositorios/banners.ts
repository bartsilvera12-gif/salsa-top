// Repositorio tipado de Banners (sobre crearCrud). Los componentes usan
// `bannersRepo`; nunca llaman a crearCrud directamente.
import { crearCrud } from "@/lib/crud/crud-cliente";
import { getSupabase } from "@/lib/supabase/browser";

export type Banner = {
  id: string;
  titulo: string | null;
  subtitulo: string | null;
  descripcion: string | null;
  imagen_desktop_url: string | null;
  imagen_mobile_url: string | null;
  texto_boton: string | null;
  enlace_boton: string | null;
  color_texto: string | null;
  color_fondo: string | null;
  overlay: number;
  orden: number;
  activo: boolean;
  fecha_inicio: string | null;
  fecha_fin: string | null;
};

const crud = crearCrud({ tabla: "banners", ordenDefault: { campo: "orden", asc: true } });

export const bannersRepo = {
  /** Listado completo ordenado por `orden` (misma consulta que la vista admin). */
  async listar(): Promise<Banner[]> {
    const supabase = getSupabase();
    const { data } = await supabase.from("banners").select("*").order("orden");
    return (data as Banner[]) ?? [];
  },
  obtener: (id: string) => crud.obtener<Banner>(id, "*"),
  crear: (payload: Record<string, unknown>) => crud.insertar(payload),
  actualizar: (id: string, payload: Record<string, unknown>) => crud.actualizar(id, payload),
  alternarActivo: (id: string, activo: boolean) => crud.alternar(id, "activo", activo),
  eliminar: (id: string) => crud.eliminar(id),
};
