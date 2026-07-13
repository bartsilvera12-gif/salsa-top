"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { recetaSchema } from "@/lib/schemas";

type Resultado = { error: string } | void;
const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

export async function guardarReceta(id: string | null, input: unknown): Promise<Resultado> {
  await requirePerfil(CONTENIDO);
  const parsed = recetaSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const d = parsed.data;
  const supabase = await createClient();

  const payload = {
    titulo: d.titulo,
    slug: d.slug,
    descripcion_corta: nn(d.descripcion_corta),
    contenido: nn(d.contenido),
    ingredientes: nn(d.ingredientes),
    instrucciones: nn(d.instrucciones),
    imagen_principal_url: nn(d.imagen_principal_url),
    tiempo_preparacion_minutos: d.tiempo_preparacion_minutos,
    porciones: d.porciones,
    dificultad: nn(d.dificultad),
    activa: d.activa,
    destacada: d.destacada,
    meta_titulo: nn(d.meta_titulo),
    meta_descripcion: nn(d.meta_descripcion),
  };

  if (id) {
    const { error } = await supabase.from("recetas").update(payload).eq("id", id);
    if (error) return { error: error.message.includes("recetas_slug") ? "Ya existe una receta con ese slug." : error.message };
  } else {
    const { error } = await supabase.from("recetas").insert(payload);
    if (error) return { error: error.message.includes("recetas_slug") ? "Ya existe una receta con ese slug." : error.message };
  }

  revalidatePath("/admin/recetas");
  revalidatePath("/recetas");
  redirect("/admin/recetas");
}

export async function alternarActivaReceta(id: string, activa: boolean): Promise<void> {
  await requirePerfil(CONTENIDO);
  const supabase = await createClient();
  await supabase.from("recetas").update({ activa }).eq("id", id);
  revalidatePath("/admin/recetas");
  revalidatePath("/recetas");
}

export async function eliminarReceta(id: string): Promise<void> {
  await requirePerfil(CONTENIDO);
  const supabase = await createClient();
  await supabase.from("recetas").delete().eq("id", id);
  revalidatePath("/admin/recetas");
  revalidatePath("/recetas");
}
