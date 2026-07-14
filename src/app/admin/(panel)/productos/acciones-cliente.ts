// Escrituras de Productos desde el NAVEGADOR (cliente authenticated + RLS).
// Reemplaza a las Server Actions. La seguridad la hace RLS (admin_all_productos):
// si el rol no está autorizado, la operación falla y se devuelve el error.
import { createClient } from "@/lib/supabase/client";
import { productoSchema } from "@/lib/schemas";

type Resultado = { ok: true } | { error: string };

const nn = (v: string | null | undefined) => (v === "" || v === undefined ? null : v);

function traducir(msg: string): string {
  if (msg.includes("productos_slug")) return "Ya existe un producto con ese slug.";
  if (msg.includes("productos_codigo")) return "Ya existe un producto con ese código.";
  return msg;
}

export async function guardarProductoCliente(id: string | null, input: unknown): Promise<Resultado> {
  const parsed = productoSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }
  const d = parsed.data;
  const supabase = createClient();

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
    const { error } = await supabase.from("productos").update(payload).eq("id", id);
    if (error) return { error: traducir(error.message) };
  } else {
    const { data, error } = await supabase.from("productos").insert(payload).select("id").single();
    if (error) return { error: traducir(error.message) };
    productoId = data.id as string;
  }

  // Sincronizar etiquetas
  if (productoId) {
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
  const supabase = createClient();
  const { error } = await supabase.from("productos").update({ activo }).eq("id", id);
  return error ? { error: error.message } : { ok: true };
}

export async function eliminarProductoCliente(id: string): Promise<Resultado> {
  const supabase = createClient();
  const { error } = await supabase.from("productos").delete().eq("id", id);
  return error ? { error: error.message } : { ok: true };
}

export async function duplicarProductoCliente(id: string): Promise<Resultado> {
  const supabase = createClient();
  const { data } = await supabase.from("productos").select("*").eq("id", id).single();
  if (!data) return { error: "Producto no encontrado" };

  const copia = { ...data } as Record<string, unknown>;
  delete copia.id;
  delete copia.creado_en;
  delete copia.actualizado_en;
  copia.nombre = `${data.nombre} (copia)`;
  copia.slug = `${data.slug}-copia-${Date.now().toString(36)}`;
  copia.codigo = null;
  copia.activo = false;
  copia.destacado = false;

  const { error } = await supabase.from("productos").insert(copia);
  return error ? { error: traducir(error.message) } : { ok: true };
}
