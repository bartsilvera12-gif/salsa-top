import { requirePerfil } from "@/lib/auth";
import { ADMIN } from "@/lib/permisos";
import { PlaceholderModulo } from "@/components/admin/placeholder-modulo";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requirePerfil(ADMIN);
  return <PlaceholderModulo titulo="Cupones" />;
}