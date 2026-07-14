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
  categoria?: string;
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

// ---------------------------------------------------------------------------
// Secciones del sitio (contenido)
// ---------------------------------------------------------------------------
export type SeccionRow = {
  id: string;
  clave: string;
  titulo: string | null;
  subtitulo: string | null;
  contenido: string | null;
  imagen_url: string | null;
  imagen_mobile_url: string | null;
  video_url: string | null;
  texto_boton: string | null;
  enlace_boton: string | null;
  orden: number;
  activa: boolean;
};

export async function getSeccionesAdmin(): Promise<SeccionRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("secciones_sitio").select("*").order("orden");
    return (data as SeccionRow[]) ?? [];
  } catch {
    return [];
  }
}

export async function getSeccionById(id: string): Promise<SeccionRow | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("secciones_sitio").select("*").eq("id", id).maybeSingle();
    return (data as SeccionRow | null) ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Beneficios
// ---------------------------------------------------------------------------
export type BeneficioRow = {
  id: string;
  titulo: string;
  descripcion: string | null;
  icono: string | null;
  imagen_url: string | null;
  orden: number;
  activo: boolean;
};

export async function getBeneficiosAdmin(): Promise<BeneficioRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("beneficios").select("*").order("orden");
    return (data as BeneficioRow[]) ?? [];
  } catch {
    return [];
  }
}

export async function getBeneficioById(id: string): Promise<BeneficioRow | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("beneficios").select("*").eq("id", id).maybeSingle();
    return (data as BeneficioRow | null) ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Testimonios
// ---------------------------------------------------------------------------
export type TestimonioRow = {
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

export async function getTestimoniosAdmin(): Promise<TestimonioRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("testimonios").select("*").order("orden");
    return (data as TestimonioRow[]) ?? [];
  } catch {
    return [];
  }
}

export async function getTestimonioById(id: string): Promise<TestimonioRow | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("testimonios").select("*").eq("id", id).maybeSingle();
    return (data as TestimonioRow | null) ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Pedidos
// ---------------------------------------------------------------------------
export type PedidoLista = {
  id: string;
  numero: string;
  nombre_cliente: string;
  telefono_cliente: string;
  estado: string;
  estado_pago: string;
  total: number;
  metodo_entrega: string | null;
  creado_en: string;
};

export type PedidoItem = {
  nombre_producto: string;
  descripcion_variante: string | null;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
};

export type PedidoHistorial = {
  estado_anterior: string | null;
  estado_nuevo: string;
  comentario: string | null;
  creado_en: string;
};

export type PedidoDetalle = {
  id: string;
  numero: string;
  nombre_cliente: string;
  telefono_cliente: string;
  email_cliente: string | null;
  ciudad: string | null;
  barrio: string | null;
  direccion_entrega: string | null;
  referencia_entrega: string | null;
  estado: string;
  estado_pago: string;
  metodo_pago: string | null;
  metodo_entrega: string | null;
  subtotal: number;
  descuento: number;
  costo_envio: number;
  total: number;
  observaciones_cliente: string | null;
  observaciones_internas: string | null;
  creado_en: string;
  items: PedidoItem[];
  historial: PedidoHistorial[];
};

export const PAGINA_PEDIDOS = 15;

export async function getPedidosAdmin(opts: {
  q?: string;
  estado?: string;
  estadoPago?: string;
  page?: number;
}): Promise<{ rows: PedidoLista[]; total: number }> {
  try {
    const supabase = await createClient();
    const page = Math.max(1, opts.page ?? 1);
    const desde = (page - 1) * PAGINA_PEDIDOS;

    let query = supabase
      .from("pedidos")
      .select("id, numero, nombre_cliente, telefono_cliente, estado, estado_pago, total, metodo_entrega, creado_en", { count: "exact" })
      .order("creado_en", { ascending: false })
      .range(desde, desde + PAGINA_PEDIDOS - 1);

    if (opts.q) query = query.or(`numero.ilike.%${opts.q}%,nombre_cliente.ilike.%${opts.q}%,telefono_cliente.ilike.%${opts.q}%`);
    if (opts.estado && opts.estado !== "todos") query = query.eq("estado", opts.estado);
    if (opts.estadoPago && opts.estadoPago !== "todos") query = query.eq("estado_pago", opts.estadoPago);

    const { data, count } = await query;
    return { rows: (data as PedidoLista[]) ?? [], total: count ?? 0 };
  } catch {
    return { rows: [], total: 0 };
  }
}

