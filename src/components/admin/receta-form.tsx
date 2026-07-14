"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { slugify } from "@/lib/utils";
import { Field, Input, Textarea, Toggle } from "@/components/admin/ui";
import { ImageUploader } from "@/components/admin/image-uploader";
import { MensajeError } from "@/components/admin/lista-ui";
import { guardarRecetaCliente } from "@/app/admin/(panel)/recetas/acciones-cliente";
import type { Receta } from "@/lib/repositorios/recetas";

type FormValues = {
  titulo: string;
  slug: string;
  descripcion_corta: string;
  contenido: string;
  ingredientes: string;
  instrucciones: string;
  imagen_principal_url: string;
  tiempo_preparacion_minutos: string;
  porciones: string;
  dificultad: string;
  activa: boolean;
  destacada: boolean;
  meta_titulo: string;
  meta_descripcion: string;
};

export function RecetaForm({ receta }: { receta: Receta | null }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, getValues, formState } = useForm<FormValues>({
    defaultValues: {
      titulo: receta?.titulo ?? "",
      slug: receta?.slug ?? "",
      descripcion_corta: receta?.descripcion_corta ?? "",
      contenido: receta?.contenido ?? "",
      ingredientes: receta?.ingredientes ?? "",
      instrucciones: receta?.instrucciones ?? "",
      imagen_principal_url: receta?.imagen_principal_url ?? "",
      tiempo_preparacion_minutos: receta?.tiempo_preparacion_minutos != null ? String(receta.tiempo_preparacion_minutos) : "",
      porciones: receta?.porciones != null ? String(receta.porciones) : "",
      dificultad: receta?.dificultad ?? "",
      activa: receta?.activa ?? true,
      destacada: receta?.destacada ?? false,
      meta_titulo: receta?.meta_titulo ?? "",
      meta_descripcion: receta?.meta_descripcion ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const res = await guardarRecetaCliente(receta?.id ?? null, values);
    if ("error" in res) {
      setServerError(res.error);
      return;
    }
    router.push("/admin/recetas/");
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <MensajeError>{serverError}</MensajeError>
      <div className="recuadro space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título" htmlFor="titulo" error={formState.errors.titulo?.message}>
            <Input id="titulo" {...register("titulo", { required: "Obligatorio" })}
              onBlur={() => { if (!getValues("slug")) setValue("slug", slugify(getValues("titulo"))); }} />
          </Field>
          <Field label="Slug (URL)" htmlFor="slug">
            <div className="flex gap-2">
              <Input id="slug" {...register("slug", { required: true })} />
              <button type="button" onClick={() => setValue("slug", slugify(getValues("titulo")))} className="btn-contorno flex-shrink-0 px-3 py-2 text-xs">Generar</button>
            </div>
          </Field>
          <Field label="Descripción corta" className="sm:col-span-2" htmlFor="descripcion_corta"><Textarea id="descripcion_corta" {...register("descripcion_corta")} /></Field>
          <Field label="Ingredientes" htmlFor="ingredientes"><Textarea id="ingredientes" className="min-h-32" {...register("ingredientes")} /></Field>
          <Field label="Instrucciones" htmlFor="instrucciones"><Textarea id="instrucciones" className="min-h-32" {...register("instrucciones")} /></Field>
          <Field label="Contenido / texto libre" className="sm:col-span-2" htmlFor="contenido"><Textarea id="contenido" {...register("contenido")} /></Field>
          <Field label="Tiempo (min)" htmlFor="tiempo"><Input id="tiempo" type="number" min={0} {...register("tiempo_preparacion_minutos")} /></Field>
          <Field label="Porciones" htmlFor="porciones"><Input id="porciones" type="number" min={0} {...register("porciones")} /></Field>
          <Field label="Dificultad" htmlFor="dificultad" hint="Fácil · Media · Difícil"><Input id="dificultad" {...register("dificultad")} /></Field>
          <Field label="Imagen principal" className="sm:col-span-2">
            <ImageUploader value={watch("imagen_principal_url") || null} onChange={(u) => setValue("imagen_principal_url", u ?? "")} bucket="saltatop-recetas" carpeta="recetas" />
          </Field>
          <Toggle label="Activa" descripcion="Publicada en la web" checked={watch("activa")} onChange={(v) => setValue("activa", v)} />
          <Toggle label="Destacada" checked={watch("destacada")} onChange={(v) => setValue("destacada", v)} />
          <Field label="Meta título" htmlFor="meta_titulo"><Input id="meta_titulo" {...register("meta_titulo")} /></Field>
          <Field label="Meta descripción" htmlFor="meta_descripcion"><Input id="meta_descripcion" {...register("meta_descripcion")} /></Field>
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/recetas/" className="btn-contorno">Cancelar</Link>
        <button type="submit" disabled={formState.isSubmitting} className="btn-fuego disabled:opacity-60">
          {formState.isSubmitting ? "Guardando…" : "Guardar receta"}
        </button>
      </div>
    </form>
  );
}
