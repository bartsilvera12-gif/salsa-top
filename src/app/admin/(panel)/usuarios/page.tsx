import { requirePerfil } from "@/lib/auth";
import { SUPER } from "@/lib/permisos";
import { PlaceholderModulo } from "@/components/admin/placeholder-modulo";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requirePerfil(SUPER);
  return <PlaceholderModulo titulo="Usuarios" />;
}