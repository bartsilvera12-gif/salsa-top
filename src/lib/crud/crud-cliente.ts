// CRUD base reutilizable para el panel (punto 1). Todos los módulos comparten
// esta infraestructura: búsqueda ilike (4), filtros (3), paginación (2),
// manejo de errores (5) y una única instancia de Supabase (10).
import { getSupabase } from "@/lib/supabase/browser";
import { rango, TAM_PAGINA } from "@/lib/crud/paginacion";
import { ok, fallo, type Lista, type OpcionesListar, type Resultado } from "@/lib/crud/tipos";

export type ConfigCrud = {
  /** Nombre de la tabla en el schema saltatop. */
  tabla: string;
  /** Columnas por defecto para listar/obtener. */
  select?: string;
  /** Campo sobre el que aplica la búsqueda ilike. */
  campoBusqueda?: string;
  /** Orden por defecto del listado. */
  ordenDefault?: { campo: string; asc?: boolean };
  /** Tamaño de página. */
  pageSize?: number;
  /** Traduce mensajes de error de Postgres a texto amigable. */
  traducirError?: (msg: string) => string;
};

export function crearCrud(config: ConfigCrud) {
  const pageSize = config.pageSize ?? TAM_PAGINA;
  const selectDefault = config.select ?? "*";
  const traducir = (msg: string) => (config.traducirError ? config.traducirError(msg) : msg);

  /** Listado paginado con búsqueda + filtros. Devuelve filas crudas (T). */
  async function listar<T>(opts: OpcionesListar = {}): Promise<Lista<T>> {
    try {
      const supabase = getSupabase();
      const { desde, hasta } = rango(opts.page ?? 1, pageSize);
      const orden = opts.orden ?? config.ordenDefault ?? { campo: "creado_en", asc: false };

      let query = supabase
        .from(config.tabla)
        .select(opts.select ?? selectDefault, { count: "exact" })
        .order(orden.campo, { ascending: orden.asc ?? false })
        .range(desde, hasta);

      if (opts.q && config.campoBusqueda) {
        query = query.ilike(config.campoBusqueda, `%${opts.q}%`);
      }
      for (const f of opts.filtros ?? []) {
        query = query.eq(f.campo, f.valor);
      }

      const { data, count } = await query;
      return { rows: (data as T[]) ?? [], total: count ?? 0 };
    } catch {
      return { rows: [], total: 0 };
    }
  }

  async function obtener<T>(id: string, select?: string): Promise<T | null> {
    try {
      const supabase = getSupabase();
      const { data } = await supabase
        .from(config.tabla)
        .select(select ?? selectDefault)
        .eq("id", id)
        .maybeSingle();
      return (data as T | null) ?? null;
    } catch {
      return null;
    }
  }

  /** Opciones para selects (id + nombre por defecto). */
  async function opciones(
    select = "id, nombre",
    orden = "nombre",
  ): Promise<{ id: string; nombre: string }[]> {
    try {
      const supabase = getSupabase();
      const { data } = await supabase.from(config.tabla).select(select).order(orden);
      return (data as unknown as { id: string; nombre: string }[]) ?? [];
    } catch {
      return [];
    }
  }

  async function insertar(payload: Record<string, unknown>): Promise<Resultado<{ id: string }>> {
    const supabase = getSupabase();
    const { data, error } = await supabase.from(config.tabla).insert(payload).select("id").single();
    if (error) return fallo(traducir(error.message));
    return ok({ id: (data as { id: string }).id });
  }

  async function actualizar(id: string, payload: Record<string, unknown>): Promise<Resultado> {
    const supabase = getSupabase();
    const { error } = await supabase.from(config.tabla).update(payload).eq("id", id);
    if (error) return fallo(traducir(error.message));
    return ok(undefined);
  }

  async function alternar(id: string, campo: string, valor: boolean): Promise<Resultado> {
    const supabase = getSupabase();
    const { error } = await supabase.from(config.tabla).update({ [campo]: valor }).eq("id", id);
    if (error) return fallo(traducir(error.message));
    return ok(undefined);
  }

  async function eliminar(id: string): Promise<Resultado> {
    const supabase = getSupabase();
    const { error } = await supabase.from(config.tabla).delete().eq("id", id);
    if (error) return fallo(traducir(error.message));
    return ok(undefined);
  }

  /** Duplica una fila; `ajustar` modifica la copia (quitar id, cambiar nombre…). */
  async function duplicar(
    id: string,
    ajustar: (fila: Record<string, unknown>) => Record<string, unknown>,
  ): Promise<Resultado> {
    const supabase = getSupabase();
    const { data } = await supabase.from(config.tabla).select("*").eq("id", id).single();
    if (!data) return fallo("Registro no encontrado");
    const copia = ajustar({ ...(data as Record<string, unknown>) });
    const { error } = await supabase.from(config.tabla).insert(copia);
    if (error) return fallo(traducir(error.message));
    return ok(undefined);
  }

  return { listar, obtener, opciones, insertar, actualizar, alternar, eliminar, duplicar, pageSize };
}
