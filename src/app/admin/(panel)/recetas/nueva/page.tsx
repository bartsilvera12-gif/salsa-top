"use client";

import { RecetaForm } from "@/components/admin/receta-form";

export default function NuevaRecetaPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Nueva receta</h2>
      <RecetaForm receta={null} />
    </div>
  );
}
