import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { RecetaForm } from "@/components/admin/receta-form";

export const dynamic = "force-dynamic";

export default async function NuevaRecetaPage() {
  await requirePerfil(CONTENIDO);
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Nueva receta</h2>
      <RecetaForm receta={null} />
    </div>
  );
}
