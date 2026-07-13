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
