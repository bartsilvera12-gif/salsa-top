"use client";

import { BeneficioForm } from "@/components/admin/beneficio-form";

export default function NuevoBeneficioPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Nuevo beneficio</h2>
      <BeneficioForm beneficio={null} />
    </div>
  );
}
