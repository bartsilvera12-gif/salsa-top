import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { CategoriaForm } from "@/components/admin/categoria-form";

export const dynamic = "force-dynamic";

export default async function NuevaCategoriaPage() {
  await requirePerfil(CONTENIDO);
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Nueva categoría</h2>
      <CategoriaForm categoria={null} />
    </div>
  );
}
