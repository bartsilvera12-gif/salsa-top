import { createPublicClient } from "@/lib/supabase/public";
import { WHATSAPP_NUMBER } from "@/lib/env";

// ---------------------------------------------------------------------------
// Tipos
// ---------------------------------------------------------------------------
export type Configuracion = {
  nombre_marca: string;
  eslogan: string | null;
  descripcion_corta: string | null;
  whatsapp: string | null;
  telefono: string | null;
  email: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  tiktok_url: string | null;
};

export type Seccion = {
  clave: string;
  titulo: string | null;
  subtitulo: string | null;
  contenido: string | null;
  texto_boton: string | null;
  enlace_boton: string | null;
};

export type Producto = {
  id: string;
  nombre: string;
  slug: string;
  descripcion_corta: string | null;
  contenido_neto: string | null;
  precio: number;
  precio_oferta: number | null;
  en_oferta: boolean;
  nivel_picante: number;
  imagen_principal_url: string | null;
  destacado: boolean;
};

export type Beneficio = {
  id: string;
  titulo: string;
  descripcion: string | null;
  icono: string | null;
};

// ---------------------------------------------------------------------------
// Fallbacks (coinciden con el seed). Se usan si no hay conexión/env.
// ---------------------------------------------------------------------------
const CONFIG_FALLBACK: Configuracion = {
  nombre_marca: "Salsa Top",
  eslogan: "No es solo una salsa. Es una experiencia gourmet.",
  descripcion_corta: "Salsas artesanales gourmet del Paraguay.",
  whatsapp: WHATSAPP_NUMBER,
  telefono: "0994 208 200",
  email: null,
  instagram_url: "https://www.instagram.com/salsa.top.py",
  facebook_url: "https://www.facebook.com/share/1BYp9aQXAG/",
  tiktok_url: "https://www.tiktok.com/@salsa.top.py",
};

const SECCIONES_FALLBACK: Record<string, Seccion> = {
  hero: {
    clave: "hero",
    titulo: "No es solo una salsa. Es una experiencia gourmet.",
    subtitulo: "Artesanal · Gourmet · Paraguay",
    contenido:
      "Salsas picantes, agridulces y untables elaboradas de forma artesanal, con ingredientes naturales de nuestra propia finca. Sabor auténtico, sin colorantes ni esencias artificiales.",
    texto_boton: "Ver productos",
    enlace_boton: "#productos",
  },
  historia: {
    clave: "historia",
    titulo: "De la tradición familiar a tu mesa",
    subtitulo: "Quiénes somos",
    contenido:
      "Somos una marca artesanal paraguaya que elabora salsas gourmet con ingredientes naturales de cultivo propio, cuidando cada paso del proceso.",
    texto_boton: null,
    enlace_boton: null,
  },
  proceso: {
    clave: "proceso",
    titulo: "De la finca a la mesa",
    subtitulo: "Proceso artesanal",
    contenido: "Cultivo propio, elaboración a mano y control de calidad en nuestra planta.",
    texto_boton: null,
    enlace_boton: null,
  },
  propuesta: {
    clave: "propuesta",
    titulo: "Una propuesta única",
    subtitulo: "Posicionamiento",
    contenido:
      "Desarrollamos productos con ingredientes y combinaciones únicas que hoy no tienen equivalente en el mercado. Como competencia indirecta identificamos marcas premium como Heinz, Tabasco y Kühne, con estándares comparables.",
    texto_boton: null,
    enlace_boton: null,
  },
  contacto: {
    clave: "contacto",
    titulo: "Hablemos de sabor",
    subtitulo: "Contacto",
    contenido: "Escribinos por WhatsApp o seguinos en nuestras redes.",
    texto_boton: "Escribir por WhatsApp",
    enlace_boton: null,
  },
};

const BENEFICIOS_FALLBACK: Beneficio[] = [
  { id: "1", titulo: "Elaboración artesanal", descripcion: "Cada lote se elabora a mano, con procesos cuidados y control de calidad.", icono: "hand" },
  { id: "2", titulo: "Ingredientes naturales", descripcion: "Materias primas frescas y seleccionadas de nuestra propia finca.", icono: "leaf" },
  { id: "3", titulo: "Sin aditivos artificiales", descripcion: "Sin colorantes ni esencias artificiales. Solo sabor real.", icono: "sparkles" },
  { id: "4", titulo: "Calidad garantizada", descripcion: "Estándares orientados a certificaciones HACCP e ISO 9001.", icono: "shield-check" },
];

