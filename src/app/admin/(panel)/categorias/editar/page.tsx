"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { categoriasRepo, type Categoria } from "@/lib/repositorios/categorias";
import { CategoriaForm } from "@/components/admin/categoria-form";

function EditarInterior() {
  const sp = useSearchParams();
  const id = sp.get("id");

  const [categoria, setCategoria] = useState<Categoria | null>(null);
  const [estado, setEstado] = useState<"cargando" | "ok" | "nohay">("cargando");

  useEffect(() => {
    if (!id) {
      setEstado("nohay");
      return;
    }
    categoriasRepo.obtener(id).then((c) => {
      if (!c) setEstado("nohay");
      else {
        setCategoria(c);
        setEstado("ok");
      }
    });
  }, [id]);

  if (estado === "cargando") {
    return <p className="py-10 text-center text-tinta-tenue">Cargando…</p>;
  }
  if (estado === "nohay" || !categoria) {
    return (
      <div className="recuadro p-10 text-center">
        <p className="text-tinta-suave">Categoría no encontrada.</p>
        <Link href="/admin/categorias/" className="btn-fuego mt-4">Volver a categorías</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">
        Editar: {categoria.nombre}
      </h2>
      <CategoriaForm categoria={categoria} />
    </div>
  );
}

export default function EditarCategoriaPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-tinta-tenue">Cargando…</p>}>
      <EditarInterior />
    </Suspense>
  );
}
