// Repositorio tipado de Testimonios (sobre crearCrud). Los componentes usan
// `testimoniosRepo`; nunca llaman a crearCrud directamente.
import { crearCrud } from "@/lib/crud/crud-cliente";
import { getSupabase } from "@/lib/supabase/browser";

export type Testimonio = {
  id: string;
  nombre_cliente: string;
  cargo_o_descripcion: string | null;
  comentario: string;
  calificacion: number;
  imagen_url: string | null;
  destacado: boolean;
  aprobado: boolean;
  orden: number;
};

const crud = crearCrud({ tabla: "testimonios", ordenDefault: { campo: "orden", asc: true } });

export const testimoniosRepo = {
  /** Listado completo ordenado por `orden` (misma consulta que la vista admin). */
  async listar(): Promise<Testimonio[]> {
    const supabase = getSupabase();
    const { data } = await supabase.from("testimonios").select("*").order("orden");
    return (data as Testimonio[]) ?? [];
  },
  obtener: (id: string) => crud.obtener<Testimonio>(id, "*"),
  crear: (payload: Record<string, unknown>) => crud.insertar(payload),
  actualizar: (id: string, payload: Record<string, unknown>) => crud.actualizar(id, payload),
  alternarAprobado: (id: string, aprobado: boolean) => crud.alternar(id, "aprobado", aprobado),
  eliminar: (id: string) => crud.eliminar(id),
};
