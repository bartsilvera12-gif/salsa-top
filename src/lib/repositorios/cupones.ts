// Repositorio tipado de Cupones (sobre crearCrud). Los componentes usan
// `cuponesRepo`; nunca llaman a crearCrud directamente.
import { crearCrud } from "@/lib/crud/crud-cliente";
import { getSupabase } from "@/lib/supabase/browser";

export type Cupon = {
  id: string;
  codigo: string;
  descripcion: string | null;
  tipo_descuento: string;
  valor: number;
  compra_minima: number;
  limite_usos: number | null;
  limite_por_cliente: number | null;
  usos_actuales: number;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  activo: boolean;
};

const crud = crearCrud({
  tabla: "cupones",
  ordenDefault: { campo: "creado_en", asc: false },
  traducirError: (m) => (m.includes("codigo") ? "Ya existe un cupón con ese código." : m),
});

export const cuponesRepo = {
  /** Listado completo ordenado por `creado_en` (misma consulta que la vista admin). */
  async listar(): Promise<Cupon[]> {
    const supabase = getSupabase();
    const { data } = await supabase.from("cupones").select("*").order("creado_en", { ascending: false });
    return (data as Cupon[]) ?? [];
  },
  obtener: (id: string) => crud.obtener<Cupon>(id, "*"),
  crear: (payload: Record<string, unknown>) => crud.insertar(payload),
  actualizar: (id: string, payload: Record<string, unknown>) => crud.actualizar(id, payload),
  alternarActivo: (id: string, activo: boolean) => crud.alternar(id, "activo", activo),
  eliminar: (id: string) => crud.eliminar(id),
};
