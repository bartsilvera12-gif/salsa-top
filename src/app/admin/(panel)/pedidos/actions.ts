"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePerfil } from "@/lib/auth";
import { OPERACIONES } from "@/lib/permisos";

const ESTADOS = ["pendiente", "confirmado", "preparando", "listo", "enviado", "entregado", "cancelado"];
const ESTADOS_PAGO = ["pendiente", "pagado", "rechazado", "reembolsado"];

export async function cambiarEstadoPedido(id: string, estado: string): Promise<void> {
  await requirePerfil(OPERACIONES);
  if (!ESTADOS.includes(estado)) return;
  const supabase = await createClient();
  // Los triggers gestionan timestamps, stock e historial automáticamente.
  await supabase.from("pedidos").update({ estado }).eq("id", id);
  revalidatePath(`/admin/pedidos/${id}`);
  revalidatePath("/admin/pedidos");
}

export async function cambiarEstadoPago(id: string, estado_pago: string): Promise<void> {
  await requirePerfil(OPERACIONES);
  if (!ESTADOS_PAGO.includes(estado_pago)) return;
  const supabase = await createClient();
  await supabase.from("pedidos").update({ estado_pago }).eq("id", id);
  revalidatePath(`/admin/pedidos/${id}`);
  revalidatePath("/admin/pedidos");
}

export async function guardarNotaInterna(id: string, nota: string): Promise<{ ok: true }> {
  await requirePerfil(OPERACIONES);
  const supabase = await createClient();
  await supabase.from("pedidos").update({ observaciones_internas: nota || null }).eq("id", id);
  revalidatePath(`/admin/pedidos/${id}`);
  return { ok: true };
}
