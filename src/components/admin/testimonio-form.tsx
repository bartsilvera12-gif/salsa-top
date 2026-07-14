"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Field, Input, Textarea, Select, Toggle } from "@/components/admin/ui";
import { ImageUploader } from "@/components/admin/image-uploader";
import { MensajeError } from "@/components/admin/lista-ui";
import { guardarTestimonioCliente } from "@/app/admin/(panel)/testimonios/acciones-cliente";
import type { Testimonio } from "@/lib/repositorios/testimonios";

type FormValues = {
  nombre_cliente: string;
  cargo_o_descripcion: string;
  comentario: string;
  calificacion: number;
  imagen_url: string;
  destacado: boolean;
  aprobado: boolean;
  orden: number;
};

export function TestimonioForm({ testimonio }: { testimonio: Testimonio | null }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, formState } = useForm<FormValues>({
    defaultValues: {
      nombre_cliente: testimonio?.nombre_cliente ?? "",
      cargo_o_descripcion: testimonio?.cargo_o_descripcion ?? "",
      comentario: testimonio?.comentario ?? "",
      calificacion: testimonio?.calificacion ?? 5,
      imagen_url: testimonio?.imagen_url ?? "",
      destacado: testimonio?.destacado ?? false,
      aprobado: testimonio?.aprobado ?? false,
      orden: testimonio?.orden ?? 0,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const res = await guardarTestimonioCliente(testimonio?.id ?? null, values);
    if ("error" in res) {
      setServerError(res.error);
      return;
    }
    router.push("/admin/testimonios/");
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <MensajeError>{serverError}</MensajeError>
      <div className="recuadro space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre del cliente" htmlFor="nombre_cliente" error={formState.errors.nombre_cliente?.message}>
            <Input id="nombre_cliente" {...register("nombre_cliente", { required: "Obligatorio" })} />
          </Field>
          <Field label="Cargo o descripción" htmlFor="cargo_o_descripcion">
            <Input id="cargo_o_descripcion" {...register("cargo_o_descripcion")} />
          </Field>
          <Field label="Comentario" className="sm:col-span-2" htmlFor="comentario" error={formState.errors.comentario?.message}>
            <Textarea id="comentario" {...register("comentario", { required: "Obligatorio" })} />
          </Field>
          <Field label="Calificación" htmlFor="calificacion">
            <Select id="calificacion" {...register("calificacion", { valueAsNumber: true })}>
              {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} ⭐</option>)}
            </Select>
          </Field>
          <Field label="Orden" htmlFor="orden"><Input id="orden" type="number" {...register("orden", { valueAsNumber: true })} /></Field>
          <Field label="Foto" className="sm:col-span-2">
            <ImageUploader value={watch("imagen_url") || null} onChange={(u) => setValue("imagen_url", u ?? "")} bucket="saltatop-contenido" carpeta="testimonios" />
          </Field>
          <Toggle label="Aprobado" descripcion="Visible en la web" checked={watch("aprobado")} onChange={(v) => setValue("aprobado", v)} />
          <Toggle label="Destacado" checked={watch("destacado")} onChange={(v) => setValue("destacado", v)} />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/testimonios/" className="btn-contorno">Cancelar</Link>
        <button type="submit" disabled={formState.isSubmitting} className="btn-fuego disabled:opacity-60">
          {formState.isSubmitting ? "Guardando…" : "Guardar testimonio"}
        </button>
      </div>
    </form>
  );
}
