// Repositorio tipado de Clientes.
// Nota: el listado del módulo usa búsqueda multi-campo (nombre/telefono/email);
// se resolverá en la migración de Clientes (la base sólo hace ilike de un campo).
import { crearRepo } from "@/lib/repositorios/base";

export type Cliente = {
  id: string;
  nombre: string;
  apellido: string | null;
  telefono: string;
  email: string | null;
  ciudad: string | null;
  barrio: string | null;
  direccion: string | null;
  referencia: string | null;
  documento: string | null;
  notas: string | null;
  activo: boolean;
  creado_en: string;
};

export const clientesRepo = crearRepo<Cliente>({
  tabla: "clientes",
  campoBusqueda: "nombre",
  ordenDefault: { campo: "creado_en", asc: false },
});
