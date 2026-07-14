// Edge Function: alta de usuarios administrativos.
//
// La creación de un usuario requiere service_role (crea la cuenta en Auth), por
// lo que NO puede correr en el navegador. Esta función:
//   1) Autoriza al invocador verificando por su JWT que sea super_admin ACTIVO.
//   2) Recién entonces usa el service_role para crear el usuario en Auth + su
//      perfil (con rollback si el perfil falla).
//
// El service_role NUNCA sale de esta función (variable de entorno del servidor).
//
// --- DESPLIEGUE (revisar antes; NO desplegado todavía) ---
//   supabase functions deploy crear-usuario
// Secrets (los provee la plataforma automáticamente):
//   SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
//
// deno-lint-ignore-file
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SCHEMA = "saltatop";
const ROLES = ["super_admin", "administrador", "editor", "operador_pedidos"];

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Método no permitido." }, 405);

  const url = Deno.env.get("SUPABASE_URL")!;
  const anon = Deno.env.get("SUPABASE_ANON_KEY")!;
  const serviceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

  // 1) Autorización: el invocador debe ser super_admin activo (según su JWT).
  const authHeader = req.headers.get("Authorization") ?? "";
  if (!authHeader.startsWith("Bearer ")) return json({ error: "No autorizado." }, 401);

  const comoUsuario = createClient(url, anon, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userErr } = await comoUsuario.auth.getUser();
  if (userErr || !userData?.user) return json({ error: "No autorizado." }, 401);

  const admin = createClient(url, serviceRole, { db: { schema: SCHEMA } });
  const { data: perfil } = await admin
    .from("perfiles")
    .select("rol, activo")
    .eq("auth_user_id", userData.user.id)
    .maybeSingle();
  if (!perfil || perfil.activo !== true || perfil.rol !== "super_admin") {
    return json({ error: "Requiere rol super_admin." }, 403);
  }

  // 2) Validación de entrada (misma que el server action original).
  let input: Record<string, unknown>;
  try {
    input = await req.json();
  } catch {
    return json({ error: "JSON inválido." }, 400);
  }
  const nombre = String(input?.nombre ?? "").trim();
  const apellido = input?.apellido ? String(input.apellido).trim() : null;
  const email = String(input?.email ?? "").trim().toLowerCase();
  const password = String(input?.password ?? "");
  const rol = String(input?.rol ?? "");
  if (!nombre) return json({ error: "El nombre es obligatorio." }, 400);
  if (!email.includes("@")) return json({ error: "Email inválido." }, 400);
  if (password.length < 8) return json({ error: "La contraseña debe tener al menos 8 caracteres." }, 400);
  if (!ROLES.includes(rol)) return json({ error: "Rol inválido." }, 400);

  // 3) Crear usuario en Auth (service_role) + su perfil, con rollback.
  const { data: creado, error: authErr } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (authErr || !creado?.user) {
    const msg = authErr?.message?.includes("registered")
      ? "Ese email ya está registrado."
      : (authErr?.message ?? "No se pudo crear el usuario.");
    return json({ error: msg }, 400);
  }

  const { error: perfilErr } = await admin.from("perfiles").insert({
    auth_user_id: creado.user.id,
    nombre,
    apellido,
    email,
    rol,
    activo: true,
  });
  if (perfilErr) {
    // Revertir el usuario de Auth si no se pudo crear el perfil.
    await admin.auth.admin.deleteUser(creado.user.id);
    return json({ error: "No se pudo crear el perfil: " + perfilErr.message }, 400);
  }

  return json({ ok: true });
});
