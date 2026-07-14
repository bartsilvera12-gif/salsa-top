"use client";

import { BannerForm } from "@/components/admin/banner-form";

export default function NuevoBannerPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Nuevo banner</h2>
      <BannerForm banner={null} />
    </div>
  );
}
