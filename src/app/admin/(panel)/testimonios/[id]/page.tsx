import { notFound } from "next/navigation";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { getTestimonioById } from "@/lib/admin-datos";
import { TestimonioForm } from "@/components/admin/testimonio-form";

export const dynamic = "force-dynamic";

export default async function EditarTestimonioPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePerfil(CONTENIDO);
  const { id } = await params;
  const testimonio = await getTestimonioById(id);
  if (!testimonio) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Editar testimonio</h2>
      <TestimonioForm testimonio={testimonio} />
    </div>
  );
}
