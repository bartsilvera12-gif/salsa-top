"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { beneficioSchema } from "@/lib/schemas";

type Resultado = { error: string } | void;
const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

export async function guardarBeneficio(id: string | null, input: unknown): Promise<Resultado> {
  await requirePerfil(CONTENIDO);
  const parsed = beneficioSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const d = parsed.data;
  const supabase = await createClient();

  const payload = {
    titulo: d.titulo,
    descripcion: nn(d.descripcion),
    icono: nn(d.icono),
    imagen_url: nn(d.imagen_url),
    orden: d.orden,
    activo: d.activo,
  };

  if (id) {
    const { error } = await supabase.from("beneficios").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("beneficios").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/beneficios");
  revalidatePath("/");
  redirect("/admin/beneficios");
}

export async function alternarActivoBeneficio(id: string, activo: boolean): Promise<void> {
  await requirePerfil(CONTENIDO);
  const supabase = await createClient();
  await supabase.from("beneficios").update({ activo }).eq("id", id);
  revalidatePath("/admin/beneficios");
  revalidatePath("/");
}

export async function eliminarBeneficio(id: string): Promise<void> {
  await requirePerfil(CONTENIDO);
  const supabase = await createClient();
  await supabase.from("beneficios").delete().eq("id", id);
  revalidatePath("/admin/beneficios");
  revalidatePath("/");
}
