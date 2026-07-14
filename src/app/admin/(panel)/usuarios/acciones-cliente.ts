// Capa de servicio de Usuarios.
// - Alta: requiere service_role → se delega en la Edge Function `crear-usuario`
//   (invocada con el JWT del super_admin; el service_role NUNCA llega al browser).
// - Rol / estado: updates sobre `perfiles` por RLS (policy perfil_super_admin_all).
import { usuariosRepo } from "@/lib/repositorios/usuarios";
import { getSupabase } from "@/lib/supabase/browser";
import { usuarioCrearSchema } from "@/lib/schemas";
import { ROLES } from "@/lib/permisos";

type Resultado = { ok: true } | { error: string };

export async function crearUsuarioCliente(input: unknown): Promise<Resultado> {
  const parsed = usuarioCrearSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };

  const { data, error } = await getSupabase().functions.invoke("crear-usuario", {
    body: parsed.data,
  });

  if (error) {
    // functions.invoke marca error en respuestas no-2xx; el mensaje viene en el body.
    let msg = "No se pudo crear el usuario.";
    try {
      const body = await (error as { context?: Response }).context?.json?.();
      if (body?.error) msg = body.error as string;
    } catch {
      /* noop */
    }
    return { error: msg };
  }
  const r = data as { ok?: true; error?: string } | null;
  if (r?.error) return { error: r.error };
  return { ok: true };
}

export async function cambiarRolUsuarioCliente(id: string, rol: string): Promise<Resultado> {
  if (!ROLES.includes(rol as (typeof ROLES)[number])) return { error: "Rol inválido." };
  const r = await usuariosRepo.cambiarRol(id, rol);
  return r.ok ? { ok: true } : { error: r.error };
}

export async function alternarActivoUsuarioCliente(id: string, activo: boolean): Promise<Resultado> {
  const r = await usuariosRepo.alternarActivo(id, activo);
  return r.ok ? { ok: true } : { error: r.error };
}
