"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { testimonioSchema } from "@/lib/schemas";

type Resultado = { error: string } | void;
const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

export async function guardarTestimonio(id: string | null, input: unknown): Promise<Resultado> {
  await requirePerfil(CONTENIDO);
  const parsed = testimonioSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const d = parsed.data;
  const supabase = await createClient();

  const payload = {
    nombre_cliente: d.nombre_cliente,
    cargo_o_descripcion: nn(d.cargo_o_descripcion),
    comentario: d.comentario,
    calificacion: d.calificacion,
    imagen_url: nn(d.imagen_url),
    destacado: d.destacado,
    aprobado: d.aprobado,
    orden: d.orden,
  };

  if (id) {
    const { error } = await supabase.from("testimonios").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("testimonios").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/testimonios");
  revalidatePath("/");
  redirect("/admin/testimonios");
}

export async function alternarAprobadoTestimonio(id: string, aprobado: boolean): Promise<void> {
  await requirePerfil(CONTENIDO);
  const supabase = await createClient();
  await supabase.from("testimonios").update({ aprobado }).eq("id", id);
  revalidatePath("/admin/testimonios");
  revalidatePath("/");
}

export async function eliminarTestimonio(id: string): Promise<void> {
  await requirePerfil(CONTENIDO);
  const supabase = await createClient();
  await supabase.from("testimonios").delete().eq("id", id);
  revalidatePath("/admin/testimonios");
  revalidatePath("/");
}
