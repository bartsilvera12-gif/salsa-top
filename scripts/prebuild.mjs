// Limpia la caché de datos de Next antes de cada build.
//
// Next.js guarda en `.next/cache/fetch-cache` los resultados de las consultas a
// Supabase (productos, secciones, etc.). Sin esto, al reconstruir el sitio
// reusaría datos VIEJOS: los productos/cambios nuevos del panel admin no
// aparecerían y los eliminados seguirían mostrándose. Borrando esta caché,
// cada `npm run build` lee siempre los datos actuales de la base.
import { rmSync, existsSync } from "node:fs";

const dir = ".next/cache/fetch-cache";
if (existsSync(dir)) {
  rmSync(dir, { recursive: true, force: true });
  console.log("prebuild: caché de datos limpiada → el build usará datos frescos de la base.");
} else {
  console.log("prebuild: no había caché de datos que limpiar.");
}
