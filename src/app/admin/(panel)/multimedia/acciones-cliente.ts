// Capa de servicio de Multimedia: registra en la tabla `archivos` un archivo
// ya subido a Storage por el cliente, y elimina archivo + registro.
// Sin service_role, sin server actions; seguridad por RLS + policies de Storage.
import { archivosRepo } from "@/lib/repositorios/archivos";
import { getSupabase } from "@/lib/supabase/browser";

type Resultado = { ok: true } | { error: string };

export async function registrarArchivoCliente(input: {
  nombre: string;
  url: string;
  ruta_storage: string;
  mime_type: string | null;
  tamano_bytes: number | null;
}): Promise<Resultado> {
  const supabase = getSupabase();
  const { data: perfil } = await supabase.rpc("obtener_perfil_actual");
  const r = await archivosRepo.crear({
    nombre: input.nombre,
    url: input.url,
    ruta_storage: input.ruta_storage,
    mime_type: input.mime_type,
    tamano_bytes: input.tamano_bytes,
    tipo: "imagen",
    usuario_id: (perfil as { id?: string } | null)?.id ?? null,
  });
  return r.ok ? { ok: true } : { error: r.error };
}

export async function eliminarArchivoCliente(
  id: string,
  rutaStorage: string,
  bucket = "saltatop-general",
): Promise<Resultado> {
  const supabase = getSupabase();
  await supabase.storage.from(bucket).remove([rutaStorage]);
  const r = await archivosRepo.eliminarRegistro(id);
  return r.ok ? { ok: true } : { error: r.error };
}
