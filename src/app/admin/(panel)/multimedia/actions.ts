"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";

/** Registra en la tabla `archivos` un archivo ya subido a Storage por el cliente. */
export async function registrarArchivo(input: {
  nombre: string;
  url: string;
  ruta_storage: string;
  mime_type: string | null;
  tamano_bytes: number | null;
}): Promise<{ ok: true } | { error: string }> {
  await requirePerfil(CONTENIDO);
  const supabase = await createClient();
  const { data: perfil } = await supabase.rpc("obtener_perfil_actual");
  const { error } = await supabase.from("archivos").insert({
    nombre: input.nombre,
    url: input.url,
    ruta_storage: input.ruta_storage,
    mime_type: input.mime_type,
    tamano_bytes: input.tamano_bytes,
    tipo: "imagen",
    usuario_id: (perfil as { id?: string } | null)?.id ?? null,
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/multimedia");
  return { ok: true };
}

export async function eliminarArchivo(id: string, rutaStorage: string, bucket = "saltatop-general"): Promise<void> {
  await requirePerfil(CONTENIDO);
  const supabase = await createClient();
  await supabase.storage.from(bucket).remove([rutaStorage]);
  await supabase.from("archivos").delete().eq("id", id);
  revalidatePath("/admin/multimedia");
}
