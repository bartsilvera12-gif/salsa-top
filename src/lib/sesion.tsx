"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Rol } from "@/lib/permisos";

export type PerfilSesion = {
  id: string;
  nombre: string;
  apellido: string | null;
  email: string;
  rol: Rol;
  activo: boolean;
};

type Ctx = {
  perfil: PerfilSesion | null;
  cargando: boolean;
  cerrarSesion: () => Promise<void>;
};

const SesionCtx = createContext<Ctx | null>(null);

/**
 * Provee la sesión del panel leída 100% desde el navegador (sin servidor).
 * La seguridad real la hace RLS en la base; este guard es solo de UX/redirección.
 */
export function SesionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [perfil, setPerfil] = useState<PerfilSesion | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    let activo = true;
    const supabase = createClient();

    async function cargar() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        if (activo) {
          setPerfil(null);
          setCargando(false);
          router.replace("/admin/login/?error=denegado");
        }
        return;
      }
      const { data } = await supabase
        .from("perfiles")
        .select("id, nombre, apellido, email, rol, activo")
        .eq("auth_user_id", user.id)
        .eq("activo", true)
        .maybeSingle();

      if (!activo) return;
      if (!data) {
        setPerfil(null);
        setCargando(false);
        await supabase.auth.signOut();
        router.replace("/admin/login/?error=denegado");
        return;
      }
      setPerfil(data as PerfilSesion);
      setCargando(false);
    }

    cargar();
    return () => {
      activo = false;
    };
  }, [router]);

  async function cerrarSesion() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/admin/login/");
  }

  return (
    <SesionCtx.Provider value={{ perfil, cargando, cerrarSesion }}>
      {children}
    </SesionCtx.Provider>
  );
}

export function useSesion() {
  const ctx = useContext(SesionCtx);
  if (!ctx) throw new Error("useSesion debe usarse dentro de SesionProvider");
  return ctx;
}

/** Devuelve true si el perfil actual tiene alguno de los roles dados. */
export function tieneRol(perfil: PerfilSesion | null, roles: Rol[]): boolean {
  return !!perfil && roles.includes(perfil.rol);
}
