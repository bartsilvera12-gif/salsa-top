// Capa de servicio de Categorías: valida (zod) y escribe vía el repositorio
// tipado (sobre crearCrud). Seguridad por RLS (mismas políticas admin).
// Sin service_role, sin server actions.
import { categoriasRepo } from "@/lib/repositorios/categorias";
import { categoriaSchema } from "@/lib/schemas";

type Resultado = { ok: true } | { error: string };

const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

export async function guardarCategoriaCliente(id: string | null, input: unknown): Promise<Resultado> {
  const parsed = categoriaSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

  const payload = {
    nombre: d.nombre,
    slug: d.slug,
    descripcion: nn(d.descripcion),
    imagen_url: nn(d.imagen_url),
    icono: nn(d.icono),
    color: nn(d.color),
    orden: d.orden,
    activa: d.activa,
  };

  if (id) {
    const r = await categoriasRepo.actualizar(id, payload);
    if (!r.ok) return { error: r.error };
  } else {
    const r = await categoriasRepo.crear(payload);
    if (!r.ok) return { error: r.error };
  }
  return { ok: true };
}

export async function alternarActivaCategoriaCliente(id: string, activa: boolean): Promise<Resultado> {
  const r = await categoriasRepo.alternarActiva(id, activa);
  return r.ok ? { ok: true } : { error: r.error };
}

export async function eliminarCategoriaCliente(id: string): Promise<Resultado> {
  // Regla de negocio: no se elimina una categoría con productos asociados.
  const n = await categoriasRepo.contarProductos(id);
  if (n > 0) {
    return { error: "No se puede eliminar: la categoría tiene productos asociados." };
  }
  const r = await categoriasRepo.eliminar(id);
  return r.ok ? { ok: true } : { error: r.error };
}
