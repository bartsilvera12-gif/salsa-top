import { notFound } from "next/navigation";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { getSeccionById } from "@/lib/admin-datos";
import { SeccionForm } from "@/components/admin/seccion-form";

export const dynamic = "force-dynamic";

export default async function EditarSeccionPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePerfil(CONTENIDO);
  const { id } = await params;
  const seccion = await getSeccionById(id);
  if (!seccion) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">
        Sección: {seccion.clave}
      </h2>
      <SeccionForm seccion={seccion} />
    </div>
  );
}
