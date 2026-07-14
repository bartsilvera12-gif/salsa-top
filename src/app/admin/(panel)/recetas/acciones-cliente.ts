// Capa de servicio de Recetas: valida (zod) y escribe vía el repositorio
// tipado. Sin service_role, sin server actions; seguridad por RLS.
import { recetasRepo } from "@/lib/repositorios/recetas";
import { recetaSchema } from "@/lib/schemas";

type Resultado = { ok: true } | { error: string };

const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

export async function guardarRecetaCliente(id: string | null, input: unknown): Promise<Resultado> {
  const parsed = recetaSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

  const payload = {
    titulo: d.titulo,
    slug: d.slug,
    descripcion_corta: nn(d.descripcion_corta),
    contenido: nn(d.contenido),
    ingredientes: nn(d.ingredientes),
    instrucciones: nn(d.instrucciones),
    imagen_principal_url: nn(d.imagen_principal_url),
    tiempo_preparacion_minutos: d.tiempo_preparacion_minutos,
    porciones: d.porciones,
    dificultad: nn(d.dificultad),
    activa: d.activa,
    destacada: d.destacada,
    meta_titulo: nn(d.meta_titulo),
    meta_descripcion: nn(d.meta_descripcion),
  };

  if (id) {
    const r = await recetasRepo.actualizar(id, payload);
    if (!r.ok) return { error: r.error };
  } else {
    const r = await recetasRepo.crear(payload);
    if (!r.ok) return { error: r.error };
  }
  return { ok: true };
}

export async function alternarActivaRecetaCliente(id: string, activa: boolean): Promise<Resultado> {
  const r = await recetasRepo.alternarActiva(id, activa);
  return r.ok ? { ok: true } : { error: r.error };
}

export async function eliminarRecetaCliente(id: string): Promise<Resultado> {
  const r = await recetasRepo.eliminar(id);
  return r.ok ? { ok: true } : { error: r.error };
}
