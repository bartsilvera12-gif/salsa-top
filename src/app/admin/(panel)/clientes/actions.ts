"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePerfil } from "@/lib/auth";
import { OPERACIONES } from "@/lib/permisos";

export async function alternarActivoCliente(id: string, activo: boolean): Promise<void> {
  await requirePerfil(OPERACIONES);
  const supabase = await createClient();
  await supabase.from("clientes").update({ activo }).eq("id", id);
  revalidatePath(`/admin/clientes/${id}`);
  revalidatePath("/admin/clientes");
}

export async function guardarNotaCliente(id: string, nota: string): Promise<{ ok: true }> {
  await requirePerfil(OPERACIONES);
  const supabase = await createClient();
  await supabase.from("clientes").update({ notas: nota || null }).eq("id", id);
  revalidatePath(`/admin/clientes/${id}`);
  return { ok: true };
}