export async function getPedidoAdmin(id: string): Promise<PedidoDetalle | null> {
  try {
    const supabase = await createClient();
    const { data: pedido } = await supabase.from("pedidos").select("*").eq("id", id).maybeSingle();
    if (!pedido) return null;
    const [{ data: items }, { data: historial }] = await Promise.all([
      supabase.from("pedido_items").select("nombre_producto, descripcion_variante, cantidad, precio_unitario, subtotal").eq("pedido_id", id),
      supabase.from("pedido_historial").select("estado_anterior, estado_nuevo, comentario, creado_en").eq("pedido_id", id).order("creado_en", { ascending: false }),
    ]);
    return {
      ...(pedido as Omit<PedidoDetalle, "items" | "historial">),
      items: (items as PedidoItem[]) ?? [],
      historial: (historial as PedidoHistorial[]) ?? [],
    };
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Clientes
// ---------------------------------------------------------------------------
export type ClienteLista = {
  id: string;
  nombre: string;
  apellido: string | null;
  telefono: string;
  email: string | null;
  ciudad: string | null;
  activo: boolean;
};

export type ClienteDetalle = ClienteLista & {
  barrio: string | null;
  direccion: string | null;
  referencia: string | null;
  documento: string | null;
  notas: string | null;
  creado_en: string;
  pedidos: { id: string; numero: string; estado: string; total: number; creado_en: string }[];
  totalComprado: number;
};

export const PAGINA_CLIENTES = 15;

export async function getClientesAdmin(opts: { q?: string; page?: number }): Promise<{ rows: ClienteLista[]; total: number }> {
  try {
    const supabase = await createClient();
    const page = Math.max(1, opts.page ?? 1);
    const desde = (page - 1) * PAGINA_CLIENTES;
    let query = supabase
      .from("clientes")
      .select("id, nombre, apellido, telefono, email, ciudad, activo", { count: "exact" })
      .order("creado_en", { ascending: false })
      .range(desde, desde + PAGINA_CLIENTES - 1);
    if (opts.q) query = query.or(`nombre.ilike.%${opts.q}%,telefono.ilike.%${opts.q}%,email.ilike.%${opts.q}%`);
    const { data, count } = await query;
    return { rows: (data as ClienteLista[]) ?? [], total: count ?? 0 };
  } catch {
    return { rows: [], total: 0 };
  }
}

// ---------------------------------------------------------------------------
// Cupones
// ---------------------------------------------------------------------------
export type CuponRow = {
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

export async function getCuponesAdmin(): Promise<CuponRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("cupones").select("*").order("creado_en", { ascending: false });
    return (data as CuponRow[]) ?? [];
  } catch {
    return [];
  }
}

export async function getCuponById(id: string): Promise<CuponRow | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("cupones").select("*").eq("id", id).maybeSingle();
    return (data as CuponRow | null) ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Banners
// ---------------------------------------------------------------------------
export type BannerRow = {
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

export async function getBannersAdmin(): Promise<BannerRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("banners").select("*").order("orden");
    return (data as BannerRow[]) ?? [];
  } catch {
    return [];
  }
}

export async function getBannerById(id: string): Promise<BannerRow | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("banners").select("*").eq("id", id).maybeSingle();
    return (data as BannerRow | null) ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Recetas
// ---------------------------------------------------------------------------
export type RecetaRow = {
  id: string;
  titulo: string;
  slug: string;
  descripcion_corta: string | null;
  contenido: string | null;
  ingredientes: string | null;
  instrucciones: string | null;
  imagen_principal_url: string | null;
  tiempo_preparacion_minutos: number | null;
  porciones: number | null;
  dificultad: string | null;
  activa: boolean;
  destacada: boolean;
  meta_titulo: string | null;
  meta_descripcion: string | null;
};

