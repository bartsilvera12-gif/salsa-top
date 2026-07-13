"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePerfil } from "@/lib/auth";
import { ADMIN } from "@/lib/permisos";
import { cuponSchema } from "@/lib/schemas";

type Resultado = { error: string } | void;
const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

export async function guardarCupon(id: string | null, input: unknown): Promise<Resultado> {
  await requirePerfil(ADMIN);
  const parsed = cuponSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const d = parsed.data;
  const supabase = await createClient();

  const payload = {
    codigo: d.codigo.trim().toUpperCase(),
    descripcion: nn(d.descripcion),
    tipo_descuento: d.tipo_descuento,
    valor: d.valor,
    compra_minima: d.compra_minima,
    limite_usos: d.limite_usos,
    limite_por_cliente: d.limite_por_cliente,
    fecha_inicio: nn(d.fecha_inicio),
    fecha_fin: nn(d.fecha_fin),
    activo: d.activo,
  };

  if (id) {
    const { error } = await supabase.from("cupones").update(payload).eq("id", id);
    if (error) return { error: error.message.includes("codigo") ? "Ya existe un cupón con ese código." : error.message };
  } else {
    const { error } = await supabase.from("cupones").insert(payload);
    if (error) return { error: error.message.includes("codigo") ? "Ya existe un cupón con ese código." : error.message };
  }

  revalidatePath("/admin/cupones");
  redirect("/admin/cupones");
}

export async function alternarActivoCupon(id: string, activo: boolean): Promise<void> {
  await requirePerfil(ADMIN);
  const supabase = await createClient();
  await supabase.from("cupones").update({ activo }).eq("id", id);
  revalidatePath("/admin/cupones");
}

export async function eliminarCupon(id: string): Promise<void> {
  await requirePerfil(ADMIN);
  const supabase = await createClient();
  await supabase.from("cupones").delete().eq("id", id);
  revalidatePath("/admin/cupones");
}
