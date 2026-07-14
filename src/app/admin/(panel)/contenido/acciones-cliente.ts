// Capa de servicio de Secciones: valida (zod) y escribe vía el repositorio
// tipado. Sin service_role, sin server actions; seguridad por RLS.
import { seccionesRepo } from "@/lib/repositorios/secciones";
import { seccionSchema } from "@/lib/schemas";

type Resultado = { ok: true } | { error: string };

const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

export async function guardarSeccionCliente(id: string | null, input: unknown): Promise<Resultado> {
  const parsed = seccionSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

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
    const r = await seccionesRepo.actualizar(id, payload);
    if (!r.ok) return { error: r.error };
  } else {
    const r = await seccionesRepo.crear(payload);
    if (!r.ok) return { error: r.error };
  }
  return { ok: true };
}

export async function alternarActivaSeccionCliente(id: string, activa: boolean): Promise<Resultado> {
  const r = await seccionesRepo.alternarActiva(id, activa);
  return r.ok ? { ok: true } : { error: r.error };
}
