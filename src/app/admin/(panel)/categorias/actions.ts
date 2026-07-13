"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { categoriaSchema } from "@/lib/schemas";
import { contarProductosDeCategoria } from "@/lib/admin-datos";

type Resultado = { error: string } | void;
const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

export async function guardarCategoria(id: string | null, input: unknown): Promise<Resultado> {
  await requirePerfil(CONTENIDO);
  const parsed = categoriaSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const d = parsed.data;
  const supabase = await createClient();

  const payload = {
    nombre: d.nombre,
    slug: d.slug,
    descripcion: nn(d.descripcion),
    imagen_url: nn(d.imagen_url),
    icono: nn(d.icono),
    color: nn(d.color),
    orden: d.orden,
    activa: d.activa,
  };

  if (id) {
    const { error } = await supabase.from("categorias").update(payload).eq("id", id);
    if (error) return { error: error.message.includes("categorias_slug") ? "Ya existe una categoría con ese slug." : error.message };
  } else {
    const { error } = await supabase.from("categorias").insert(payload);
    if (error) return { error: error.message.includes("categorias_slug") ? "Ya existe una categoría con ese slug." : error.message };
  }

  revalidatePath("/admin/categorias");
  redirect("/admin/categorias");
}

export async function alternarActivaCategoria(id: string, activa: boolean): Promise<void> {
  await requirePerfil(CONTENIDO);
  const supabase = await createClient();
  await supabase.from("categorias").update({ activa }).eq("id", id);
  revalidatePath("/admin/categorias");
}

export async function eliminarCategoria(id: string): Promise<void> {
  await requirePerfil(CONTENIDO);
  // No eliminar si tiene productos asociados.
  const n = await contarProductosDeCategoria(id);
  if (n > 0) return;
  const supabase = await createClient();
  await supabase.from("categorias").delete().eq("id", id);
  revalidatePath("/admin/categorias");
}
