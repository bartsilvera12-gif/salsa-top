"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requirePerfil } from "@/lib/auth";
import { SUPER } from "@/lib/permisos";
import { usuarioCrearSchema } from "@/lib/schemas";

type Resultado = { ok: true } | { error: string };

/** Crea un usuario en Supabase Auth (server, service_role) y su perfil. */
export async function crearUsuario(input: unknown): Promise<Resultado> {
  await requirePerfil(SUPER);
  const parsed = usuarioCrearSchema.safeParse(input);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  const d = parsed.data;

  const admin = createAdminClient();
  const { data: creado, error: authErr } = await admin.auth.admin.createUser({
    email: d.email,
    password: d.password,
    email_confirm: true,
  });
  if (authErr || !creado?.user) {
    return { error: authErr?.message.includes("registered") ? "Ese email ya está registrado." : (authErr?.message ?? "No se pudo crear el usuario.") };
  }

  const { error: perfilErr } = await admin.from("perfiles").insert({
    auth_user_id: creado.user.id,
    nombre: d.nombre,
    apellido: d.apellido || null,
    email: d.email,
    rol: d.rol,
    activo: true,
  });
  if (perfilErr) {
    // Revertir el usuario de Auth si no se pudo crear el perfil.
    await admin.auth.admin.deleteUser(creado.user.id);
    return { error: "No se pudo crear el perfil: " + perfilErr.message };
  }

  revalidatePath("/admin/usuarios");
  return { ok: true };
}

export async function cambiarRolUsuario(id: string, rol: string): Promise<void> {
  await requirePerfil(SUPER);
  const roles = ["super_admin", "administrador", "editor", "operador_pedidos"];
  if (!roles.includes(rol)) return;
  const supabase = await createClient();
  await supabase.from("perfiles").update({ rol }).eq("id", id);
  revalidatePath("/admin/usuarios");
}

export async function alternarActivoUsuario(id: string, activo: boolean): Promise<void> {
  await requirePerfil(SUPER);
  const supabase = await createClient();
  await supabase.from("perfiles").update({ activo }).eq("id", id);
  revalidatePath("/admin/usuarios");
}
