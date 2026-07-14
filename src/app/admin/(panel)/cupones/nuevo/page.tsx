"use client";

import { CuponForm } from "@/components/admin/cupon-form";

export default function NuevoCuponPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Nuevo cupón</h2>
      <CuponForm cupon={null} />
    </div>
  );
}
