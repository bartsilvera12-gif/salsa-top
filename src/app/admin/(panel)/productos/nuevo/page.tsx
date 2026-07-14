"use client";

import { useEffect, useState } from "react";
import { getCategoriasOpcionesCliente, getEtiquetasOpcionesCliente } from "@/lib/admin-datos-cliente";
import { ProductoForm } from "@/components/admin/producto-form";
import type { Opcion } from "@/lib/admin-datos";

export default function NuevoProductoPage() {
  const [categorias, setCategorias] = useState<Opcion[]>([]);
  const [etiquetas, setEtiquetas] = useState<Opcion[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([getCategoriasOpcionesCliente(), getEtiquetasOpcionesCliente()]).then(([c, e]) => {
      setCategorias(c);
      setEtiquetas(e);
      setCargando(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Nuevo producto</h2>
      {cargando ? (
        <p className="py-10 text-center text-tinta-tenue">Cargando…</p>
      ) : (
        <ProductoForm producto={null} etiquetasProducto={[]} categorias={categorias} etiquetas={etiquetas} />
      )}
    </div>
  );
}
