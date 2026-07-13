import { requirePerfil } from "@/lib/auth";
import { OPERACIONES } from "@/lib/permisos";
import { PlaceholderModulo } from "@/components/admin/placeholder-modulo";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requirePerfil(OPERACIONES);
  return <PlaceholderModulo titulo="Pedidos" />;
}