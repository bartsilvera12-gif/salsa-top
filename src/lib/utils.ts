import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Combina clases de Tailwind resolviendo conflictos. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Formatea un monto en guaraníes (PYG) sin decimales: 25000 -> "Gs. 25.000". */
export function formatGs(monto: number | null | undefined): string {
  const n = typeof monto === "number" && isFinite(monto) ? monto : 0;
  return `Gs. ${Math.round(n).toLocaleString("es-PY")}`;
}

/** Genera un slug amigable a partir de un texto. */
export function slugify(texto: string): string {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // quita diacríticos
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
