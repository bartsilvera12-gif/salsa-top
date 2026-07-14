"use server";

import { createClient } from "@/lib/supabase/server";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { slugify } from "@/lib/utils";

const BUCKETS_PERMITIDOS = [
  "saltatop-productos",
  "saltatop-banners",
  "saltatop-contenido",
  "saltatop-recetas",
  "saltatop-general",
];

/**
 * Sube una imagen a Supabase Storage desde el servidor.
 *
 * Se hace en el servidor (no en el navegador) porque el cliente de servidor SÍ
 * tiene la sesión autenticada del admin (vía cookies), y así la subida pasa las
 * políticas RLS de storage (que exigen rol admin). El navegador no tenía sesión
 * válida y la subida se rechazaba con "new row violates row-level security".
 */
export async function subirImagen(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  await requirePerfil(CONTENIDO);

  const file = formData.get("file");
  const bucket = String(formData.get("bucket") ?? "saltatop-productos");
  const carpeta = String(formData.get("carpeta") ?? "productos");

  if (!(file instanceof File) || file.size === 0) {
    return { error: "No se recibió el archivo." };
  }
  if (!BUCKETS_PERMITIDOS.includes(bucket)) {
    return { error: "Bucket no permitido." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "El archivo debe ser una imagen." };
  }
  if (file.size > 5 * 1024 * 1024) {
    return { error: "La imagen no puede superar 5 MB." };
  }

  const supabase = await createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "imagen";
  const path = `${carpeta}/${Date.now()}-${base}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (error) {
    return { error: error.message };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
}
