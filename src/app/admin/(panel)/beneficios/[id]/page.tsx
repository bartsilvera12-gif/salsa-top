import { notFound } from "next/navigation";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { getBeneficioById } from "@/lib/admin-datos";
import { BeneficioForm } from "@/components/admin/beneficio-form";

export const dynamic = "force-dynamic";

export default async function EditarBeneficioPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePerfil(CONTENIDO);
  const { id } = await params;
  const beneficio = await getBeneficioById(id);
  if (!beneficio) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Editar beneficio</h2>
      <BeneficioForm beneficio={beneficio} />
    </div>
  );
}
