// Helper común de paginación (punto 2).

export const TAM_PAGINA = 12;

/** Rango [desde, hasta] para `.range()` de Supabase según la página. */
export function rango(page: number, pageSize: number = TAM_PAGINA) {
  const p = Math.max(1, page || 1);
  const desde = (p - 1) * pageSize;
  return { desde, hasta: desde + pageSize - 1 };
}

/** Cantidad total de páginas. */
export function totalPaginas(total: number, pageSize: number = TAM_PAGINA): number {
  return Math.max(1, Math.ceil((total || 0) / pageSize));
}
