// Subida de imágenes a Supabase Storage desde el navegador.
// El cliente browser está autenticado con la sesión del admin (SesionProvider),
// por lo que la subida pasa las policies RLS de Storage (rol admin). Reemplaza al
// server action `subirImagen` (obsoleto: asumía que el navegador no tenía sesión).
import { getSupabase } from "@/lib/supabase/browser";
import { slugify } from "@/lib/utils";

const BUCKETS_PERMITIDOS = [
  "saltatop-productos",
  "saltatop-banners",
  "saltatop-contenido",
  "saltatop-recetas",
  "saltatop-general",
];

export async function subirImagenCliente(
  file: File,
  bucket = "saltatop-productos",
  carpeta = "productos",
): Promise<{ url: string } | { error: string }> {
  if (!(file instanceof File) || file.size === 0) return { error: "No se recibió el archivo." };
  if (!BUCKETS_PERMITIDOS.includes(bucket)) return { error: "Bucket no permitido." };
  if (!file.type.startsWith("image/")) return { error: "El archivo debe ser una imagen." };
  if (file.size > 5 * 1024 * 1024) return { error: "La imagen no puede superar 5 MB." };

  const supabase = getSupabase();
  const ext = file.name.split(".").pop() ?? "jpg";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "imagen";
  const path = `${carpeta}/${Date.now()}-${base}.${ext}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (error) return { error: error.message };

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
}
