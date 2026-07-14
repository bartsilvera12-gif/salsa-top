/**
 * Estado de carga instantáneo del sitio público. Aparece al navegar a páginas
 * dinámicas (carrito, checkout, confirmación) mientras se resuelven sus datos.
 */
export default function LoadingSite() {
  return (
    <div className="grid min-h-[60vh] place-items-center" aria-label="Cargando" role="status">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-black/10 border-t-[#FF8200]" />
    </div>
  );
}
