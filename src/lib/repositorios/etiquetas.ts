// Repositorio tipado de Etiquetas.
import { crearRepo } from "@/lib/repositorios/base";

export type Etiqueta = {
  id: string;
  nombre: string;
  slug: string;
  color: string | null;
  activa: boolean;
};

export const etiquetasRepo = crearRepo<Etiqueta>({
  tabla: "etiquetas",
  campoBusqueda: "nombre",
  ordenDefault: { campo: "nombre", asc: true },
  traducirError: (m) =>
    m.includes("etiquetas_slug") ? "Ya existe una etiqueta con ese slug." : m,
});
