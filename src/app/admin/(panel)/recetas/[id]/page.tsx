import { notFound } from "next/navigation";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { getRecetaById } from "@/lib/admin-datos";
import { RecetaForm } from "@/components/admin/receta-form";

export const dynamic = "force-dynamic";

export default async function EditarRecetaPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePerfil(CONTENIDO);
  const { id } = await params;
  const receta = await getRecetaById(id);
  if (!receta) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Editar: {receta.titulo}</h2>
      <RecetaForm receta={receta} />
    </div>
  );
}
