"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Field, Input, Textarea, Toggle } from "@/components/admin/ui";
import { ImageUploader } from "@/components/admin/image-uploader";
import { guardarSeccion } from "@/app/admin/(panel)/contenido/actions";
import type { SeccionRow } from "@/lib/admin-datos";

type FormValues = {
  clave: string;
  titulo: string;
  subtitulo: string;
  contenido: string;
  imagen_url: string;
  texto_boton: string;
  enlace_boton: string;
  orden: number;
  activa: boolean;
};

export function SeccionForm({ seccion }: { seccion: SeccionRow | null }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const { register, handleSubmit, watch, setValue, formState } = useForm<FormValues>({
    defaultValues: {
      clave: seccion?.clave ?? "",
      titulo: seccion?.titulo ?? "",
      subtitulo: seccion?.subtitulo ?? "",
      contenido: seccion?.contenido ?? "",
      imagen_url: seccion?.imagen_url ?? "",
      texto_boton: seccion?.texto_boton ?? "",
      enlace_boton: seccion?.enlace_boton ?? "",
      orden: seccion?.orden ?? 0,
      activa: seccion?.activa ?? true,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const res = await guardarSeccion(seccion?.id ?? null, values);
    if (res && "error" in res) setServerError(res.error);
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {serverError && (
        <p className="rounded-xl border border-fuego-rojo/30 bg-fuego-rojo/10 px-4 py-3 text-sm font-medium text-fuego-rojo">{serverError}</p>
      )}
      <div className="recuadro space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Clave" htmlFor="clave" hint="Identificador (ej: hero, historia)" error={formState.errors.clave?.message}>
            <Input id="clave" {...register("clave", { required: "Obligatorio" })} readOnly={!!seccion} />
          </Field>
          <Field label="Orden" htmlFor="orden"><Input id="orden" type="number" {...register("orden", { valueAsNumber: true })} /></Field>
          <Field label="Subtítulo (eyebrow)" htmlFor="subtitulo"><Input id="subtitulo" {...register("subtitulo")} /></Field>
          <Field label="Título" htmlFor="titulo"><Input id="titulo" {...register("titulo")} /></Field>
          <Field label="Contenido" className="sm:col-span-2" htmlFor="contenido"><Textarea id="contenido" className="min-h-32" {...register("contenido")} /></Field>
          <Field label="Texto del botón" htmlFor="texto_boton"><Input id="texto_boton" {...register("texto_boton")} /></Field>
          <Field label="Enlace del botón" htmlFor="enlace_boton"><Input id="enlace_boton" placeholder="#productos" {...register("enlace_boton")} /></Field>
          <Field label="Imagen" className="sm:col-span-2">
            <ImageUploader value={watch("imagen_url") || null} onChange={(u) => setValue("imagen_url", u ?? "")} bucket="saltatop-contenido" carpeta="secciones" />
          </Field>
          <Toggle label="Activa" descripcion="Visible en la web" checked={watch("activa")} onChange={(v) => setValue("activa", v)} />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/contenido" className="btn-contorno">Cancelar</Link>
        <button type="submit" disabled={formState.isSubmitting} className="btn-fuego disabled:opacity-60">
          {formState.isSubmitting ? "Guardando…" : "Guardar sección"}
        </button>
      </div>
    </form>
  );
}
