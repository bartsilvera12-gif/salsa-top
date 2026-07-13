import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { PlaceholderModulo } from "@/components/admin/placeholder-modulo";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requirePerfil(CONTENIDO);
  return <PlaceholderModulo titulo="Testimonios" />;
}