// Tipos compartidos por la infraestructura CRUD cliente.

/** Resultado uniforme de una escritura (punto 5: manejo de errores). */
export type Resultado<T = void> = { ok: true; data: T } | { ok: false; error: string };

/** Listado paginado. */
export type Lista<T> = { rows: T[]; total: number };

/** Un filtro de igualdad (campo = valor). */
export type Filtro = { campo: string; valor: string | number | boolean };

export type OpcionesListar = {
  q?: string;
  filtros?: Filtro[];
  page?: number;
  select?: string;
  orden?: { campo: string; asc?: boolean };
};

export const ok = <T>(data: T): Resultado<T> => ({ ok: true, data });
export const fallo = (error: string): Resultado<never> => ({ ok: false, error });
