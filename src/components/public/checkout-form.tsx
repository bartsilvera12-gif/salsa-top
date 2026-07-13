"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useCarrito } from "@/lib/carrito";
import { formatGs } from "@/lib/utils";
import { waLink } from "@/lib/whatsapp";
import { crearPedidoAction } from "@/app/(site)/checkout/actions";
import type { MetodoPago, MetodoEntrega } from "@/lib/datos";

type FormValues = {
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  ciudad: string;
  barrio: string;
  direccion: string;
  referencia: string;
  metodoEntrega: string;
  metodoPago: string;
  observaciones: string;
};

const inputCls =
  "w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-fuego-naranja focus:ring-2 focus:ring-fuego-naranja/25";

export function CheckoutForm({
  metodosPago,
  metodosEntrega,
  whatsapp,
}: {
  metodosPago: MetodoPago[];
  metodosEntrega: MetodoEntrega[];
  whatsapp: string;
}) {
  const router = useRouter();
  const { items, subtotal, vaciar, cargado } = useCarrito();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState } = useForm<FormValues>({
    defaultValues: {
      nombre: "", apellido: "", telefono: "", email: "", ciudad: "", barrio: "",
      direccion: "", referencia: "", observaciones: "",
      metodoEntrega: metodosEntrega[0]?.nombre ?? "",
      metodoPago: metodosPago[0]?.nombre ?? "",
    },
  });

  const entregaSel = watch("metodoEntrega");
  const envio = useMemo(
    () => metodosEntrega.find((m) => m.nombre === entregaSel)?.costo ?? 0,
    [entregaSel, metodosEntrega],
  );
  const total = subtotal + envio;

  const onSubmit = handleSubmit(async (v) => {
    setError(null);
    if (items.length === 0) { setError("Tu carrito está vacío."); return; }

    const res = await crearPedidoAction({
      cliente: {
        nombre: v.nombre, apellido: v.apellido, telefono: v.telefono, email: v.email,
        ciudad: v.ciudad, barrio: v.barrio, direccion: v.direccion, referencia: v.referencia,
      },
      items: items.map((i) => ({ producto_id: i.productoId, variante_id: i.varianteId ?? null, cantidad: i.cantidad })),
      metodoEntrega: v.metodoEntrega,
      metodoPago: v.metodoPago,
      observaciones: v.observaciones,
    });

    if (!res.ok) { setError(res.error); return; }

    // Pedido guardado. Abrir WhatsApp con el resumen y luego confirmar.
    const lineas = items.map((i) => `• ${i.cantidad}x ${i.nombre}`).join("\n");
    const msg = `Hola Salsa Top! Hice el pedido ${res.numero}.\n\n${lineas}\n\nTotal: ${formatGs(res.total)}\nNombre: ${v.nombre} ${v.apellido}\nEntrega: ${v.metodoEntrega}`;
    try { window.open(waLink(whatsapp, msg), "_blank"); } catch { /* noop */ }
    vaciar();
    router.push(`/pedido/${res.numero}`);
  });

  if (cargado && items.length === 0) {
    return (
      <div className="recuadro p-10 text-center">
        <p className="text-tinta-suave">Tu carrito está vacío.</p>
        <Link href="/#productos" className="btn-fuego mt-4">Ver productos</Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-5">
        {error && <p className="rounded-xl border border-fuego-rojo/30 bg-fuego-rojo/10 px-4 py-3 text-sm font-medium text-fuego-rojo">{error}</p>}

        <div className="recuadro p-6">
          <h2 className="mb-4 font-title text-lg font-extrabold uppercase text-tinta">Tus datos</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className={inputCls} placeholder="Nombre *" {...register("nombre", { required: true })} />
            <input className={inputCls} placeholder="Apellido" {...register("apellido")} />
            <input className={inputCls} placeholder="Teléfono / WhatsApp *" {...register("telefono", { required: true })} />
            <input className={inputCls} type="email" placeholder="Email" {...register("email")} />
          </div>
        </div>

        <div className="recuadro p-6">
          <h2 className="mb-4 font-title text-lg font-extrabold uppercase text-tinta">Entrega</h2>
          <select className={inputCls + " mb-4"} {...register("metodoEntrega")}>
            {metodosEntrega.map((m) => (
              <option key={m.nombre} value={m.nombre}>{m.nombre}{m.costo > 0 ? ` — ${formatGs(m.costo)}` : ""}</option>
            ))}
          </select>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className={inputCls} placeholder="Ciudad" {...register("ciudad")} />
            <input className={inputCls} placeholder="Barrio" {...register("barrio")} />
            <input className={inputCls + " sm:col-span-2"} placeholder="Dirección" {...register("direccion")} />
            <input className={inputCls + " sm:col-span-2"} placeholder="Referencia" {...register("referencia")} />
          </div>
        </div>

        <div className="recuadro p-6">
          <h2 className="mb-4 font-title text-lg font-extrabold uppercase text-tinta">Pago</h2>
          <select className={inputCls} {...register("metodoPago")}>
            {metodosPago.map((m) => <option key={m.nombre} value={m.nombre}>{m.nombre}</option>)}
          </select>
          <textarea className={inputCls + " mt-4 min-h-20"} placeholder="Observaciones (opcional)" {...register("observaciones")} />
        </div>
      </div>

      <aside className="recuadro h-fit p-6">
        <h2 className="font-title text-lg font-extrabold uppercase text-tinta">Tu pedido</h2>
        <div className="mt-4 space-y-2 border-t border-black/10 pt-4">
          {items.map((i) => (
            <div key={`${i.productoId}-${i.varianteId ?? ""}`} className="flex justify-between text-sm">
              <span className="text-tinta-suave">{i.cantidad}x {i.nombre}</span>
              <span className="text-tinta">{i.precio > 0 ? formatGs(i.precio * i.cantidad) : "—"}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 border-t border-black/10 pt-4 text-sm">
          <div className="flex justify-between"><span className="text-tinta-suave">Subtotal</span><span>{formatGs(subtotal)}</span></div>
          <div className="flex justify-between"><span className="text-tinta-suave">Envío</span><span>{envio > 0 ? formatGs(envio) : "Gratis"}</span></div>
          <div className="flex justify-between pt-2 font-title text-lg font-extrabold text-tinta"><span>Total</span><span>{formatGs(total)}</span></div>
        </div>
        <p className="mt-2 text-xs text-tinta-tenue">El total final se calcula y confirma en el servidor.</p>
        <button type="submit" disabled={formState.isSubmitting} className="btn-fuego mt-5 w-full disabled:opacity-60">
          {formState.isSubmitting ? "Enviando…" : "Confirmar pedido"}
        </button>
      </aside>
    </form>
  );
}
