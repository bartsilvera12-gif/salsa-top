// Repositorio tipado de Beneficios (sobre crearCrud). Los componentes usan
// `beneficiosRepo`; nunca llaman a crearCrud directamente.
import { crearCrud } from "@/lib/crud/crud-cliente";
import { getSupabase } from "@/lib/supabase/browser";

export type Beneficio = {
  id: string;
  titulo: string;
  descripcion: string | null;
  icono: string | null;
  imagen_url: string | null;
  orden: number;
  activo: boolean;
};

const crud = crearCrud({ tabla: "beneficios", ordenDefault: { campo: "orden", asc: true } });

export const beneficiosRepo = {
  /** Listado completo ordenado por `orden` (misma consulta que la vista admin). */
  async listar(): Promise<Beneficio[]> {
    const supabase = getSupabase();
    const { data } = await supabase.from("beneficios").select("*").order("orden");
    return (data as Beneficio[]) ?? [];
  },
  obtener: (id: string) => crud.obtener<Beneficio>(id, "*"),
  crear: (payload: Record<string, unknown>) => crud.insertar(payload),
  actualizar: (id: string, payload: Record<string, unknown>) => crud.actualizar(id, payload),
  alternarActivo: (id: string, activo: boolean) => crud.alternar(id, "activo", activo),
  eliminar: (id: string) => crud.eliminar(id),
};
