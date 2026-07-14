/**
 * Estado de carga instantáneo del panel. Al navegar entre secciones, Next
 * muestra este esqueleto de inmediato (Suspense) mientras el server component
 * trae sus datos, en vez de congelar la página anterior.
 */
export default function LoadingPanel() {
  return (
    <div className="animate-pulse space-y-6" aria-hidden>
      {/* Título de sección */}
      <div className="h-5 w-52 rounded bg-black/10" />

      {/* Fila de tarjetas/estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-black/10 bg-white/60 p-5">
            <div className="h-4 w-24 rounded bg-black/10" />
            <div className="mt-4 h-8 w-16 rounded bg-black/10" />
            <div className="mt-3 h-3 w-20 rounded bg-black/5" />
          </div>
        ))}
      </div>

      {/* Bloque tipo listado/tabla */}
      <div className="space-y-3 rounded-2xl border border-black/10 bg-white/60 p-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-10 rounded bg-black/5" />
        ))}
      </div>
    </div>
  );
}
