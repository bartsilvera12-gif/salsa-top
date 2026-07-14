"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Field, Input, Textarea, Select, Toggle } from "@/components/admin/ui";
import { MensajeError } from "@/components/admin/lista-ui";
import { guardarCuponCliente } from "@/app/admin/(panel)/cupones/acciones-cliente";
import type { Cupon } from "@/lib/repositorios/cupones";

type FormValues = {
  codigo: string;
  descripcion: string;
  tipo_descuento: "porcentaje" | "monto_fijo" | "envio_gratis";
  valor: number;
  compra_minima: number;
  limite_usos: string;
  limite_por_cliente: string;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
};

const paraInput = (iso: string | null) => (iso ? iso.slice(0, 16) : "");

export function CuponForm({ cupon }: { cupon: Cupon | null }) {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, formState } = useForm<FormValues>({
    defaultValues: {
      codigo: cupon?.codigo ?? "",
      descripcion: cupon?.descripcion ?? "",
      tipo_descuento: (cupon?.tipo_descuento as FormValues["tipo_descuento"]) ?? "porcentaje",
      valor: cupon?.valor ?? 0,
      compra_minima: cupon?.compra_minima ?? 0,
      limite_usos: cupon?.limite_usos != null ? String(cupon.limite_usos) : "",
      limite_por_cliente: cupon?.limite_por_cliente != null ? String(cupon.limite_por_cliente) : "",
      fecha_inicio: paraInput(cupon?.fecha_inicio ?? null),
      fecha_fin: paraInput(cupon?.fecha_fin ?? null),
      activo: cupon?.activo ?? true,
    },
  });

  const tipo = watch("tipo_descuento");

  const onSubmit = handleSubmit(async (values) => {
    setServerError(null);
    const res = await guardarCuponCliente(cupon?.id ?? null, values);
    if ("error" in res) {
      setServerError(res.error);
      return;
    }
    router.push("/admin/cupones/");
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <MensajeError>{serverError}</MensajeError>
      <div className="recuadro space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Código" htmlFor="codigo" hint="Se guarda en mayúsculas" error={formState.errors.codigo?.message}>
            <Input id="codigo" className="uppercase" {...register("codigo", { required: "Obligatorio" })} />
          </Field>
          <Field label="Tipo de descuento" htmlFor="tipo_descuento">
            <Select id="tipo_descuento" {...register("tipo_descuento")}>
              <option value="porcentaje">Porcentaje (%)</option>
              <option value="monto_fijo">Monto fijo (Gs.)</option>
              <option value="envio_gratis">Envío gratis</option>
            </Select>
          </Field>
          <Field label={tipo === "porcentaje" ? "Valor (%)" : "Valor (Gs.)"} htmlFor="valor">
            <Input id="valor" type="number" min={0} disabled={tipo === "envio_gratis"} {...register("valor", { valueAsNumber: true })} />
          </Field>
          <Field label="Compra mínima (Gs.)" htmlFor="compra_minima">
            <Input id="compra_minima" type="number" min={0} {...register("compra_minima", { valueAsNumber: true })} />
          </Field>
          <Field label="Límite de usos" htmlFor="limite_usos" hint="Vacío = ilimitado">
            <Input id="limite_usos" type="number" min={0} {...register("limite_usos")} />
          </Field>
          <Field label="Límite por cliente" htmlFor="limite_por_cliente" hint="Vacío = ilimitado">
            <Input id="limite_por_cliente" type="number" min={0} {...register("limite_por_cliente")} />
          </Field>
          <Field label="Vigencia desde" htmlFor="fecha_inicio">
            <Input id="fecha_inicio" type="datetime-local" {...register("fecha_inicio")} />
          </Field>
          <Field label="Vigencia hasta" htmlFor="fecha_fin">
            <Input id="fecha_fin" type="datetime-local" {...register("fecha_fin")} />
          </Field>
          <Field label="Descripción" className="sm:col-span-2" htmlFor="descripcion">
            <Textarea id="descripcion" {...register("descripcion")} />
          </Field>
          <Toggle label="Activo" checked={watch("activo")} onChange={(v) => setValue("activo", v)} />
        </div>
      </div>
      <div className="flex items-center justify-end gap-3">
        <Link href="/admin/cupones/" className="btn-contorno">Cancelar</Link>
        <button type="submit" disabled={formState.isSubmitting} className="btn-fuego disabled:opacity-60">
          {formState.isSubmitting ? "Guardando…" : "Guardar cupón"}
        </button>
      </div>
    </form>
  );
}
