// Lecturas del panel desde el NAVEGADOR usando la infraestructura CRUD compartida.
// Los tipos se importan como `import type` (se borran en compilación).
import { crearCrud } from "@/lib/crud/crud-cliente";
import { getSupabase } from "@/lib/supabase/browser";
import type { ProductoRow, Opcion, ListaProductos } from "@/lib/admin-datos";

const crudProductos = crearCrud({
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
const crudCategorias = crearCrud({ tabla: "categorias" });
const crudEtiquetas = crearCrud({ tabla: "etiquetas" });

export const PAGINA_PRODUCTOS = crudProductos.pageSize;
export { crudProductos };

type FilaLista = {
  id: string;
  nombre: string;
  slug: string;
  precio: number;
  stock: number;
  activo: boolean;
  destacado: boolean;
  imagen_principal_url: string | null;
  categorias: { nombre: string } | { nombre: string }[] | null;
};

export async function getProductosAdminCliente(opts: {
  q?: string;
  estado?: "todos" | "activos" | "inactivos";
  categoria?: string;
  page?: number;
}): Promise<ListaProductos> {
  const filtros = [];
  if (opts.estado === "activos") filtros.push({ campo: "activo", valor: true });
  if (opts.estado === "inactivos") filtros.push({ campo: "activo", valor: false });
  if (opts.categoria) filtros.push({ campo: "categoria_id", valor: opts.categoria });

  const { rows, total } = await crudProductos.listar<FilaLista>({
    q: opts.q,
    filtros,
    page: opts.page,
    select: "id, nombre, slug, precio, stock, activo, destacado, imagen_principal_url, categorias(nombre)",
  });

  const mapped = rows.map((p) => {
    const nombreCat = Array.isArray(p.categorias) ? p.categorias[0]?.nombre ?? null : p.categorias?.nombre ?? null;
    return {
      id: p.id,
      nombre: p.nombre,
      slug: p.slug,
      precio: p.precio,
      stock: p.stock,
      activo: p.activo,
      destacado: p.destacado,
      imagen_principal_url: p.imagen_principal_url,
      categoria: nombreCat,
    };
  });
  return { rows: mapped, total };
}

export async function getProductoByIdCliente(
  id: string,
): Promise<{ producto: ProductoRow; etiquetas: string[] } | null> {
  const producto = await crudProductos.obtener<ProductoRow>(id, "*");
  if (!producto) return null;
  const supabase = getSupabase();
  const { data: rel } = await supabase
    .from("producto_etiquetas")
    .select("etiqueta_id")
    .eq("producto_id", id);
  const etiquetas = (rel ?? []).map((r) => r.etiqueta_id as string);
  return { producto, etiquetas };
}

export function getCategoriasOpcionesCliente(): Promise<Opcion[]> {
  return crudCategorias.opciones("id, nombre", "orden");
}

export function getEtiquetasOpcionesCliente(): Promise<Opcion[]> {
  return crudEtiquetas.opciones("id, nombre", "nombre");
}
