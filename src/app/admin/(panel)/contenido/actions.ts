"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { seccionSchema } from "@/lib/schemas";

type Resultado = { error: string } | void;
const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

export async function guardarSeccion(id: string | null, input: unknown): Promise<Resultado> {
  await requirePerfil(CONTENIDO);
  const parsed = seccionSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const d = parsed.data;
  const supabase = await createClient();

  const payload = {
    clave: d.clave,
    titulo: nn(d.titulo),
    subtitulo: nn(d.subtitulo),
    contenido: nn(d.contenido),
    imagen_url: nn(d.imagen_url),
    imagen_mobile_url: nn(d.imagen_mobile_url),
    video_url: nn(d.video_url),
    texto_boton: nn(d.texto_boton),
    enlace_boton: nn(d.enlace_boton),
    orden: d.orden,
    activa: d.activa,
  };

  if (id) {
    const { error } = await supabase.from("secciones_sitio").update(payload).eq("id", id);
    if (error) return { error: error.message.includes("clave") ? "Ya existe una sección con esa clave." : error.message };
  } else {
    const { error } = await supabase.from("secciones_sitio").insert(payload);
    if (error) return { error: error.message.includes("clave") ? "Ya existe una sección con esa clave." : error.message };
  }

  revalidatePath("/admin/contenido");
  revalidatePath("/");
  redirect("/admin/contenido");
}

export async function alternarActivaSeccion(id: string, activa: boolean): Promise<void> {
  await requirePerfil(CONTENIDO);
  const supabase = await createClient();
  await supabase.from("secciones_sitio").update({ activa }).eq("id", id);
  revalidatePath("/admin/contenido");
  revalidatePath("/");
}
