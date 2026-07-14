"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cuponesRepo, type Cupon } from "@/lib/repositorios/cupones";
import { CuponForm } from "@/components/admin/cupon-form";

function EditarInterior() {
  const sp = useSearchParams();
  const id = sp.get("id");

  const [cupon, setCupon] = useState<Cupon | null>(null);
  const [estado, setEstado] = useState<"cargando" | "ok" | "nohay">("cargando");

  useEffect(() => {
    if (!id) {
      setEstado("nohay");
      return;
    }
    cuponesRepo.obtener(id).then((c) => {
      if (!c) setEstado("nohay");
      else {
        setCupon(c);
        setEstado("ok");
      }
    });
  }, [id]);

  if (estado === "cargando") {
    return <p className="py-10 text-center text-tinta-tenue">Cargando…</p>;
  }
  if (estado === "nohay" || !cupon) {
    return (
      <div className="recuadro p-10 text-center">
        <p className="text-tinta-suave">Cupón no encontrado.</p>
        <Link href="/admin/cupones/" className="btn-fuego mt-4">Volver a cupones</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Editar cupón: {cupon.codigo}</h2>
      <CuponForm cupon={cupon} />
    </div>
  );
}

export default function EditarCuponPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-tinta-tenue">Cargando…</p>}>
      <EditarInterior />
    </Suspense>
  );
}
