// Repositorio tipado de Pedidos (cliente, sobre Supabase browser + RLS).
// El listado usa búsqueda multi-campo (numero/nombre/telefono) con `.or(...)`
// y filtros por estado / estado_pago; el detalle trae ítems + historial.
// Los updates de estado/estado_pago/observaciones son seguros desde el cliente:
// los TRIGGERS de la base gestionan timestamps, stock e historial.
import { getSupabase } from "@/lib/supabase/browser";
import type { Resultado } from "@/lib/crud/tipos";
import { ok, fallo } from "@/lib/crud/tipos";

// --- Tipos del módulo (espejan admin-datos) ---
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

export type FiltroPedidos = {
  q?: string;
  estado?: string;
  estadoPago?: string;
  page?: number;
};

// Mismo valor que admin-datos.PAGINA_PEDIDOS.
export const PAGINA_PEDIDOS = 15;

export const pedidosRepo = {
  pageSize: PAGINA_PEDIDOS,

  /** Listado paginado con búsqueda multi-campo y filtros (mismo query que getPedidosAdmin). */
  async listar(opts: FiltroPedidos = {}): Promise<{ rows: PedidoLista[]; total: number }> {
    try {
      const supabase = getSupabase();
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
  },

  /** Detalle: pedido + ítems + historial (mismo query que getPedidoAdmin). */
  async obtenerDetalle(id: string): Promise<PedidoDetalle | null> {
    try {
      const supabase = getSupabase();
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
  },

  /** Cambia el estado del pedido. Los triggers gestionan timestamps, stock e historial. */
  async cambiarEstado(id: string, estado: string): Promise<Resultado> {
    const supabase = getSupabase();
    const { error } = await supabase.from("pedidos").update({ estado }).eq("id", id);
    if (error) return fallo(error.message);
    return ok(undefined);
  },

  /** Cambia el estado de pago del pedido. */
  async cambiarEstadoPago(id: string, estadoPago: string): Promise<Resultado> {
    const supabase = getSupabase();
    const { error } = await supabase.from("pedidos").update({ estado_pago: estadoPago }).eq("id", id);
    if (error) return fallo(error.message);
    return ok(undefined);
  },

  /** Guarda la nota interna (observaciones_internas). */
  async guardarNota(id: string, nota: string): Promise<Resultado> {
    const supabase = getSupabase();
    const { error } = await supabase.from("pedidos").update({ observaciones_internas: nota || null }).eq("id", id);
    if (error) return fallo(error.message);
    return ok(undefined);
  },
};
