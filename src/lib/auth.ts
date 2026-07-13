import "server-only";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Rol } from "@/lib/permisos";

export type Perfil = {
  id: string;
  auth_user_id: string;
  nombre: string;
  apellido: string | null;
  email: string;
  rol: Rol;
  activo: boolean;
  avatar_url: string | null;
  ultimo_acceso: string | null;
};

/** Devuelve el perfil activo del usuario logueado, o null. */
export async function getPerfilActual(): Promise<Perfil | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("perfiles")
    .select("id, auth_user_id, nombre, apellido, email, rol, activo, avatar_url, ultimo_acceso")
    .eq("auth_user_id", user.id)
    .eq("activo", true)
    .maybeSingle();

  return (data as Perfil | null) ?? null;
}

/**
 * Exige sesión válida + perfil activo + (opcional) rol autorizado.
 * Redirige de forma segura si no cumple. Devuelve el perfil si todo OK.
 */
export async function requirePerfil(roles?: Rol[]): Promise<Perfil> {
  const perfil = await getPerfilActual();
  if (!perfil) {
    redirect("/admin/login?error=denegado");
  }
  if (roles && !roles.includes(perfil.rol)) {
    redirect("/admin?error=sin_permiso");
  }
  return perfil;
}
