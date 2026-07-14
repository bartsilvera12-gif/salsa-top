// Lecturas del panel desde el NAVEGADOR (cliente authenticated + RLS).
// Equivalente client-side de admin-datos.ts (que es server-only). Los tipos se
// importan como `import type` (se borran en compilación → no arrastran server-only).
import { createClient } from "@/lib/supabase/client";
import type { ProductoRow, Opcion, ListaProductos } from "@/lib/admin-datos";

export const PAGINA_PRODUCTOS = 12;

export async function getProductosAdminCliente(opts: {
  q?: string;
  estado?: "todos" | "activos" | "inactivos";
  categoria?: string;
  page?: number;
}): Promise<ListaProductos> {
  try {
    const supabase = createClient();
    const page = Math.max(1, opts.page ?? 1);
    const desde = (page - 1) * PAGINA_PRODUCTOS;

    let query = supabase
      .from("productos")
      .select("id, nombre, slug, precio, stock, activo, destacado, imagen_principal_url, categorias(nombre)", {
        count: "exact",
      })
      .order("orden", { ascending: true })
      .range(desde, desde + PAGINA_PRODUCTOS - 1);

    if (opts.q) query = query.ilike("nombre", `%${opts.q}%`);
    if (opts.estado === "activos") query = query.eq("activo", true);
    if (opts.estado === "inactivos") query = query.eq("activo", false);
    if (opts.categoria) query = query.eq("categoria_id", opts.categoria);

    const { data, count } = await query;
    const rows = (data ?? []).map((p) => {
      const cat = p.categorias as { nombre: string } | { nombre: string }[] | null;
      const nombreCat = Array.isArray(cat) ? cat[0]?.nombre ?? null : cat?.nombre ?? null;
      return {
        id: p.id as string,
        nombre: p.nombre as string,
        slug: p.slug as string,
        precio: p.precio as number,
        stock: p.stock as number,
        activo: p.activo as boolean,
        destacado: p.destacado as boolean,
        imagen_principal_url: p.imagen_principal_url as string | null,
        categoria: nombreCat,
      };
    });
    return { rows, total: count ?? 0 };
  } catch {
    return { rows: [], total: 0 };
  }
}

export async function getProductoByIdCliente(
  id: string,
): Promise<{ producto: ProductoRow; etiquetas: string[] } | null> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("productos").select("*").eq("id", id).maybeSingle();
    if (!data) return null;
    const { data: rel } = await supabase
      .from("producto_etiquetas")
      .select("etiqueta_id")
      .eq("producto_id", id);
    const etiquetas = (rel ?? []).map((r) => r.etiqueta_id as string);
    return { producto: data as ProductoRow, etiquetas };
  } catch {
    return null;
  }
}

export async function getCategoriasOpcionesCliente(): Promise<Opcion[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("categorias").select("id, nombre").order("orden");
    return (data as Opcion[]) ?? [];
  } catch {
    return [];
  }
}

export async function getEtiquetasOpcionesCliente(): Promise<Opcion[]> {
  try {
    const supabase = createClient();
    const { data } = await supabase.from("etiquetas").select("id, nombre").order("nombre");
    return (data as Opcion[]) ?? [];
  } catch {
    return [];
  }
}
