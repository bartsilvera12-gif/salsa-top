"use client";

import { menuPara } from "@/lib/permisos";
import { AdminShell } from "@/components/admin/admin-shell";
import { SesionProvider, useSesion } from "@/lib/sesion";
import { ToastProvider } from "@/components/admin/toast";

function PanelInterior({ children }: { children: React.ReactNode }) {
  const { perfil, cargando } = useSesion();

  if (cargando || !perfil) {
    return (
      <div className="grid min-h-screen place-items-center bg-crema-suave">
        <div className="flex flex-col items-center gap-3">
          <span className="h-10 w-10 animate-spin rounded-full border-4 border-fuego-naranja border-t-transparent" />
          <p className="text-sm font-medium text-tinta-tenue">Cargando panel…</p>
        </div>
      </div>
    );
  }

  const items = menuPara(perfil.rol);
  return (
    <AdminShell items={items} perfil={perfil}>
      {children}
    </AdminShell>
  );
}

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <SesionProvider>
        <PanelInterior>{children}</PanelInterior>
      </SesionProvider>
    </ToastProvider>
  );
}
