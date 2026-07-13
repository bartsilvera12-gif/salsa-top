"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ItemCarrito = {
  productoId: string;
  varianteId?: string | null;
  nombre: string;
  precio: number;
  imagen: string | null;
  slug: string;
  cantidad: number;
};

type CarritoCtx = {
  items: ItemCarrito[];
  agregar: (item: Omit<ItemCarrito, "cantidad">, cantidad?: number) => void;
  quitar: (productoId: string, varianteId?: string | null) => void;
  cambiarCantidad: (productoId: string, cantidad: number, varianteId?: string | null) => void;
  vaciar: () => void;
  subtotal: number;
  cantidadTotal: number;
  cargado: boolean;
};

const CLAVE = "salsatop_carrito";
const Ctx = createContext<CarritoCtx | null>(null);

function mismaLinea(a: ItemCarrito, productoId: string, varianteId?: string | null) {
  return a.productoId === productoId && (a.varianteId ?? null) === (varianteId ?? null);
}

export function CarritoProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ItemCarrito[]>([]);
  const [cargado, setCargado] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(CLAVE);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignorar
    }
    setCargado(true);
  }, []);

  useEffect(() => {
    if (cargado) {
      try {
        localStorage.setItem(CLAVE, JSON.stringify(items));
      } catch {
        // ignorar
      }
    }
  }, [items, cargado]);

  const api = useMemo<CarritoCtx>(() => {
    const subtotal = items.reduce((s, i) => s + i.precio * i.cantidad, 0);
    const cantidadTotal = items.reduce((s, i) => s + i.cantidad, 0);
    return {
      items,
      subtotal,
      cantidadTotal,
      cargado,
      agregar: (item, cantidad = 1) =>
        setItems((prev) => {
          const idx = prev.findIndex((p) => mismaLinea(p, item.productoId, item.varianteId));
          if (idx >= 0) {
            const copia = [...prev];
            copia[idx] = { ...copia[idx], cantidad: copia[idx].cantidad + cantidad };
            return copia;
          }
          return [...prev, { ...item, cantidad }];
        }),
      quitar: (productoId, varianteId) =>
        setItems((prev) => prev.filter((p) => !mismaLinea(p, productoId, varianteId))),
      cambiarCantidad: (productoId, cantidad, varianteId) =>
        setItems((prev) =>
          prev
            .map((p) => (mismaLinea(p, productoId, varianteId) ? { ...p, cantidad } : p))
            .filter((p) => p.cantidad > 0),
        ),
      vaciar: () => setItems([]),
    };
  }, [items, cargado]);

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useCarrito() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
}
