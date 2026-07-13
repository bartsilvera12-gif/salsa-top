import { notFound } from "next/navigation";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { getBannerById } from "@/lib/admin-datos";
import { BannerForm } from "@/components/admin/banner-form";

export const dynamic = "force-dynamic";

export default async function EditarBannerPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePerfil(CONTENIDO);
  const { id } = await params;
  const banner = await getBannerById(id);
  if (!banner) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Editar banner</h2>
      <BannerForm banner={banner} />
    </div>
  );
}
