// Escrituras de Productos usando la infraestructura CRUD compartida + browser client.
// Seguridad por RLS (admin_all_productos). Sin service_role, sin server actions.
import { crudProductos } from "@/lib/admin-datos-cliente";
import { getSupabase } from "@/lib/supabase/browser";
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
    const r = await crudProductos.actualizar(id, payload);
    if (!r.ok) return { error: r.error };
  } else {
    const r = await crudProductos.insertar(payload);
    if (!r.ok) return { error: r.error };
    productoId = r.data.id;
  }

  // Sincronizar etiquetas (tabla puente): borrar y reinsertar.
  if (productoId) {
    const supabase = getSupabase();
    await supabase.from("producto_etiquetas").delete().eq("producto_id", productoId);
    if (d.etiquetas.length > 0) {
      await supabase
        .from("producto_etiquetas")
        .insert(d.etiquetas.map((etiqueta_id) => ({ producto_id: productoId, etiqueta_id })));
    }
  }

  return { ok: true };
}

export async function alternarActivoCliente(id: string, activo: boolean): Promise<Resultado> {
  const r = await crudProductos.alternar(id, "activo", activo);
  return r.ok ? { ok: true } : { error: r.error };
}

export async function eliminarProductoCliente(id: string): Promise<Resultado> {
  const r = await crudProductos.eliminar(id);
  return r.ok ? { ok: true } : { error: r.error };
}

export async function duplicarProductoCliente(id: string): Promise<Resultado> {
  const r = await crudProductos.duplicar(id, (fila) => {
    delete fila.id;
    delete fila.creado_en;
    delete fila.actualizado_en;
    fila.nombre = `${String(fila.nombre)} (copia)`;
    fila.slug = `${String(fila.slug)}-copia-${Date.now().toString(36)}`;
    fila.codigo = null;
    fila.activo = false;
    fila.destacado = false;
    return fila;
  });
  return r.ok ? { ok: true } : { error: r.error };
}
