"use client";

import { CategoriaForm } from "@/components/admin/categoria-form";

export default function NuevaCategoriaPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Nueva categoría</h2>
      <CategoriaForm categoria={null} />
    </div>
  );
}
