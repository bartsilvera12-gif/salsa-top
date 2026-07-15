"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { slugify } from "@/lib/utils";
import { Field, Input, Textarea, Toggle } from "@/components/admin/ui";
import { MensajeError } from "@/components/admin/lista-ui";
import { guardarCategoriaCliente } from "@/app/admin/(panel)/categorias/acciones-cliente";
import type { Categoria } from "@/lib/repositorios/categorias";

type FormValues = {
  nombre: string;
  slug: string;
  descripcion: string;
  imagen_url: string;
  icono: string;
  color: string;
  orden: number;
  activa: boolean;
};

export function CategoriaForm({ categoria }: { categoria: Categoria | null }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, getValues, formState } = useForm<FormValues>({
    defaultValues: {
      nombre: categoria?.nombre ?? "",
      slug: categoria?.slug ?? "",
      descripcion: categoria?.descripcion ?? "",
      imagen_url: categoria?.imagen_url ?? "",
      icono: categoria?.icono ?? "",
      color: categoria?.color ?? "",
      orden: categoria?.orden ?? 0,
      activa: categoria?.activa ?? true,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const res = await guardarCategoriaCliente(categoria?.id ?? null, values);
    if ("error" in res) {
      setServerError(res.error);
      return;
    }
    router.push("/admin/categorias/");
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <MensajeError>{serverError}</MensajeError>
      <div className="recuadro space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre" htmlFor="nombre" error={formState.errors.nombre?.message}>
            <Input id="nombre" {...register("nombre", { required: "Obligatorio" })}
              onBlur={() => { if (!getValues("slug")) setValue("slug", slugify(getValues("nombre"))); }} />
          </Field>
          <Field label="Slug (URL)" htmlFor="slug">
            <div className="flex gap-2">
              <Input id="slug" {...register("slug", { required: true })} />
              <button type="button" onClick={() => setValue("slug", slugify(getValues("nombre")))}
                className="btn-contorno flex-shrink-0 px-3 py-2 text-xs">Generar</button>
            </div>
          </Field>
          <Field label="Descripción" className="sm:col-span-2" htmlFor="descripcion">
            <Textarea id="descripcion" {...register("descripcion")} />
          </Field>
          <input type="hidden" {...register("color")} />
          <Field label="Orden" htmlFor="orden">
            <Input id="orden" type="number" {...register("orden", { valueAsNumber: true })} />
          </Field>
          <input type="hidden" {...register("imagen_url")} />
          <Toggle label="Activa" descripcion="Visible en la tienda" checked={watch("activa")} onChange={(v) => setValue("activa", v)} />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/categorias/" className="btn-contorno">Cancelar</Link>
        <button type="submit" disabled={formState.isSubmitting} className="btn-fuego disabled:opacity-60">
          {formState.isSubmitting ? "Guardando…" : "Guardar categoría"}
        </button>
      </div>
    </form>
  );
}
