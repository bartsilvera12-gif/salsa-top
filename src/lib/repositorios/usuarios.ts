// Repositorio tipado de Usuarios (tabla `perfiles`, perfiles administrativos).
// Nota: la CREACIÓN de usuarios requiere service_role → se resuelve vía Edge
// Function (no en el frontend). Este repo cubre lectura/actualización/estado.
import { crearRepo } from "@/lib/repositorios/base";

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

export const usuariosRepo = crearRepo<Usuario>({
  tabla: "perfiles",
  campoBusqueda: "nombre",
  ordenDefault: { campo: "creado_en", asc: true },
});
