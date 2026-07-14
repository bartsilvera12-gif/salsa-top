"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  getProductoByIdCliente,
  getCategoriasOpcionesCliente,
  getEtiquetasOpcionesCliente,
} from "@/lib/admin-datos-cliente";
import { ProductoForm } from "@/components/admin/producto-form";
import type { ProductoRow, Opcion } from "@/lib/admin-datos";

function EditarInterior() {
  const sp = useSearchParams();
  const id = sp.get("id");

  const [data, setData] = useState<{ producto: ProductoRow; etiquetas: string[] } | null>(null);
  const [categorias, setCategorias] = useState<Opcion[]>([]);
  const [etiquetas, setEtiquetas] = useState<Opcion[]>([]);
  const [estado, setEstado] = useState<"cargando" | "ok" | "nohay">("cargando");

  useEffect(() => {
    if (!id) {
      setEstado("nohay");
      return;
    }
    Promise.all([
      getProductoByIdCliente(id),
      getCategoriasOpcionesCliente(),
      getEtiquetasOpcionesCliente(),
    ]).then(([d, c, e]) => {
      setCategorias(c);
      setEtiquetas(e);
      if (!d) setEstado("nohay");
      else {
        setData(d);
        setEstado("ok");
      }
    });
  }, [id]);

  if (estado === "cargando") {
    return <p className="py-10 text-center text-tinta-tenue">Cargando…</p>;
  }
  if (estado === "nohay" || !data) {
    return (
      <div className="recuadro p-10 text-center">
        <p className="text-tinta-suave">Producto no encontrado.</p>
        <Link href="/admin/productos/" className="btn-fuego mt-4">Volver a productos</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">
        Editar: {data.producto.nombre}
      </h2>
      <ProductoForm
        producto={data.producto}
        etiquetasProducto={data.etiquetas}
        categorias={categorias}
        etiquetas={etiquetas}
      />
    </div>
  );
}

export default function EditarProductoPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-tinta-tenue">Cargando…</p>}>
      <EditarInterior />
    </Suspense>
  );
}
