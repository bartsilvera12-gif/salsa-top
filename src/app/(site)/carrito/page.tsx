"use client";

import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import { useCarrito } from "@/lib/carrito";
import { formatGs } from "@/lib/utils";

export default function CarritoPage() {
  const { items, subtotal, cambiarCantidad, quitar, vaciar, cargado } = useCarrito();

  if (cargado && items.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24 text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-fuego-gradient text-[#1a0e00]">
          <ShoppingCart size={28} />
        </span>
        <h1 className="mt-5 font-title text-3xl font-extrabold uppercase text-tinta">Tu carrito está vacío</h1>
        <p className="mt-2 text-tinta-suave">Agregá productos para hacer tu pedido.</p>
        <Link href="/#productos" className="btn-fuego mt-6">Ver productos</Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-6 font-title text-3xl font-extrabold uppercase text-tinta sm:text-4xl">Tu carrito</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-3">
          {items.map((i) => (
            <div key={`${i.productoId}-${i.varianteId ?? ""}`} className="recuadro flex items-center gap-4 p-4">
              <div className="relative h-16 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-white">
                {i.imagen && <Image src={i.imagen} alt={i.nombre} fill className="object-contain" sizes="56px" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-title text-sm font-extrabold uppercase text-tinta">{i.nombre}</p>
                <p className="text-sm text-tinta-tenue">{i.precio > 0 ? formatGs(i.precio) : "A confirmar"}</p>
              </div>
              <div className="flex items-center gap-1 rounded-lg border border-black/15 bg-white">
                <button onClick={() => cambiarCantidad(i.productoId, i.cantidad - 1, i.varianteId)} className="grid h-8 w-8 place-items-center text-tinta hover:bg-black/5" aria-label="Menos"><Minus size={14} /></button>
                <span className="w-7 text-center text-sm font-semibold">{i.cantidad}</span>
                <button onClick={() => cambiarCantidad(i.productoId, i.cantidad + 1, i.varianteId)} className="grid h-8 w-8 place-items-center text-tinta hover:bg-black/5" aria-label="Más"><Plus size={14} /></button>
              </div>
              <button onClick={() => quitar(i.productoId, i.varianteId)} className="grid h-8 w-8 place-items-center rounded-lg text-fuego-rojo hover:bg-fuego-rojo/10" aria-label="Quitar"><Trash2 size={16} /></button>
            </div>
          ))}
          <button onClick={vaciar} className="text-sm font-medium text-tinta-tenue hover:text-fuego-rojo">Vaciar carrito</button>
        </div>

        <aside className="recuadro h-fit p-6">
          <h2 className="font-title text-lg font-extrabold uppercase text-tinta">Resumen</h2>
          <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-4">
            <span className="text-tinta-suave">Subtotal</span>
            <span className="font-title text-xl font-extrabold text-tinta">{formatGs(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-tinta-tenue">El envío se calcula en el siguiente paso.</p>
          <Link href="/checkout" className="btn-fuego mt-5 w-full">Continuar <ArrowRight size={18} /></Link>
          <Link href="/#productos" className="mt-3 block text-center text-sm font-medium text-acento hover:underline">Seguir comprando</Link>
        </aside>
      </div>
    </main>
  );
}
