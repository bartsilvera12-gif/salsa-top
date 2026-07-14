// Capa de servicio de Cupones: valida (zod) y escribe vía el repositorio
// tipado. Sin service_role, sin server actions; seguridad por RLS.
import { cuponesRepo } from "@/lib/repositorios/cupones";
import { cuponSchema } from "@/lib/schemas";

type Resultado = { ok: true } | { error: string };

const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

export async function guardarCuponCliente(id: string | null, input: unknown): Promise<Resultado> {
  const parsed = cuponSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

  const payload = {
    codigo: d.codigo.trim().toUpperCase(),
    descripcion: nn(d.descripcion),
    tipo_descuento: d.tipo_descuento,
    valor: d.valor,
    compra_minima: d.compra_minima,
    limite_usos: d.limite_usos,
    limite_por_cliente: d.limite_por_cliente,
    fecha_inicio: nn(d.fecha_inicio),
    fecha_fin: nn(d.fecha_fin),
    activo: d.activo,
  };

  if (id) {
    const r = await cuponesRepo.actualizar(id, payload);
    if (!r.ok) return { error: r.error };
  } else {
    const r = await cuponesRepo.crear(payload);
    if (!r.ok) return { error: r.error };
  }
  return { ok: true };
}

export async function alternarActivoCuponCliente(id: string, activo: boolean): Promise<Resultado> {
  const r = await cuponesRepo.alternarActivo(id, activo);
  return r.ok ? { ok: true } : { error: r.error };
}

export async function eliminarCuponCliente(id: string): Promise<Resultado> {
  const r = await cuponesRepo.eliminar(id);
  return r.ok ? { ok: true } : { error: r.error };
}
