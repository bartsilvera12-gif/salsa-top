import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { getArchivosAdmin } from "@/lib/admin-datos";
import { MultimediaManager } from "@/components/admin/multimedia-manager";

export const dynamic = "force-dynamic";

export default async function MultimediaPage() {
  await requirePerfil(CONTENIDO);
  const archivos = await getArchivosAdmin();

  return (
    <div className="space-y-5">
      <p className="text-sm text-tinta-tenue">Biblioteca de imágenes reutilizables. Copiá la URL para usarla donde quieras.</p>
      <MultimediaManager archivos={archivos} />
    </div>
  );
}
