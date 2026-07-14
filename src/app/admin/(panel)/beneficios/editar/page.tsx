"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { beneficiosRepo, type Beneficio } from "@/lib/repositorios/beneficios";
import { BeneficioForm } from "@/components/admin/beneficio-form";

function EditarInterior() {
  const sp = useSearchParams();
  const id = sp.get("id");

  const [beneficio, setBeneficio] = useState<Beneficio | null>(null);
  const [estado, setEstado] = useState<"cargando" | "ok" | "nohay">("cargando");

  useEffect(() => {
    if (!id) {
      setEstado("nohay");
      return;
    }
    beneficiosRepo.obtener(id).then((b) => {
      if (!b) setEstado("nohay");
      else {
        setBeneficio(b);
        setEstado("ok");
      }
    });
  }, [id]);

  if (estado === "cargando") {
    return <p className="py-10 text-center text-tinta-tenue">Cargando…</p>;
  }
  if (estado === "nohay" || !beneficio) {
    return (
      <div className="recuadro p-10 text-center">
        <p className="text-tinta-suave">Beneficio no encontrado.</p>
        <Link href="/admin/beneficios/" className="btn-fuego mt-4">Volver a beneficios</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Editar beneficio</h2>
      <BeneficioForm beneficio={beneficio} />
    </div>
  );
}

export default function EditarBeneficioPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-tinta-tenue">Cargando…</p>}>
      <EditarInterior />
    </Suspense>
  );
}
