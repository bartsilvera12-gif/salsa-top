import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { SeccionForm } from "@/components/admin/seccion-form";

export const dynamic = "force-dynamic";

export default async function NuevaSeccionPage() {
  await requirePerfil(CONTENIDO);
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Nueva sección</h2>
      <SeccionForm seccion={null} />
    </div>
  );
}
