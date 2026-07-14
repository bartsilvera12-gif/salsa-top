// Escrituras de Pedidos usando el repositorio tipado (Supabase browser + RLS).
// Seguridad por RLS. Sin service_role, sin server actions, sin revalidatePath.
// Los triggers de la base gestionan timestamps, stock e historial.
import { pedidosRepo } from "@/lib/repositorios/pedidos";

type Resultado = { ok: true } | { error: string };

const ESTADOS = ["pendiente", "confirmado", "preparando", "listo", "enviado", "entregado", "cancelado"];
const ESTADOS_PAGO = ["pendiente", "pagado", "rechazado", "reembolsado"];

export async function cambiarEstadoPedido(id: string, estado: string): Promise<Resultado> {
  if (!ESTADOS.includes(estado)) return { error: "Estado inválido" };
  const r = await pedidosRepo.cambiarEstado(id, estado);
  return r.ok ? { ok: true } : { error: r.error };
}

export async function cambiarEstadoPago(id: string, estadoPago: string): Promise<Resultado> {
  if (!ESTADOS_PAGO.includes(estadoPago)) return { error: "Estado de pago inválido" };
  const r = await pedidosRepo.cambiarEstadoPago(id, estadoPago);
  return r.ok ? { ok: true } : { error: r.error };
}

export async function guardarNotaInterna(id: string, nota: string): Promise<Resultado> {
  const r = await pedidosRepo.guardarNota(id, nota);
  return r.ok ? { ok: true } : { error: r.error };
}
