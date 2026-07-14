"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { slugify } from "@/lib/utils";
import { Field, Input, Textarea, Select, Toggle } from "@/components/admin/ui";
import { ImageUploader } from "@/components/admin/image-uploader";
import { MensajeError } from "@/components/admin/lista-ui";
import { guardarProductoCliente } from "@/app/admin/(panel)/productos/acciones-cliente";
import type { ProductoRow, Opcion } from "@/lib/admin-datos";

type FormValues = {
  nombre: string;
  slug: string;
  codigo: string;
  categoria_id: string;
  descripcion_corta: string;
  descripcion_larga: string;
  ingredientes: string;
  recomendaciones_uso: string;
  presentacion: string;
  contenido_neto: string;
  precio: number;
  precio_oferta: string;
  costo: string;
  stock: number;
  stock_minimo: number;
  controla_stock: boolean;
  nivel_picante: number;
  imagen_principal_url: string;
  destacado: boolean;
  nuevo: boolean;
  en_oferta: boolean;
  activo: boolean;
  orden: number;
  meta_titulo: string;
  meta_descripcion: string;
  etiquetas: string[];
};

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="recuadro p-6">
      <h3 className="mb-4 font-title text-lg font-extrabold uppercase text-tinta">{titulo}</h3>
      {children}
    </div>
  );
}

