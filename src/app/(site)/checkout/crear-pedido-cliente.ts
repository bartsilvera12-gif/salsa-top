// Crea el pedido llamando a la RPC segura saltatop.crear_pedido DESDE EL NAVEGADOR.
// - El cliente browser usa la anon key; la RPC tiene GRANT EXECUTE a anon/authenticated.
// - La RPC es SECURITY DEFINER y recalcula precios/total dentro de PostgreSQL:
//   el frontend NO envía precios ni total (solo producto_id, cantidad y datos del cliente).
// Reemplaza al server action crearPedidoAction (mismo contrato y comportamiento).
import { getSupabase } from "@/lib/supabase/browser";

export type ClientePedido = {
  nombre: string;
  apellido?: string;
  telefono: string;
  email?: string;
  documento?: string;
  ciudad?: string;
  barrio?: string;
  direccion?: string;
  referencia?: string;
};

export type ItemPedido = {
  producto_id: string;
  variante_id?: string | null;
  cantidad: number;
};

export type EntradaPedido = {
  cliente: ClientePedido;
  items: ItemPedido[];
  metodoEntrega?: string;
  metodoPago?: string;
  cupon?: string;
  observaciones?: string;
};

export type RespuestaPedido =
  | { ok: true; numero: string; total: number }
  | { ok: false; error: string };

export async function crearPedidoCliente(input: EntradaPedido): Promise<RespuestaPedido> {
  if (!input.items || input.items.length === 0) return { ok: false, error: "El carrito está vacío." };
  if (!input.cliente?.nombre || !input.cliente?.telefono) {
    return { ok: false, error: "Completá tu nombre y teléfono." };
  }

  const supabase = getSupabase();
  const { data, error } = await supabase.rpc("crear_pedido", {
    p_cliente: input.cliente,
    p_items: input.items,
    p_metodo_entrega: input.metodoEntrega ?? null,
    p_metodo_pago: input.metodoPago ?? null,
    p_cupon_codigo: input.cupon ?? null,
    p_observaciones: input.observaciones ?? null,
  });

  if (error) return { ok: false, error: error.message };
  const r = data as { numero: string; total: number };
  return { ok: true, numero: r.numero, total: r.total };
}
