// Escrituras de Productos usando el repositorio tipado (sobre crearCrud).
// Seguridad por RLS (admin_all_productos). Sin service_role, sin server actions.
import { productosRepo } from "@/lib/repositorios/productos";
import { productoSchema } from "@/lib/schemas";

type Resultado = { ok: true } | { error: string };

const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

export async function guardarProductoCliente(id: string | null, input: unknown): Promise<Resultado> {
  const parsed = productoSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;

  const payload = {
    nombre: d.nombre,
    slug: d.slug,
    codigo: nn(d.codigo),
    categoria_id: d.categoria_id ?? null,
    descripcion_corta: nn(d.descripcion_corta),
    descripcion_larga: nn(d.descripcion_larga),
    ingredientes: nn(d.ingredientes),
    recomendaciones_uso: nn(d.recomendaciones_uso),
    presentacion: nn(d.presentacion),
    contenido_neto: nn(d.contenido_neto),
    precio: d.precio,
    precio_oferta: d.precio_oferta,
    costo: d.costo,
    stock: d.stock,
    stock_minimo: d.stock_minimo,
    controla_stock: d.controla_stock,
    nivel_picante: d.nivel_picante,
    imagen_principal_url: nn(d.imagen_principal_url),
    destacado: d.destacado,
    nuevo: d.nuevo,
    en_oferta: d.en_oferta,
    activo: d.activo,
    orden: d.orden,
    meta_titulo: nn(d.meta_titulo),
    meta_descripcion: nn(d.meta_descripcion),
  };

  let productoId = id;
  if (id) {
    const r = await productosRepo.actualizar(id, payload);
    if (!r.ok) return { error: r.error };
  } else {
    const r = await productosRepo.crear(payload);
    if (!r.ok) return { error: r.error };
    productoId = r.data.id;
  }

  // Sincronizar etiquetas (tabla puente producto_etiquetas).
  if (productoId) {
    const r = await productosRepo.sincronizarEtiquetas(productoId, d.etiquetas);
    if (!r.ok) return { error: r.error };
  }

  return { ok: true };
}

export async function alternarActivoCliente(id: string, activo: boolean): Promise<Resultado> {
  const r = await productosRepo.alternarActivo(id, activo);
  return r.ok ? { ok: true } : { error: r.error };
}

export async function alternarDestacadoCliente(id: string, destacado: boolean): Promise<Resultado> {
  const r = await productosRepo.alternarDestacado(id, destacado);
  return r.ok ? { ok: true } : { error: r.error };
}

export async function eliminarProductoCliente(id: string): Promise<Resultado> {
  const r = await productosRepo.eliminar(id);
  return r.ok ? { ok: true } : { error: r.error };
}

export async function duplicarProductoCliente(id: string): Promise<Resultado> {
  const r = await productosRepo.duplicar(id);
  return r.ok ? { ok: true } : { error: r.error };
}
