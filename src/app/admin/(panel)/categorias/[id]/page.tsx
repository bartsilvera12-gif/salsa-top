import { notFound } from "next/navigation";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { getCategoriaById } from "@/lib/admin-datos";
import { CategoriaForm } from "@/components/admin/categoria-form";

export const dynamic = "force-dynamic";

export default async function EditarCategoriaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePerfil(CONTENIDO);
  const { id } = await params;
  const categoria = await getCategoriaById(id);
  if (!categoria) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">
        Editar: {categoria.nombre}
      </h2>
      <CategoriaForm categoria={categoria} />
    </div>
  );
}
