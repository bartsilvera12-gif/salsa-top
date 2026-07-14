// Repositorio tipado de Configuración del sitio (registro único).
import { crearCrud } from "@/lib/crud/crud-cliente";
import { getSupabase } from "@/lib/supabase/browser";

export type Configuracion = {
  id: string;
  nombre_marca: string;
  eslogan: string | null;
  descripcion_corta: string | null;
  descripcion_larga: string | null;
  logo_url: string | null;
  favicon_url: string | null;
  whatsapp: string | null;
  telefono: string | null;
  email: string | null;
  direccion: string | null;
  horario_atencion: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
  moneda: string | null;
  simbolo_moneda: string | null;
  pais: string | null;
  compra_minima: number | null;
  costo_envio: number | null;
  envio_gratis_desde: number | null;
  retiro_local_habilitado: boolean;
  pedidos_habilitados: boolean;
  mensaje_confirmacion: string | null;
};

const crud = crearCrud({ tabla: "configuracion_sitio" });

export const configuracionRepo = {
  /** Trae el registro único de configuración (el más antiguo, como la vista admin). */
  async obtener(): Promise<Configuracion | null> {
    const supabase = getSupabase();
    const { data } = await supabase
      .from("configuracion_sitio")
      .select("*")
      .order("creado_en", { ascending: true })
      .limit(1)
      .maybeSingle();
    return (data as Configuracion | null) ?? null;
  },
  crear: (payload: Record<string, unknown>) => crud.insertar(payload),
  actualizar: (id: string, payload: Record<string, unknown>) => crud.actualizar(id, payload),
};
