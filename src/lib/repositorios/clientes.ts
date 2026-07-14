// Repositorio tipado de Clientes (lecturas/escrituras vía Supabase browser + RLS).
// Espeja las consultas de admin-datos (getClientesAdmin / getClienteAdmin).
// Los componentes importan `clientesRepo`; nunca llaman a Supabase directo.
import { getSupabase } from "@/lib/supabase/browser";
import { ok, fallo, type Lista, type Resultado } from "@/lib/crud/tipos";

// --- Tipos del módulo ---
export type Cliente = {
  id: string;
  nombre: string;
  apellido: string | null;
  telefono: string;
  email: string | null;
  ciudad: string | null;
  barrio: string | null;
  direccion: string | null;
  referencia: string | null;
  documento: string | null;
  notas: string | null;
  activo: boolean;
  creado_en: string;
};

export type ClienteLista = {
  id: string;
  nombre: string;
  apellido: string | null;
  telefono: string;
  email: string | null;
  ciudad: string | null;
  activo: boolean;
};

export type PedidoDeCliente = {
  id: string;
  numero: string;
  estado: string;
  total: number;
  creado_en: string;
};

export type ClienteDetalle = ClienteLista & {
  barrio: string | null;
  direccion: string | null;
  referencia: string | null;
  documento: string | null;
  notas: string | null;
  creado_en: string;
  pedidos: PedidoDeCliente[];
  totalComprado: number;
};

export const PAGINA_CLIENTES = 15;

export const clientesRepo = {
  pageSize: PAGINA_CLIENTES,

  /** Listado paginado con búsqueda multi-campo (nombre/telefono/email). */
  async listar(opts: { q?: string; page?: number } = {}): Promise<Lista<ClienteLista>> {
    try {
      const supabase = getSupabase();
      const page = Math.max(1, opts.page ?? 1);
      const desde = (page - 1) * PAGINA_CLIENTES;
      let query = supabase
        .from("clientes")
        .select("id, nombre, apellido, telefono, email, ciudad, activo", { count: "exact" })
        .order("creado_en", { ascending: false })
        .range(desde, desde + PAGINA_CLIENTES - 1);
      if (opts.q) {
        query = query.or(`nombre.ilike.%${opts.q}%,telefono.ilike.%${opts.q}%,email.ilike.%${opts.q}%`);
      }
      const { data, count } = await query;
      return { rows: (data as ClienteLista[]) ?? [], total: count ?? 0 };
    } catch {
      return { rows: [], total: 0 };
    }
  },

  /** Detalle: cliente + sus pedidos + total comprado (excluye cancelados). */
  async obtenerDetalle(id: string): Promise<ClienteDetalle | null> {
    try {
      const supabase = getSupabase();
      const { data: cliente } = await supabase.from("clientes").select("*").eq("id", id).maybeSingle();
      if (!cliente) return null;
      const { data: pedidos } = await supabase
        .from("pedidos")
        .select("id, numero, estado, total, creado_en")
        .eq("cliente_id", id)
        .order("creado_en", { ascending: false });
      const lista = (pedidos as PedidoDeCliente[]) ?? [];
      const totalComprado = lista
        .filter((p) => p.estado !== "cancelado")
        .reduce((s, p) => s + (p.total ?? 0), 0);
      return { ...(cliente as ClienteLista & Record<string, unknown>), pedidos: lista, totalComprado } as ClienteDetalle;
    } catch {
      return null;
    }
  },

  async alternarActivo(id: string, activo: boolean): Promise<Resultado> {
    const supabase = getSupabase();
    const { error } = await supabase.from("clientes").update({ activo }).eq("id", id);
    if (error) return fallo(error.message);
    return ok(undefined);
  },

  async guardarNota(id: string, nota: string): Promise<Resultado> {
    const supabase = getSupabase();
    const { error } = await supabase.from("clientes").update({ notas: nota || null }).eq("id", id);
    if (error) return fallo(error.message);
    return ok(undefined);
  },
};
