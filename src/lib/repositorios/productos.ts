// Repositorio tipado de Productos (sobre crearCrud). Los componentes importan
// `productosRepo` y usan sus métodos; nunca llaman a crearCrud directamente.
import { crearCrud } from "@/lib/crud/crud-cliente";
import { getSupabase } from "@/lib/supabase/browser";
import type { Lista, Resultado } from "@/lib/crud/tipos";

// --- Tipos del módulo ---
export type Producto = {
  id: string;
  nombre: string;
  slug: string;
  codigo: string | null;
  categoria_id: string | null;
  descripcion_corta: string | null;
  descripcion_larga: string | null;
  ingredientes: string | null;
  recomendaciones_uso: string | null;
  presentacion: string | null;
  contenido_neto: string | null;
  precio: number;
  precio_oferta: number | null;
  costo: number | null;
  stock: number;
  stock_minimo: number;
  controla_stock: boolean;
  nivel_picante: number;
  imagen_principal_url: string | null;
  destacado: boolean;
  nuevo: boolean;
  en_oferta: boolean;
  activo: boolean;
  orden: number;
  meta_titulo: string | null;
  meta_descripcion: string | null;
};

export type ProductoLista = {
  id: string;
  nombre: string;
  slug: string;
  precio: number;
  stock: number;
  activo: boolean;
  destacado: boolean;
  imagen_principal_url: string | null;
  categoria: string | null;
};

export type FiltroProductos = {
  q?: string;
  estado?: "todos" | "activos" | "inactivos";
  categoria?: string;
  page?: number;
};

type FilaConJoin = Omit<ProductoLista, "categoria"> & {
  categorias: { nombre: string } | { nombre: string }[] | null;
};

const crud = crearCrud({
  tabla: "productos",
  campoBusqueda: "nombre",
  ordenDefault: { campo: "orden", asc: true },
  traducirError: (m) =>
    m.includes("productos_slug")
      ? "Ya existe un producto con ese slug."
      : m.includes("productos_codigo")
        ? "Ya existe un producto con ese código."
        : m,
});

export const productosRepo = {
  pageSize: crud.pageSize,

  async listar(opts: FiltroProductos = {}): Promise<Lista<ProductoLista>> {
    const filtros = [];
    if (opts.estado === "activos") filtros.push({ campo: "activo", valor: true });
    if (opts.estado === "inactivos") filtros.push({ campo: "activo", valor: false });
    if (opts.categoria) filtros.push({ campo: "categoria_id", valor: opts.categoria });

    const { rows, total } = await crud.listar<FilaConJoin>({
      q: opts.q,
      filtros,
      page: opts.page,
      select: "id, nombre, slug, precio, stock, activo, destacado, imagen_principal_url, categorias(nombre)",
    });

    const mapped = rows.map((p) => {
      const nombreCat = Array.isArray(p.categorias)
        ? p.categorias[0]?.nombre ?? null
        : p.categorias?.nombre ?? null;
      const { categorias: _omitir, ...resto } = p;
      void _omitir;
      return { ...resto, categoria: nombreCat };
    });
    return { rows: mapped, total };
  },

  async obtener(id: string): Promise<{ producto: Producto; etiquetas: string[] } | null> {
    const producto = await crud.obtener<Producto>(id, "*");
    if (!producto) return null;
    const supabase = getSupabase();
    const { data: rel } = await supabase
      .from("producto_etiquetas")
      .select("etiqueta_id")
      .eq("producto_id", id);
    const etiquetas = (rel ?? []).map((r) => r.etiqueta_id as string);
    return { producto, etiquetas };
  },

  crear: (payload: Record<string, unknown>) => crud.insertar(payload),
  actualizar: (id: string, payload: Record<string, unknown>) => crud.actualizar(id, payload),
  alternarActivo: (id: string, activo: boolean) => crud.alternar(id, "activo", activo),
  eliminar: (id: string) => crud.eliminar(id),
  duplicar: (id: string) =>
    crud.duplicar(id, (fila) => {
      delete fila.id;
      delete fila.creado_en;
      delete fila.actualizado_en;
      fila.nombre = `${String(fila.nombre)} (copia)`;
      fila.slug = `${String(fila.slug)}-copia-${Date.now().toString(36)}`;
      fila.codigo = null;
      fila.activo = false;
      fila.destacado = false;
      return fila;
    }),

  /** Sincroniza la tabla puente producto_etiquetas. */
  async sincronizarEtiquetas(productoId: string, etiquetas: string[]): Promise<Resultado> {
    const supabase = getSupabase();
    await supabase.from("producto_etiquetas").delete().eq("producto_id", productoId);
    if (etiquetas.length > 0) {
      const { error } = await supabase
        .from("producto_etiquetas")
        .insert(etiquetas.map((etiqueta_id) => ({ producto_id: productoId, etiqueta_id })));
      if (error) return { ok: false, error: error.message };
    }
    return { ok: true, data: undefined };
  },
};
