"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCarrito } from "@/lib/carrito";

export function AddToCart({
  productoId,
  nombre,
  precio,
  imagen,
  slug,
}: {
  productoId: string;
  nombre: string;
  precio: number;
  imagen: string | null;
  slug: string;
}) {
  const { agregar } = useCarrito();
  const [ok, setOk] = useState(false);

  function onAdd() {
    agregar({ productoId, nombre, precio, imagen, slug });
    setOk(true);
    setTimeout(() => setOk(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={onAdd}
      className="btn-fuego mt-3 w-full py-2.5 text-sm"
      aria-label={`Agregar ${nombre} al carrito`}
    >
      {ok ? (
        <>
          <Check size={16} /> Agregado
        </>
      ) : (
        <>
          <ShoppingCart size={16} /> Agregar
        </>
      )}
    </button>
  );
}
