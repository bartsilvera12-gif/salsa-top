// Repositorio tipado de Categorías (incluye la relación de conteo de productos).
import { crearCrud } from "@/lib/crud/crud-cliente";
import { getSupabase } from "@/lib/supabase/browser";
import type { Opcion } from "@/lib/crud/tipos";

export type Categoria = {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string | null;
  imagen_url: string | null;
  icono: string | null;
  color: string | null;
  orden: number;
  activa: boolean;
};

export type CategoriaLista = {
  id: string;
  nombre: string;
  slug: string;
  color: string | null;
  orden: number;
  activa: boolean;
  productos: number;
};

const crud = crearCrud({
  tabla: "categorias",
  campoBusqueda: "nombre",
  ordenDefault: { campo: "orden", asc: true },
  traducirError: (m) =>
    m.includes("categorias_slug") ? "Ya existe una categoría con ese slug." : m,
});

export const categoriasRepo = {
  pageSize: crud.pageSize,

  /** Listado con la cantidad de productos por categoría. */
  async listarConConteo(): Promise<CategoriaLista[]> {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("categorias")
      .select("id, nombre, slug, color, orden, activa, productos(count)")
      .order("orden");
    const filas = (data ?? []) as Array<{
      id: string;
      nombre: string;
      slug: string;
      color: string | null;
      orden: number;
      activa: boolean;
      productos: { count: number }[] | null;
    }>;
    return filas.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      slug: c.slug,
      color: c.color,
      orden: c.orden,
      activa: c.activa,
      productos: c.productos?.[0]?.count ?? 0,
    }));
  },

  obtener: (id: string) => crud.obtener<Categoria>(id, "*"),
  opciones: (select = "id, nombre", orden = "orden"): Promise<Opcion[]> => crud.opciones(select, orden),
  crear: (payload: Record<string, unknown>) => crud.insertar(payload),
  actualizar: (id: string, payload: Record<string, unknown>) => crud.actualizar(id, payload),
  alternarActiva: (id: string, activa: boolean) => crud.alternar(id, "activa", activa),
  eliminar: (id: string) => crud.eliminar(id),

  /** Cuenta productos asociados (para no eliminar categorías con productos). */
  async contarProductos(id: string): Promise<number> {
    const supabase = getSupabase();
    const { count } = await supabase
      .from("productos")
      .select("*", { count: "exact", head: true })
      .eq("categoria_id", id);
    return count ?? 0;
  },
};
