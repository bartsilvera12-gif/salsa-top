import { requirePerfil } from "@/lib/auth";
import { menuPara } from "@/lib/permisos";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Exige sesión válida + perfil activo (cualquier rol autorizado).
  const perfil = await requirePerfil();
  const items = menuPara(perfil.rol);

  return (
    <AdminShell items={items} perfil={perfil}>
      {children}
    </AdminShell>
  );
}
