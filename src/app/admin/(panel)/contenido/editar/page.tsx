"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { seccionesRepo, type Seccion } from "@/lib/repositorios/secciones";
import { SeccionForm } from "@/components/admin/seccion-form";

function EditarInterior() {
  const sp = useSearchParams();
  const id = sp.get("id");

  const [seccion, setSeccion] = useState<Seccion | null>(null);
  const [estado, setEstado] = useState<"cargando" | "ok" | "nohay">("cargando");

  useEffect(() => {
    if (!id) {
      setEstado("nohay");
      return;
    }
    seccionesRepo.obtener(id).then((s) => {
      if (!s) setEstado("nohay");
      else {
        setSeccion(s);
        setEstado("ok");
      }
    });
  }, [id]);

  if (estado === "cargando") {
    return <p className="py-10 text-center text-tinta-tenue">Cargando…</p>;
  }
  if (estado === "nohay" || !seccion) {
    return (
      <div className="recuadro p-10 text-center">
        <p className="text-tinta-suave">Sección no encontrada.</p>
        <Link href="/admin/contenido/" className="btn-fuego mt-4">Volver a contenido</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">
        Sección: {seccion.clave}
      </h2>
      <SeccionForm seccion={seccion} />
    </div>
  );
}

export default function EditarSeccionPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-tinta-tenue">Cargando…</p>}>
      <EditarInterior />
    </Suspense>
  );
}
