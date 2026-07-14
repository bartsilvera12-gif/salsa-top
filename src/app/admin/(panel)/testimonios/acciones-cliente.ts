// Capa de servicio de Testimonios: valida (zod) y escribe vía el repositorio
// tipado. Sin service_role, sin server actions; seguridad por RLS.
import { testimoniosRepo } from "@/lib/repositorios/testimonios";
import { testimonioSchema } from "@/lib/schemas";

type Resultado = { ok: true } | { error: string };

const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

export async function guardarTestimonioCliente(id: string | null, input: unknown): Promise<Resultado> {
  const parsed = testimonioSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

  const payload = {
    nombre_cliente: d.nombre_cliente,
    cargo_o_descripcion: nn(d.cargo_o_descripcion),
    comentario: d.comentario,
    calificacion: d.calificacion,
    imagen_url: nn(d.imagen_url),
    destacado: d.destacado,
    aprobado: d.aprobado,
    orden: d.orden,
  };

  if (id) {
    const r = await testimoniosRepo.actualizar(id, payload);
    if (!r.ok) return { error: r.error };
  } else {
    const r = await testimoniosRepo.crear(payload);
    if (!r.ok) return { error: r.error };
  }
  return { ok: true };
}

export async function alternarAprobadoTestimonioCliente(id: string, aprobado: boolean): Promise<Resultado> {
  const r = await testimoniosRepo.alternarAprobado(id, aprobado);
  return r.ok ? { ok: true } : { error: r.error };
}

export async function eliminarTestimonioCliente(id: string): Promise<Resultado> {
  const r = await testimoniosRepo.eliminar(id);
  return r.ok ? { ok: true } : { error: r.error };
}
