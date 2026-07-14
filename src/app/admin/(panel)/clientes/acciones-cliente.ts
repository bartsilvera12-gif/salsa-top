// Escrituras de Clientes usando el repositorio tipado.
// Seguridad por RLS. Sin service_role, sin server actions, sin revalidatePath.
import { clientesRepo } from "@/lib/repositorios/clientes";

type Resultado = { ok: true } | { error: string };

export async function alternarActivoCliente(id: string, activo: boolean): Promise<Resultado> {
  const r = await clientesRepo.alternarActivo(id, activo);
  return r.ok ? { ok: true } : { error: r.error };
}

export async function guardarNotaCliente(id: string, nota: string): Promise<{ ok: true }> {
  await clientesRepo.guardarNota(id, nota);
  return { ok: true };
}
