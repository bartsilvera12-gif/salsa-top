import "server-only";
import { createClient } from "@/lib/supabase/server";

export type ProductoRow = {
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

export type Opcion = { id: string; nombre: string };

export type ListaProductos = {
  rows: (Pick<ProductoRow, "id" | "nombre" | "slug" | "precio" | "stock" | "activo" | "destacado" | "imagen_principal_url"> & {
    categoria: string | null;
  })[];
  total: number;
};

const PAGE_SIZE = 12;

export async function getProductosAdmin(opts: {
  q?: string;
  estado?: "todos" | "activos" | "inactivos";
  page?: number;
}): Promise<ListaProductos> {
  try {
    const supabase = await createClient();
    const page = Math.max(1, opts.page ?? 1);
    const desde = (page - 1) * PAGE_SIZE;

    let query = supabase
      .from("productos")
      .select("id, nombre, slug, precio, stock, activo, destacado, imagen_principal_url, categorias(nombre)", {
        count: "exact",
      })
      .order("orden", { ascending: true })
      .range(desde, desde + PAGE_SIZE - 1);

    if (opts.q) query = query.ilike("nombre", `%${opts.q}%`);
    if (opts.estado === "activos") query = query.eq("activo", true);
    if (opts.estado === "inactivos") query = query.eq("activo", false);

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

export const PAGINA_PRODUCTOS = PAGE_SIZE;

export async function getProductoById(id: string): Promise<{ producto: ProductoRow; etiquetas: string[] } | null> {
  try {
    const supabase = await createClient();
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

export async function getCategoriasOpciones(): Promise<Opcion[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("categorias").select("id, nombre").order("orden");
    return (data as Opcion[]) ?? [];
  } catch {
    return [];
  }
}

export async function getEtiquetasOpciones(): Promise<Opcion[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("etiquetas").select("id, nombre").order("nombre");
    return (data as Opcion[]) ?? [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Categorías
// ---------------------------------------------------------------------------
export type CategoriaRow = {
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

export type CategoriaLista = Pick<CategoriaRow, "id" | "nombre" | "slug" | "color" | "orden" | "activa"> & {
  productos: number;
};

export async function getCategoriasAdmin(): Promise<CategoriaLista[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("categorias")
      .select("id, nombre, slug, color, orden, activa, productos(count)")
      .order("orden", { ascending: true });
    return (data ?? []).map((c) => {
      const rel = c.productos as { count: number }[] | null;
      return {
        id: c.id as string,
        nombre: c.nombre as string,
        slug: c.slug as string,
        color: c.color as string | null,
        orden: c.orden as number,
        activa: c.activa as boolean,
        productos: rel?.[0]?.count ?? 0,
      };
    });
  } catch {
    return [];
  }
}

export async function getCategoriaById(id: string): Promise<CategoriaRow | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("categorias").select("*").eq("id", id).maybeSingle();
    return (data as CategoriaRow | null) ?? null;
  } catch {
    return null;
  }
}

export async function contarProductosDeCategoria(id: string): Promise<number> {
  try {
    const supabase = await createClient();
    const { count } = await supabase
      .from("productos")
      .select("*", { count: "exact", head: true })
      .eq("categoria_id", id);
    return count ?? 0;
  } catch {
    return 0;
  }
}

// ---------------------------------------------------------------------------
// Configuración del sitio
// ---------------------------------------------------------------------------
export type ConfiguracionRow = {
  id: string;
  nombre_marca: string;
  eslogan: string | null;
  descripcion_corta: string | null;
  descripcion_larga: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  whatsapp: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  horario_atencion: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  moneda: string | null;
  simbolo_moneda: string | null;
  pais: string | null;
  compra_minima: number | null;
  costo_envio: number | null;
  envio_gratis_desde: number | null;
  retiro_local_habilitado: boolean;
  pedidos_habilitados: boolean;
  mensaje_confirmacion: string | null;
};

export async function getConfiguracionAdmin(): Promise<ConfiguracionRow | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("configuracion_sitio")
      .select("*")
      .order("creado_en", { ascending: true })
      .limit(1)
      .maybeSingle();
    return (data as ConfiguracionRow | null) ?? null;
  } catch {
    return null;
  }
}
