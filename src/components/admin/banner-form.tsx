"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Field, Input, Textarea, Toggle } from "@/components/admin/ui";
import { ImageUploader } from "@/components/admin/image-uploader";
import { MensajeError } from "@/components/admin/lista-ui";
import { guardarBannerCliente } from "@/app/admin/(panel)/banners/acciones-cliente";
import type { Banner } from "@/lib/repositorios/banners";

type FormValues = {
  titulo: string;
  subtitulo: string;
  descripcion: string;
  imagen_desktop_url: string;
  imagen_mobile_url: string;
  texto_boton: string;
  enlace_boton: string;
  color_texto: string;
  color_fondo: string;
  overlay: number;
  orden: number;
  activo: boolean;
  fecha_inicio: string;
  fecha_fin: string;
};

const paraInput = (iso: string | null) => (iso ? iso.slice(0, 16) : "");

export function BannerForm({ banner }: { banner: Banner | null }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, formState } = useForm<FormValues>({
    defaultValues: {
      titulo: banner?.titulo ?? "",
      subtitulo: banner?.subtitulo ?? "",
      descripcion: banner?.descripcion ?? "",
      imagen_desktop_url: banner?.imagen_desktop_url ?? "",
      imagen_mobile_url: banner?.imagen_mobile_url ?? "",
      texto_boton: banner?.texto_boton ?? "",
      enlace_boton: banner?.enlace_boton ?? "",
      color_texto: banner?.color_texto ?? "",
      color_fondo: banner?.color_fondo ?? "",
      overlay: banner?.overlay ?? 0,
      orden: banner?.orden ?? 0,
      activo: banner?.activo ?? true,
      fecha_inicio: paraInput(banner?.fecha_inicio ?? null),
      fecha_fin: paraInput(banner?.fecha_fin ?? null),
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const res = await guardarBannerCliente(banner?.id ?? null, values);
    if ("error" in res) {
      setServerError(res.error);
      return;
    }
    router.push("/admin/banners/");
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <MensajeError>{serverError}</MensajeError>
      <div className="recuadro space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título" htmlFor="titulo"><Input id="titulo" {...register("titulo")} /></Field>
          <Field label="Subtítulo (eyebrow)" htmlFor="subtitulo"><Input id="subtitulo" {...register("subtitulo")} /></Field>
          <Field label="Descripción" className="sm:col-span-2" htmlFor="descripcion"><Textarea id="descripcion" {...register("descripcion")} /></Field>
          <Field label="Texto del botón" htmlFor="texto_boton"><Input id="texto_boton" {...register("texto_boton")} /></Field>
          <Field label="Enlace del botón" htmlFor="enlace_boton"><Input id="enlace_boton" placeholder="#productos" {...register("enlace_boton")} /></Field>
          <Field label="Imagen desktop">
            <ImageUploader value={watch("imagen_desktop_url") || null} onChange={(u) => setValue("imagen_desktop_url", u ?? "")} bucket="saltatop-banners" carpeta="desktop" />
          </Field>
          <Field label="Imagen mobile">
            <ImageUploader value={watch("imagen_mobile_url") || null} onChange={(u) => setValue("imagen_mobile_url", u ?? "")} bucket="saltatop-banners" carpeta="mobile" />
          </Field>
          <Field label="Color de texto (hex)" htmlFor="color_texto"><Input id="color_texto" placeholder="#241A14" {...register("color_texto")} /></Field>
          <Field label="Color de fondo (hex)" htmlFor="color_fondo"><Input id="color_fondo" placeholder="#FFF4EA" {...register("color_fondo")} /></Field>
          <Field label="Overlay (0 a 1)" htmlFor="overlay"><Input id="overlay" type="number" step="0.1" min={0} max={1} {...register("overlay", { valueAsNumber: true })} /></Field>
          <Field label="Orden" htmlFor="orden"><Input id="orden" type="number" {...register("orden", { valueAsNumber: true })} /></Field>
          <Field label="Vigencia desde" htmlFor="fecha_inicio"><Input id="fecha_inicio" type="datetime-local" {...register("fecha_inicio")} /></Field>
          <Field label="Vigencia hasta" htmlFor="fecha_fin"><Input id="fecha_fin" type="datetime-local" {...register("fecha_fin")} /></Field>
          <Toggle label="Activo" checked={watch("activo")} onChange={(v) => setValue("activo", v)} />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/banners/" className="btn-contorno">Cancelar</Link>
        <button type="submit" disabled={formState.isSubmitting} className="btn-fuego disabled:opacity-60">
          {formState.isSubmitting ? "Guardando…" : "Guardar banner"}
        </button>
      </div>
    </form>
  );
}
