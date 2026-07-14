"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { recetasRepo, type Receta } from "@/lib/repositorios/recetas";
import { RecetaForm } from "@/components/admin/receta-form";

function EditarInterior() {
  const sp = useSearchParams();
  const id = sp.get("id");

  const [receta, setReceta] = useState<Receta | null>(null);
  const [estado, setEstado] = useState<"cargando" | "ok" | "nohay">("cargando");

  useEffect(() => {
    if (!id) {
      setEstado("nohay");
      return;
    }
    recetasRepo.obtener(id).then((r) => {
      if (!r) setEstado("nohay");
      else {
        setReceta(r);
        setEstado("ok");
      }
    });
  }, [id]);

  if (estado === "cargando") {
    return <p className="py-10 text-center text-tinta-tenue">Cargando…</p>;
  }
  if (estado === "nohay" || !receta) {
    return (
      <div className="recuadro p-10 text-center">
        <p className="text-tinta-suave">Receta no encontrada.</p>
        <Link href="/admin/recetas/" className="btn-fuego mt-4">Volver a recetas</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Editar: {receta.titulo}</h2>
      <RecetaForm receta={receta} />
    </div>
  );
}

export default function EditarRecetaPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-tinta-tenue">Cargando…</p>}>
      <EditarInterior />
    </Suspense>
  );
}
