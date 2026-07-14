"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { bannersRepo, type Banner } from "@/lib/repositorios/banners";
import { BannerForm } from "@/components/admin/banner-form";

function EditarInterior() {
  const sp = useSearchParams();
  const id = sp.get("id");

  const [banner, setBanner] = useState<Banner | null>(null);
  const [estado, setEstado] = useState<"cargando" | "ok" | "nohay">("cargando");

  useEffect(() => {
    if (!id) {
      setEstado("nohay");
      return;
    }
    bannersRepo.obtener(id).then((b) => {
      if (!b) setEstado("nohay");
      else {
        setBanner(b);
        setEstado("ok");
      }
    });
  }, [id]);

  if (estado === "cargando") {
    return <p className="py-10 text-center text-tinta-tenue">Cargando…</p>;
  }
  if (estado === "nohay" || !banner) {
    return (
      <div className="recuadro p-10 text-center">
        <p className="text-tinta-suave">Banner no encontrado.</p>
        <Link href="/admin/banners/" className="btn-fuego mt-4">Volver a banners</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Editar banner</h2>
      <BannerForm banner={banner} />
    </div>
  );
}

export default function EditarBannerPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-tinta-tenue">Cargando…</p>}>
      <EditarInterior />
    </Suspense>
  );
}
