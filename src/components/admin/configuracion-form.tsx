"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Field, Input, Textarea, Toggle } from "@/components/admin/ui";
import { guardarConfiguracion } from "@/app/admin/(panel)/configuracion/actions";
import type { ConfiguracionRow } from "@/lib/admin-datos";

type FormValues = {
  nombre_marca: string;
  eslogan: string;
  descripcion_corta: string;
  descripcion_larga: string;
  whatsapp: string;
  telefono: string;
  email: string;
  direccion: string;
  horario_atencion: string;
  instagram_url: string;
  facebook_url: string;
  tiktok_url: string;
  moneda: string;
  simbolo_moneda: string;
  pais: string;
  compra_minima: string;
  costo_envio: string;
  envio_gratis_desde: string;
  retiro_local_habilitado: boolean;
  pedidos_habilitados: boolean;
  mensaje_confirmacion: string;
};

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="recuadro p-6">
      <h3 className="mb-4 font-title text-lg font-extrabold uppercase text-tinta">{titulo}</h3>
      {children}
    </div>
  );
}

const s = (v: number | null | undefined) => (v == null ? "" : String(v));

export function ConfiguracionForm({ config }: { config: ConfiguracionRow | null }) {
  const [msg, setMsg] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  const { register, handleSubmit, watch, setValue, formState } = useForm<FormValues>({
    defaultValues: {
      nombre_marca: config?.nombre_marca ?? "Salsa Top",
      eslogan: config?.eslogan ?? "",
      descripcion_corta: config?.descripcion_corta ?? "",
      descripcion_larga: config?.descripcion_larga ?? "",
      whatsapp: config?.whatsapp ?? "",
      telefono: config?.telefono ?? "",
      email: config?.email ?? "",
      direccion: config?.direccion ?? "",
      horario_atencion: config?.horario_atencion ?? "",
      instagram_url: config?.instagram_url ?? "",
      facebook_url: config?.facebook_url ?? "",
      tiktok_url: config?.tiktok_url ?? "",
      moneda: config?.moneda ?? "PYG",
      simbolo_moneda: config?.simbolo_moneda ?? "Gs.",
      pais: config?.pais ?? "Paraguay",
      compra_minima: s(config?.compra_minima),
      costo_envio: s(config?.costo_envio),
      envio_gratis_desde: s(config?.envio_gratis_desde),
      retiro_local_habilitado: config?.retiro_local_habilitado ?? true,
      pedidos_habilitados: config?.pedidos_habilitados ?? true,
      mensaje_confirmacion: config?.mensaje_confirmacion ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setMsg(null);
    const res = await guardarConfiguracion(config?.id ?? null, values);
    if ("error" in res) setMsg({ tipo: "error", texto: res.error });
    else setMsg({ tipo: "ok", texto: "Configuración guardada." });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-5 pb-24">
      {msg && (
        <p className={msg.tipo === "ok"
          ? "rounded-xl border border-petroleo/30 bg-petroleo/10 px-4 py-3 text-sm font-medium text-petroleo"
          : "rounded-xl border border-fuego-rojo/30 bg-fuego-rojo/10 px-4 py-3 text-sm font-medium text-fuego-rojo"}>
          {msg.texto}
        </p>
      )}

      <Section titulo="Marca">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre de marca" htmlFor="nombre_marca" error={formState.errors.nombre_marca?.message}>
            <Input id="nombre_marca" {...register("nombre_marca", { required: "Obligatorio" })} />
          </Field>
          <Field label="Eslogan" htmlFor="eslogan"><Input id="eslogan" {...register("eslogan")} /></Field>
          <Field label="Descripción corta" className="sm:col-span-2" htmlFor="descripcion_corta">
            <Textarea id="descripcion_corta" {...register("descripcion_corta")} />
          </Field>
          <Field label="Descripción larga" className="sm:col-span-2" htmlFor="descripcion_larga">
            <Textarea id="descripcion_larga" {...register("descripcion_larga")} />
          </Field>
        </div>
      </Section>

      <Section titulo="Contacto">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="WhatsApp (con código país)" htmlFor="whatsapp" hint="Ej: 595994208200">
            <Input id="whatsapp" {...register("whatsapp")} />
          </Field>
          <Field label="Teléfono visible" htmlFor="telefono"><Input id="telefono" {...register("telefono")} /></Field>
          <Field label="Email" htmlFor="email" error={formState.errors.email?.message}>
            <Input id="email" type="email" {...register("email")} />
          </Field>
          <Field label="Dirección" htmlFor="direccion"><Input id="direccion" {...register("direccion")} /></Field>
          <Field label="Horario de atención" className="sm:col-span-2" htmlFor="horario_atencion">
            <Input id="horario_atencion" {...register("horario_atencion")} />
          </Field>
        </div>
      </Section>

      <Section titulo="Redes sociales">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Instagram URL" htmlFor="instagram_url"><Input id="instagram_url" {...register("instagram_url")} /></Field>
          <Field label="Facebook URL" htmlFor="facebook_url"><Input id="facebook_url" {...register("facebook_url")} /></Field>
          <Field label="TikTok URL" htmlFor="tiktok_url"><Input id="tiktok_url" {...register("tiktok_url")} /></Field>
        </div>
      </Section>

      <Section titulo="Moneda y envíos">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Moneda" htmlFor="moneda"><Input id="moneda" {...register("moneda")} /></Field>
          <Field label="Símbolo" htmlFor="simbolo_moneda"><Input id="simbolo_moneda" {...register("simbolo_moneda")} /></Field>
          <Field label="País" htmlFor="pais"><Input id="pais" {...register("pais")} /></Field>
          <Field label="Compra mínima (Gs.)" htmlFor="compra_minima"><Input id="compra_minima" type="number" min={0} {...register("compra_minima")} /></Field>
          <Field label="Costo de envío (Gs.)" htmlFor="costo_envio"><Input id="costo_envio" type="number" min={0} {...register("costo_envio")} /></Field>
          <Field label="Envío gratis desde (Gs.)" htmlFor="envio_gratis_desde"><Input id="envio_gratis_desde" type="number" min={0} {...register("envio_gratis_desde")} /></Field>
        </div>
      </Section>

      <Section titulo="Pedidos">
        <div className="grid gap-3 sm:grid-cols-2">
          <Toggle label="Pedidos habilitados" descripcion="Permitir checkout en la web" checked={watch("pedidos_habilitados")} onChange={(v) => setValue("pedidos_habilitados", v)} />
          <Toggle label="Retiro en local" descripcion="Ofrecer retiro sin envío" checked={watch("retiro_local_habilitado")} onChange={(v) => setValue("retiro_local_habilitado", v)} />
          <Field label="Mensaje de confirmación" className="sm:col-span-2" htmlFor="mensaje_confirmacion">
            <Textarea id="mensaje_confirmacion" {...register("mensaje_confirmacion")} />
          </Field>
        </div>
      </Section>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-black/10 bg-crema/95 px-4 py-3 backdrop-blur lg:pl-[280px]">
        <div className="mx-auto flex max-w-4xl items-center justify-end">
          <button type="submit" disabled={formState.isSubmitting} className="btn-fuego disabled:opacity-60">
            {formState.isSubmitting ? "Guardando…" : "Guardar configuración"}
          </button>
        </div>
      </div>
    </form>
  );
}
