// Capa de servicio de Banners: valida (zod) y escribe vía el repositorio
// tipado. Sin service_role, sin server actions; seguridad por RLS.
import { bannersRepo } from "@/lib/repositorios/banners";
import { bannerSchema } from "@/lib/schemas";

type Resultado = { ok: true } | { error: string };

const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

export async function guardarBannerCliente(id: string | null, input: unknown): Promise<Resultado> {
  const parsed = bannerSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

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
    const r = await bannersRepo.actualizar(id, payload);
    if (!r.ok) return { error: r.error };
  } else {
    const r = await bannersRepo.crear(payload);
    if (!r.ok) return { error: r.error };
  }
  return { ok: true };
}

export async function alternarActivoBannerCliente(id: string, activo: boolean): Promise<Resultado> {
  const r = await bannersRepo.alternarActivo(id, activo);
  return r.ok ? { ok: true } : { error: r.error };
}

export async function eliminarBannerCliente(id: string): Promise<Resultado> {
  const r = await bannersRepo.eliminar(id);
  return r.ok ? { ok: true } : { error: r.error };
}