const PRODUCTOS_FALLBACK: Producto[] = [
  { id: "1", nombre: "Salsa de Ajo Ahumado", slug: "salsa-de-ajo-ahumado", descripcion_corta: "Aromática y envolvente, con ese toque ahumado. Ideal para untar, marinar y acompañar.", contenido_neto: "30 g", precio: 0, precio_oferta: null, en_oferta: false, nivel_picante: 1, imagen_principal_url: "/salsa-ajo.jpg", destacado: true },
  { id: "2", nombre: "Salsa Barbacoa", slug: "salsa-barbacoa", descripcion_corta: "El balance justo entre dulzor y ahumado. Perfecta para carnes, papas y snacks.", contenido_neto: "30 g", precio: 0, precio_oferta: null, en_oferta: false, nivel_picante: 1, imagen_principal_url: "/salsa-barbacoa.jpg", destacado: true },
  { id: "3", nombre: "Salsa Picante de Mango con Habanero", slug: "salsa-picante-de-mango-con-habanero", descripcion_corta: "El dulzor tropical del mango con el fuego del habanero. Intensa y con carácter.", contenido_neto: "30 g", precio: 0, precio_oferta: null, en_oferta: false, nivel_picante: 4, imagen_principal_url: "/salsa-mango-habanero.jpg", destacado: true },
  { id: "4", nombre: "Salsa Picante de Morrones con Nueces", slug: "salsa-picante-de-morrones-con-nueces", descripcion_corta: "Morrones asados y nueces para un picante con textura, cuerpo y elegancia.", contenido_neto: "30 g", precio: 0, precio_oferta: null, en_oferta: false, nivel_picante: 3, imagen_principal_url: "/salsa-morrones-nueces.jpg", destacado: true },
  { id: "5", nombre: "Salsa Picante de Piña con Pimienta", slug: "salsa-picante-de-pina-con-pimienta", descripcion_corta: "Piña jugosa y pimienta: fresco, dulce y picante en cada bocado.", contenido_neto: "30 g", precio: 0, precio_oferta: null, en_oferta: false, nivel_picante: 3, imagen_principal_url: "/salsa-pina-pimienta.jpg", destacado: false },
  { id: "6", nombre: "Salsa Picante de Tomate con Especias", slug: "salsa-picante-de-tomate-con-especias", descripcion_corta: "Tomate maduro y especias seleccionadas: el picante clásico que va con todo.", contenido_neto: "30 g", precio: 0, precio_oferta: null, en_oferta: false, nivel_picante: 2, imagen_principal_url: "/salsa-tomate-especias.jpg", destacado: false },
];

// ---------------------------------------------------------------------------
// Consultas (con fallback si falla la conexión)
// ---------------------------------------------------------------------------
export async function getConfiguracion(): Promise<Configuracion> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("configuracion_sitio")
      .select("nombre_marca, eslogan, descripcion_corta, whatsapp, telefono, email, instagram_url, facebook_url, tiktok_url")
      .eq("activo", true)
      .limit(1)
      .maybeSingle();
    return (data as Configuracion | null) ?? CONFIG_FALLBACK;
  } catch {
    return CONFIG_FALLBACK;
  }
}

export async function getSecciones(): Promise<Record<string, Seccion>> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("secciones_sitio")
      .select("clave, titulo, subtitulo, contenido, texto_boton, enlace_boton")
      .eq("activa", true);
    if (!data || data.length === 0) return SECCIONES_FALLBACK;
    const map: Record<string, Seccion> = { ...SECCIONES_FALLBACK };
    for (const s of data as Seccion[]) map[s.clave] = s;
    return map;
  } catch {
    return SECCIONES_FALLBACK;
  }
}

export async function getProductos(): Promise<Producto[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("productos")
      .select("id, nombre, slug, descripcion_corta, contenido_neto, precio, precio_oferta, en_oferta, nivel_picante, imagen_principal_url, destacado")
      .eq("activo", true)
      .order("orden", { ascending: true });
    if (!data || data.length === 0) return PRODUCTOS_FALLBACK;
    return data as Producto[];
  } catch {
    return PRODUCTOS_FALLBACK;
  }
}

export type MetodoPago = { nombre: string; descripcion: string | null; instrucciones: string | null };
export type MetodoEntrega = { nombre: string; descripcion: string | null; costo: number };

export async function getMetodosPago(): Promise<MetodoPago[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("metodos_pago")
      .select("nombre, descripcion, instrucciones")
      .eq("activo", true)
      .order("orden");
    if (!data || data.length === 0) return [{ nombre: "Efectivo", descripcion: null, instrucciones: null }];
    return data as MetodoPago[];
  } catch {
    return [{ nombre: "Efectivo", descripcion: null, instrucciones: null }];
  }
}

export async function getMetodosEntrega(): Promise<MetodoEntrega[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("metodos_entrega")
      .select("nombre, descripcion, costo")
      .eq("activo", true)
      .order("orden");
    if (!data || data.length === 0)
      return [{ nombre: "Retiro en local", descripcion: null, costo: 0 }];
    return data as MetodoEntrega[];
  } catch {
    return [{ nombre: "Retiro en local", descripcion: null, costo: 0 }];
  }
}

export async function getBeneficios(): Promise<Beneficio[]> {
  try {
    const supabase = createPublicClient();
    const { data } = await supabase
      .from("beneficios")
      .select("id, titulo, descripcion, icono")
      .eq("activo", true)
      .order("orden", { ascending: true });
    if (!data || data.length === 0) return BENEFICIOS_FALLBACK;
    return data as Beneficio[];
  } catch {
    return BENEFICIOS_FALLBACK;
  }
}
