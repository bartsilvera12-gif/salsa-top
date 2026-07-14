"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Sección "Contenido" ocultada del panel.
 * Toda ruta /admin/contenido (y subrutas: /nuevo, /editar) redirige al
 * Dashboard, por lo que la página queda inaccesible desde el panel.
 *
 * Para reactivarla:
 *  1) Borrar este archivo (layout.tsx).
 *  2) Volver a agregar el ítem "contenido" en src/lib/permisos.ts (MENU).
 */
export default function ContenidoBloqueadoLayout() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/admin");
  }, [router]);
  return null;
}
