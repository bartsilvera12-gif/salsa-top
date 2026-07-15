/**
 * Fondo decorativo de chiles, fijo y cubriendo el viewport.
 * Usa `bg-cover` (sin repetición) para que no aparezca la línea de costura
 * que dejaba el mosaico vertical (`bg-repeat-y`).
 */
export function ChiliBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-crema bg-[url('/fondo-beneficios.jpg')] bg-cover bg-center bg-no-repeat"
    />
  );
}
