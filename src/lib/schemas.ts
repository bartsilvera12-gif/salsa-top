import { z } from "zod";

const numOpcional = z
  .union([z.number(), z.string()])
  .transform((v) => (v === "" || v === null || v === undefined ? null : Number(v)))
  .refine((v) => v === null || (!isNaN(v) && v >= 0), "Debe ser un número ≥ 0")
  .nullable();

export const productoSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(200),
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  codigo: z.string().max(80).optional().or(z.literal("")),
  categoria_id: z.string().uuid().nullable().optional(),
  descripcion_corta: z.string().max(500).optional().or(z.literal("")),
  descripcion_larga: z.string().optional().or(z.literal("")),
  ingredientes: z.string().optional().or(z.literal("")),
  recomendaciones_uso: z.string().optional().or(z.literal("")),
  presentacion: z.string().max(120).optional().or(z.literal("")),
  contenido_neto: z.string().max(80).optional().or(z.literal("")),
  precio: z.coerce.number().min(0, "El precio no puede ser negativo").default(0),
  precio_oferta: numOpcional,
  costo: numOpcional,
  stock: z.coerce.number().min(0, "El stock no puede ser negativo").default(0),
  stock_minimo: z.coerce.number().min(0).default(0),
  controla_stock: z.boolean().default(true),
  nivel_picante: z.coerce.number().int().min(0).max(5).default(0),
  imagen_principal_url: z.string().optional().or(z.literal("")),
  destacado: z.boolean().default(false),
  nuevo: z.boolean().default(false),
  en_oferta: z.boolean().default(false),
  activo: z.boolean().default(true),
  orden: z.coerce.number().int().default(0),
  meta_titulo: z.string().max(200).optional().or(z.literal("")),
  meta_descripcion: z.string().max(300).optional().or(z.literal("")),
  etiquetas: z.array(z.string().uuid()).default([]),
});

export type ProductoInput = z.infer<typeof productoSchema>;

// ---------------------------------------------------------------------------
// Categoría
// ---------------------------------------------------------------------------
export const categoriaSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio").max(120),
  slug: z
    .string()
    .min(1, "El slug es obligatorio")
    .regex(/^[a-z0-9-]+$/, "Solo minúsculas, números y guiones"),
  descripcion: z.string().optional().or(z.literal("")),
  imagen_url: z.string().optional().or(z.literal("")),
  icono: z.string().max(60).optional().or(z.literal("")),
  color: z.string().max(20).optional().or(z.literal("")),
  orden: z.coerce.number().int().default(0),
  activa: z.boolean().default(true),
});
export type CategoriaInput = z.infer<typeof categoriaSchema>;

// ---------------------------------------------------------------------------
// Configuración del sitio
// ---------------------------------------------------------------------------
const numOpc = z
  .union([z.number(), z.string()])
  .transform((v) => (v === "" || v === null || v === undefined ? null : Number(v)))
  .refine((v) => v === null || (!isNaN(v) && v >= 0), "Debe ser un número ≥ 0")
  .nullable();

export const configuracionSchema = z.object({
  nombre_marca: z.string().min(1, "El nombre de marca es obligatorio").max(120),
  eslogan: z.string().optional().or(z.literal("")),
  descripcion_corta: z.string().optional().or(z.literal("")),
  descripcion_larga: z.string().optional().or(z.literal("")),
  logo_url: z.string().optional().or(z.literal("")),
  favicon_url: z.string().optional().or(z.literal("")),
  whatsapp: z.string().optional().or(z.literal("")),
  telefono: z.string().optional().or(z.literal("")),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  direccion: z.string().optional().or(z.literal("")),
  horario_atencion: z.string().optional().or(z.literal("")),
  instagram_url: z.string().optional().or(z.literal("")),
  facebook_url: z.string().optional().or(z.literal("")),
  tiktok_url: z.string().optional().or(z.literal("")),
  moneda: z.string().max(10).optional().or(z.literal("")),
  simbolo_moneda: z.string().max(10).optional().or(z.literal("")),
  pais: z.string().max(60).optional().or(z.literal("")),
  compra_minima: numOpc,
  costo_envio: numOpc,
  envio_gratis_desde: numOpc,
  retiro_local_habilitado: z.boolean().default(true),
  pedidos_habilitados: z.boolean().default(true),
  mensaje_confirmacion: z.string().optional().or(z.literal("")),
});
export type ConfiguracionInput = z.infer<typeof configuracionSchema>;
