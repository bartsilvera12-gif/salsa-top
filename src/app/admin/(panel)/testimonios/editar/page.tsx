"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { testimoniosRepo, type Testimonio } from "@/lib/repositorios/testimonios";
import { TestimonioForm } from "@/components/admin/testimonio-form";

function EditarInterior() {
  const sp = useSearchParams();
  const id = sp.get("id");

  const [testimonio, setTestimonio] = useState<Testimonio | null>(null);
  const [estado, setEstado] = useState<"cargando" | "ok" | "nohay">("cargando");

  useEffect(() => {
    if (!id) {
      setEstado("nohay");
      return;
    }
    testimoniosRepo.obtener(id).then((t) => {
      if (!t) setEstado("nohay");
      else {
        setTestimonio(t);
        setEstado("ok");
      }
    });
  }, [id]);

  if (estado === "cargando") {
    return <p className="py-10 text-center text-tinta-tenue">Cargando…</p>;
  }
  if (estado === "nohay" || !testimonio) {
    return (
      <div className="recuadro p-10 text-center">
        <p className="text-tinta-suave">Testimonio no encontrado.</p>
        <Link href="/admin/testimonios/" className="btn-fuego mt-4">Volver a testimonios</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Editar testimonio</h2>
      <TestimonioForm testimonio={testimonio} />
    </div>
  );
}

export default function EditarTestimonioPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-tinta-tenue">Cargando…</p>}>
      <EditarInterior />
    </Suspense>
  );
}