export async function getRecetasAdmin(): Promise<RecetaRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("recetas").select("*").order("creada_en", { ascending: false });
    return (data as RecetaRow[]) ?? [];
  } catch {
    return [];
  }
}

export async function getRecetaById(id: string): Promise<RecetaRow | null> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("recetas").select("*").eq("id", id).maybeSingle();
    return (data as RecetaRow | null) ?? null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Multimedia (archivos)
// ---------------------------------------------------------------------------
export type ArchivoRow = {
  id: string;
  nombre: string;
  url: string;
  ruta_storage: string;
  mime_type: string | null;
  tamano_bytes: number | null;
  creado_en: string;
};

export async function getArchivosAdmin(): Promise<ArchivoRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("archivos")
      .select("id, nombre, url, ruta_storage, mime_type, tamano_bytes, creado_en")
      .order("creado_en", { ascending: false })
      .limit(200);
    return (data as ArchivoRow[]) ?? [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Usuarios (perfiles administrativos)
// ---------------------------------------------------------------------------
export type PerfilRow = {
  id: string;
  auth_user_id: string;
  nombre: string;
  apellido: string | null;
  email: string;
  rol: string;
  activo: boolean;
  ultimo_acceso: string | null;
  creado_en: string;
};

export async function getPerfilesAdmin(): Promise<PerfilRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("perfiles")
      .select("id, auth_user_id, nombre, apellido, email, rol, activo, ultimo_acceso, creado_en")
      .order("creado_en", { ascending: true });
    return (data as PerfilRow[]) ?? [];
  } catch {
    return [];
  }
}

// ---------------------------------------------------------------------------
// Auditoría
// ---------------------------------------------------------------------------
export type AuditoriaRow = {
  id: string;
  accion: string;
  entidad: string;
  entidad_id: string | null;
  creado_en: string;
  usuario: string | null;
};

export const PAGINA_AUDITORIA = 30;

export async function getAuditoriaAdmin(page = 1): Promise<{ rows: AuditoriaRow[]; total: number }> {
  try {
    const supabase = await createClient();
    const desde = (Math.max(1, page) - 1) * PAGINA_AUDITORIA;
    const { data, count } = await supabase
      .from("auditoria")
      .select("id, accion, entidad, entidad_id, creado_en, perfiles(nombre, email)", { count: "exact" })
      .order("creado_en", { ascending: false })
      .range(desde, desde + PAGINA_AUDITORIA - 1);
    const rows = (data ?? []).map((a) => {
      const perfil = a.perfiles as { nombre: string; email: string } | { nombre: string; email: string }[] | null;
      const info = Array.isArray(perfil) ? perfil[0] : perfil;
      return {
        id: a.id as string,
        accion: a.accion as string,
        entidad: a.entidad as string,
        entidad_id: a.entidad_id as string | null,
        creado_en: a.creado_en as string,
        usuario: info ? `${info.nombre} (${info.email})` : null,
      };
    });
    return { rows, total: count ?? 0 };
  } catch {
    return { rows: [], total: 0 };
  }
}

export async function getClienteAdmin(id: string): Promise<ClienteDetalle | null> {
  try {
    const supabase = await createClient();
    const { data: cliente } = await supabase.from("clientes").select("*").eq("id", id).maybeSingle();
    if (!cliente) return null;
    const { data: pedidos } = await supabase
      .from("pedidos")
      .select("id, numero, estado, total, creado_en")
      .eq("cliente_id", id)
      .order("creado_en", { ascending: false });
    const lista = (pedidos as { id: string; numero: string; estado: string; total: number; creado_en: string }[]) ?? [];
    const totalComprado = lista.filter((p) => p.estado !== "cancelado").reduce((s, p) => s + (p.total ?? 0), 0);
    return { ...(cliente as ClienteLista & Record<string, unknown>), pedidos: lista, totalComprado } as ClienteDetalle;
  } catch {
    return null;
  }
}
