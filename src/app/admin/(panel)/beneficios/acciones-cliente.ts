// Capa de servicio de Beneficios: valida (zod) y escribe vía el repositorio
// tipado. Sin service_role, sin server actions; seguridad por RLS.
import { beneficiosRepo } from "@/lib/repositorios/beneficios";
import { beneficioSchema } from "@/lib/schemas";

type Resultado = { ok: true } | { error: string };

const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

export async function guardarBeneficioCliente(id: string | null, input: unknown): Promise<Resultado> {
  const parsed = beneficioSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

  const payload = {
    titulo: d.titulo,
    descripcion: nn(d.descripcion),
    icono: nn(d.icono),
    imagen_url: nn(d.imagen_url),
    orden: d.orden,
    activo: d.activo,
  };

  if (id) {
    const r = await beneficiosRepo.actualizar(id, payload);
    if (!r.ok) return { error: r.error };
  } else {
    const r = await beneficiosRepo.crear(payload);
    if (!r.ok) return { error: r.error };
  }
  return { ok: true };
}

export async function alternarActivoBeneficioCliente(id: string, activo: boolean): Promise<Resultado> {
  const r = await beneficiosRepo.alternarActivo(id, activo);
  return r.ok ? { ok: true } : { error: r.error };
}

export async function eliminarBeneficioCliente(id: string): Promise<Resultado> {
  const r = await beneficiosRepo.eliminar(id);
  return r.ok ? { ok: true } : { error: r.error };
}
