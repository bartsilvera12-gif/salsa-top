// Capa de servicio de Configuración: valida (zod) y escribe vía el repositorio.
// Sin service_role, sin server actions; seguridad por RLS (solo admins).
import { configuracionRepo } from "@/lib/repositorios/configuracion";
import { configuracionSchema } from "@/lib/schemas";

type Resultado = { ok: true } | { error: string };

const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

export async function guardarConfiguracionCliente(id: string | null, input: unknown): Promise<Resultado> {
  const parsed = configuracionSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const d = parsed.data;

  const payload = {
    nombre_marca: d.nombre_marca,
    eslogan: nn(d.eslogan),
    descripcion_corta: nn(d.descripcion_corta),
    descripcion_larga: nn(d.descripcion_larga),
    logo_url: nn(d.logo_url),
    favicon_url: nn(d.favicon_url),
    whatsapp: nn(d.whatsapp),
    telefono: nn(d.telefono),
    email: nn(d.email),
    direccion: nn(d.direccion),
    horario_atencion: nn(d.horario_atencion),
    instagram_url: nn(d.instagram_url),
    facebook_url: nn(d.facebook_url),
    tiktok_url: nn(d.tiktok_url),
    moneda: nn(d.moneda) ?? "PYG",
    simbolo_moneda: nn(d.simbolo_moneda) ?? "Gs.",
    pais: nn(d.pais) ?? "Paraguay",
    compra_minima: d.compra_minima,
    costo_envio: d.costo_envio,
    envio_gratis_desde: d.envio_gratis_desde,
    retiro_local_habilitado: d.retiro_local_habilitado,
    pedidos_habilitados: d.pedidos_habilitados,
    mensaje_confirmacion: nn(d.mensaje_confirmacion),
    activo: true,
  };

  if (id) {
    const r = await configuracionRepo.actualizar(id, payload);
    if (!r.ok) return { error: r.error };
  } else {
    const r = await configuracionRepo.crear(payload);
    if (!r.ok) return { error: r.error };
  }
  return { ok: true };
}
