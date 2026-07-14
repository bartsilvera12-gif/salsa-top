// Repositorio tipado de Usuarios (tabla `perfiles`, perfiles administrativos).
// Lectura/rol/estado se hacen por RLS (policy perfil_super_admin_all).
// La CREACIÓN requiere service_role → se resuelve vía Edge Function `crear-usuario`
// (ver src/app/admin/(panel)/usuarios/acciones-cliente.ts).
import { crearCrud } from "@/lib/crud/crud-cliente";
import { getSupabase } from "@/lib/supabase/browser";

export type Usuario = {
  id: string;
  auth_user_id: string;
  nombre: string;
  apellido: string | null;
  email: string;
  rol: string;
  activo: boolean;
  ultimo_acceso: string | null;
  creado_en: string;
};

const crud = crearCrud({ tabla: "perfiles", ordenDefault: { campo: "creado_en", asc: true } });

export const usuariosRepo = {
  /** Listado completo de perfiles (misma consulta que la vista admin). */
  async listar(): Promise<Usuario[]> {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("perfiles")
      .select("id, auth_user_id, nombre, apellido, email, rol, activo, ultimo_acceso, creado_en")
      .order("creado_en", { ascending: true });
    return (data as Usuario[]) ?? [];
  },
  cambiarRol: (id: string, rol: string) => crud.actualizar(id, { rol }),
  alternarActivo: (id: string, activo: boolean) => crud.alternar(id, "activo", activo),
};
