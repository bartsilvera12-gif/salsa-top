// Repositorio de solo lectura del registro de auditoría.
import { getSupabase } from "@/lib/supabase/browser";

export const PAGINA_AUDITORIA = 30;

export type Auditoria = {
  id: string;
  accion: string;
  entidad: string;
  entidad_id: string | null;
  creado_en: string;
  usuario: string | null;
};

export const auditoriaRepo = {
  /** Página de auditoría (misma consulta/join que la vista admin). */
  async listar(page = 1): Promise<{ rows: Auditoria[]; total: number }> {
    const supabase = getSupabase();
    const desde = (Math.max(1, page) - 1) * PAGINA_AUDITORIA;
    const { data, count } = await supabase
      .from("auditoria")
      .select("id, accion, entidad, entidad_id, creado_en, perfiles(nombre, email)", { count: "exact" })
      .order("creado_en", { ascending: false })
      .range(desde, desde + PAGINA_AUDITORIA - 1);
    const rows = (data ?? []).map((a) => {
      const perfil = a.perfiles as { nombre: string; email: string } | { nombre: string; email: string }[] | null;
      const info = Array.isArray(perfil) ? perfil[0] : perfil;
      return {
        id: a.id as string,
        accion: a.accion as string,
        entidad: a.entidad as string,
        entidad_id: a.entidad_id as string | null,
        creado_en: a.creado_en as string,
        usuario: info ? `${info.nombre} (${info.email})` : null,
      };
    });
    return { rows, total: count ?? 0 };
  },
};
