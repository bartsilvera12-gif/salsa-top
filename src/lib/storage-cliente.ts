// Subida de imágenes a Supabase Storage desde el navegador.
//
// NOTA IMPORTANTE: se usa un `fetch` directo en vez de `supabase.storage.upload()`
// porque el gateway (self-hosted) NO permite en CORS las cabeceras `x-upsert` ni
// `cache-control` que envía el SDK. Eso hacía fallar el preflight con
// "Failed to fetch". Este fetch solo manda cabeceras permitidas (Authorization,
// apikey, Content-Type), por lo que el preflight pasa y la subida funciona.
// La sesión del admin (SesionProvider) aporta el token → cumple las policies RLS.
import { getSupabase } from "@/lib/supabase/browser";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/lib/env";
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
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { error: "Sesión no válida. Iniciá sesión de nuevo e intentá otra vez." };

  const ext = file.name.split(".").pop() ?? "jpg";
  const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "imagen";
  const path = `${carpeta}/${Date.now()}-${base}.${ext}`;

  try {
    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/${bucket}/${encodeURI(path)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          apikey: SUPABASE_ANON_KEY,
          "Content-Type": file.type,
        },
        body: file,
      },
    );
    if (!res.ok) {
      const err = (await res.json().catch(() => null)) as { message?: string } | null;
      return { error: err?.message || `No se pudo subir la imagen (error ${res.status}).` };
    }
  } catch {
    return { error: "No se pudo subir la imagen (fallo de red)." };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
}
