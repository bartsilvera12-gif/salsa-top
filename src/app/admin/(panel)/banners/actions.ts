"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { bannerSchema } from "@/lib/schemas";

type Resultado = { error: string } | void;
const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

export async function guardarBanner(id: string | null, input: unknown): Promise<Resultado> {
  await requirePerfil(CONTENIDO);
  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const d = parsed.data;
  const supabase = await createClient();

  const payload = {
    titulo: nn(d.titulo),
    subtitulo: nn(d.subtitulo),
    descripcion: nn(d.descripcion),
    imagen_desktop_url: nn(d.imagen_desktop_url),
    imagen_mobile_url: nn(d.imagen_mobile_url),
    texto_boton: nn(d.texto_boton),
    enlace_boton: nn(d.enlace_boton),
    color_texto: nn(d.color_texto),
    color_fondo: nn(d.color_fondo),
    overlay: d.overlay,
    orden: d.orden,
    activo: d.activo,
    fecha_inicio: nn(d.fecha_inicio),
    fecha_fin: nn(d.fecha_fin),
  };

  if (id) {
    const { error } = await supabase.from("banners").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("banners").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
  redirect("/admin/banners");
}

export async function alternarActivoBanner(id: string, activo: boolean): Promise<void> {
  await requirePerfil(CONTENIDO);
  const supabase = await createClient();
  await supabase.from("banners").update({ activo }).eq("id", id);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function eliminarBanner(id: string): Promise<void> {
  await requirePerfil(CONTENIDO);
  const supabase = await createClient();
  await supabase.from("banners").delete().eq("id", id);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}