export function ProductoForm({
  producto,
  etiquetasProducto,
  categorias,
  etiquetas,
}: {
  producto: ProductoRow | null;
  etiquetasProducto: string[];
  categorias: Opcion[];
  etiquetas: Opcion[];
}) {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const { register, handleSubmit, watch, setValue, getValues, formState } = useForm<FormValues>({
    defaultValues: {
      nombre: producto?.nombre ?? "",
      slug: producto?.slug ?? "",
      codigo: producto?.codigo ?? "",
      categoria_id: producto?.categoria_id ?? "",
      descripcion_corta: producto?.descripcion_corta ?? "",
      descripcion_larga: producto?.descripcion_larga ?? "",
      ingredientes: producto?.ingredientes ?? "",
      recomendaciones_uso: producto?.recomendaciones_uso ?? "",
      presentacion: producto?.presentacion ?? "",
      contenido_neto: producto?.contenido_neto ?? "",
      precio: producto?.precio ?? 0,
      precio_oferta: producto?.precio_oferta != null ? String(producto.precio_oferta) : "",
      costo: producto?.costo != null ? String(producto.costo) : "",
      stock: producto?.stock ?? 0,
      stock_minimo: producto?.stock_minimo ?? 0,
      controla_stock: producto?.controla_stock ?? true,
      nivel_picante: producto?.nivel_picante ?? 0,
      imagen_principal_url: producto?.imagen_principal_url ?? "",
      destacado: producto?.destacado ?? false,
      nuevo: producto?.nuevo ?? false,
      en_oferta: producto?.en_oferta ?? false,
      activo: producto?.activo ?? true,
      orden: producto?.orden ?? 0,
      meta_titulo: producto?.meta_titulo ?? "",
      meta_descripcion: producto?.meta_descripcion ?? "",
      etiquetas: etiquetasProducto,
    },
  });

  const etiquetasSel = watch("etiquetas") ?? [];
  const imagen = watch("imagen_principal_url");

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const payload = { ...values, categoria_id: values.categoria_id || null };
    const res = await guardarProductoCliente(producto?.id ?? null, payload);
    if ("error" in res) {
      setServerError(res.error);
      return;
    }
    router.push("/admin/productos/");
  });

  function toggleEtiqueta(id: string) {
    const set = new Set(etiquetasSel);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    setValue("etiquetas", Array.from(set));
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 pb-24">
      <MensajeError>{serverError}</MensajeError>

      <Section titulo="Información general">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="nombre" error={formState.errors.nombre?.message}>
            <Input id="nombre" {...register("nombre", { required: "Obligatorio" })}
              onBlur={() => { if (!getValues("slug")) setValue("slug", slugify(getValues("nombre"))); }} />
          </Field>
          <Field label="Slug (URL)" htmlFor="slug" hint="Solo minúsculas, números y guiones">
            <div className="flex gap-2">
              <Input id="slug" {...register("slug", { required: true })} />
              <button type="button" onClick={() => setValue("slug", slugify(getValues("nombre")))}
                className="btn-contorno flex-shrink-0 px-3 py-2 text-xs">Generar</button>
            </div>
          </Field>
          {/* Campo "Código" ocultado a pedido. Se mantiene registrado (input
              oculto) para no perder el valor de productos que ya lo tengan. */}
          <input type="hidden" {...register("codigo")} />
          <Field label="Contenido neto" htmlFor="contenido_neto">
            <Input id="contenido_neto" placeholder="30 g" {...register("contenido_neto")} />
          </Field>
          <Field label="Descripción corta" className="sm:col-span-2" htmlFor="descripcion_corta">
            <Textarea id="descripcion_corta" {...register("descripcion_corta")} />
          </Field>
          <Field label="Descripción larga" className="sm:col-span-2" htmlFor="descripcion_larga">
            <Textarea id="descripcion_larga" {...register("descripcion_larga")} />
          </Field>
        </div>
      </Section>

      <Section titulo="Precio y stock">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Precio (Gs.)" htmlFor="precio" error={formState.errors.precio?.message}>
            <Input id="precio" type="number" min={0} {...register("precio", { valueAsNumber: true, min: 0 })} />
          </Field>
          <Field label="Precio oferta (Gs.)" htmlFor="precio_oferta">
            <Input id="precio_oferta" type="number" min={0} {...register("precio_oferta")} />
          </Field>
          <Field label="Costo (Gs.)" htmlFor="costo">
            <Input id="costo" type="number" min={0} {...register("costo")} />
          </Field>
          <Field label="Stock" htmlFor="stock">
            <Input id="stock" type="number" min={0} {...register("stock", { valueAsNumber: true, min: 0 })} />
          </Field>
          <Field label="Stock mínimo" htmlFor="stock_minimo">
            <Input id="stock_minimo" type="number" min={0} {...register("stock_minimo", { valueAsNumber: true, min: 0 })} />
          </Field>
          <div className="flex items-end">
            <Toggle label="Controlar stock" checked={watch("controla_stock")} onChange={(v) => setValue("controla_stock", v)} />
          </div>
        </div>
      </Section>

      <Section titulo="Categoría y picante">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Categoría" htmlFor="categoria_id">
            <Select id="categoria_id" {...register("categoria_id")}>
              <option value="">Sin categoría</option>
              {categorias.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </Select>
          </Field>
          <Field label="Nivel de picante" htmlFor="nivel_picante" hint="0 = no pica · 5 = muy picante">
            <Select id="nivel_picante" {...register("nivel_picante", { valueAsNumber: true })}>
              {[0, 1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
            </Select>
          </Field>
          {/* Selector de "Etiquetas" ocultado a pedido. Se mantiene montado
              (display:none) para conservar las etiquetas ya asignadas al guardar. */}
          <div className="hidden">
          <Field label="Etiquetas" className="sm:col-span-2">
            <div className="flex flex-wrap gap-2">
              {etiquetas.map((e) => {
                const sel = etiquetasSel.includes(e.id);
                return (
                  <button type="button" key={e.id} onClick={() => toggleEtiqueta(e.id)}
                    className={sel
                      ? "rounded-full bg-fuego-gradient px-3 py-1.5 text-xs font-semibold text-[#1a0e00]"
                      : "rounded-full border border-black/15 px-3 py-1.5 text-xs font-semibold text-tinta-suave hover:border-fuego-naranja"}>
                    {e.nombre}
                  </button>
                );
              })}
              {etiquetas.length === 0 && <p className="text-xs text-tinta-tenue">No hay etiquetas cargadas.</p>}
            </div>
          </Field>
          </div>
        </div>
      </Section>

      <Section titulo="Ingredientes y presentación">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Ingredientes" htmlFor="ingredientes">
            <Textarea id="ingredientes" {...register("ingredientes")} />
          </Field>
          <Field label="Recomendaciones de uso" htmlFor="recomendaciones_uso">
            <Textarea id="recomendaciones_uso" {...register("recomendaciones_uso")} />
          </Field>
          <Field label="Presentación" htmlFor="presentacion">
            <Input id="presentacion" placeholder="Sachet" {...register("presentacion")} />
          </Field>
        </div>
      </Section>

      <Section titulo="Imagen principal">
        <ImageUploader value={imagen || null} onChange={(url) => setValue("imagen_principal_url", url ?? "")} />
      </Section>

      <Section titulo="Visibilidad">
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle label="Activo" descripcion="Visible en la tienda" checked={watch("activo")} onChange={(v) => setValue("activo", v)} />
          <Toggle label="Destacado" descripcion="Aparece en la home" checked={watch("destacado")} onChange={(v) => setValue("destacado", v)} />
          <Toggle label="Nuevo" checked={watch("nuevo")} onChange={(v) => setValue("nuevo", v)} />
          <Toggle label="En oferta" descripcion="Usa el precio de oferta" checked={watch("en_oferta")} onChange={(v) => setValue("en_oferta", v)} />
          <Field label="Orden" htmlFor="orden">
            <Input id="orden" type="number" {...register("orden", { valueAsNumber: true })} />
          </Field>
        </div>
      </Section>

      {/* Sección "SEO" eliminada de la vista a pedido. Los campos se mantienen
          registrados (ocultos) para no perder valores ya guardados. */}
      <input type="hidden" {...register("meta_titulo")} />
      <input type="hidden" {...register("meta_descripcion")} />

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-crema/95 px-4 py-3 backdrop-blur lg:pl-[280px]">
        <div className="mx-auto flex max-w-4xl items-center justify-end gap-3">
          <Link href="/admin/productos" className="btn-contorno">Cancelar</Link>
          <button type="submit" disabled={formState.isSubmitting} className="btn-fuego disabled:opacity-60">
            {formState.isSubmitting ? "Guardando…" : "Guardar producto"}
          </button>
        </div>
      </div>
    </form>
  );
}
