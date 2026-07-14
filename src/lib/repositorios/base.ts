// Base común de repositorios: envuelve crearCrud() y expone una API tipada.
// A partir de acá, el resto del sistema usa los repos (nunca crearCrud directo).
import { crearCrud, type ConfigCrud } from "@/lib/crud/crud-cliente";
import type { Lista, OpcionesListar, Opcion, Resultado } from "@/lib/crud/tipos";

export type RepoBase<TRow> = {
  pageSize: number;
  listar: <T = TRow>(opts?: OpcionesListar) => Promise<Lista<T>>;
  obtener: <T = TRow>(id: string, select?: string) => Promise<T | null>;
  opciones: (select?: string, orden?: string) => Promise<Opcion[]>;
  crear: (payload: Record<string, unknown>) => Promise<Resultado<{ id: string }>>;
  actualizar: (id: string, payload: Record<string, unknown>) => Promise<Resultado>;
  alternar: (id: string, campo: string, valor: boolean) => Promise<Resultado>;
  eliminar: (id: string) => Promise<Resultado>;
  duplicar: (
    id: string,
    ajustar: (fila: Record<string, unknown>) => Record<string, unknown>,
  ) => Promise<Resultado>;
};

export function crearRepo<TRow>(config: ConfigCrud): RepoBase<TRow> {
  const crud = crearCrud(config);
  return {
    pageSize: crud.pageSize,
    listar: (opts) => crud.listar(opts),
    obtener: (id, select) => crud.obtener(id, select),
    opciones: crud.opciones,
    crear: crud.insertar,
    actualizar: crud.actualizar,
    alternar: crud.alternar,
    eliminar: crud.eliminar,
    duplicar: crud.duplicar,
  };
}
