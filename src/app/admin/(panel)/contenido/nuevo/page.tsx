"use client";

import { SeccionForm } from "@/components/admin/seccion-form";

export default function NuevaSeccionPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Nueva sección</h2>
      <SeccionForm seccion={null} />
    </div>
  );
}
