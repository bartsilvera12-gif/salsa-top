"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Field, Input, Textarea, Toggle } from "@/components/admin/ui";
import { MensajeError } from "@/components/admin/lista-ui";
import { guardarBeneficioCliente } from "@/app/admin/(panel)/beneficios/acciones-cliente";
import type { Beneficio } from "@/lib/repositorios/beneficios";

type FormValues = {
  titulo: string;
  descripcion: string;
  icono: string;
  imagen_url: string;
  orden: number;
  activo: boolean;
};

export function BeneficioForm({ beneficio }: { beneficio: Beneficio | null }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, formState } = useForm<FormValues>({
    defaultValues: {
      titulo: beneficio?.titulo ?? "",
      descripcion: beneficio?.descripcion ?? "",
      icono: beneficio?.icono ?? "",
      imagen_url: beneficio?.imagen_url ?? "",
      orden: beneficio?.orden ?? 0,
      activo: beneficio?.activo ?? true,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const res = await guardarBeneficioCliente(beneficio?.id ?? null, values);
    if ("error" in res) {
      setServerError(res.error);
      return;
    }
    router.push("/admin/beneficios/");
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <MensajeError>{serverError}</MensajeError>
      <div className="recuadro space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Título" htmlFor="titulo" error={formState.errors.titulo?.message}>
            <Input id="titulo" {...register("titulo", { required: "Obligatorio" })} />
          </Field>
          <Field label="Ícono" htmlFor="icono" hint="hand · leaf · sparkles · shield-check">
            <Input id="icono" {...register("icono")} />
          </Field>
          <Field label="Descripción" className="sm:col-span-2" htmlFor="descripcion">
            <Textarea id="descripcion" {...register("descripcion")} />
          </Field>
          <Field label="Orden" htmlFor="orden"><Input id="orden" type="number" {...register("orden", { valueAsNumber: true })} /></Field>
          <Toggle label="Activo" checked={watch("activo")} onChange={(v) => setValue("activo", v)} />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/beneficios/" className="btn-contorno">Cancelar</Link>
        <button type="submit" disabled={formState.isSubmitting} className="btn-fuego disabled:opacity-60">
          {formState.isSubmitting ? "Guardando…" : "Guardar beneficio"}
        </button>
      </div>
    </form>
  );
}
