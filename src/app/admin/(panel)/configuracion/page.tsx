import { requirePerfil } from "@/lib/auth";
import { ADMIN } from "@/lib/permisos";
import { getConfiguracionAdmin } from "@/lib/admin-datos";
import { ConfiguracionForm } from "@/components/admin/configuracion-form";

export const dynamic = "force-dynamic";

export default async function ConfiguracionPage() {
  await requirePerfil(ADMIN);
  const config = await getConfiguracionAdmin();

  return (
    <div className="mx-auto max-w-4xl">
      <p className="mb-5 text-sm text-tinta-tenue">
        Estos datos alimentan la web pública (marca, contacto, redes, envíos).
      </p>
      <ConfiguracionForm config={config} />
    </div>
  );
}
