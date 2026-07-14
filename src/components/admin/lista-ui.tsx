"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

/**
 * Hook de listado reutilizable (puntos 6 y 9): maneja loading, datos y recarga.
 * `fetcher` debe ser estable (useCallback) o depender de `deps`.
 */
export function useListado<T>(
  fetcher: () => Promise<T>,
  deps: unknown[],
): { datos: T | null; cargando: boolean; recargar: () => void } {
  const [datos, setDatos] = useState<T | null>(null);
  const [cargando, setCargando] = useState(true);
  const [tick, setTick] = useState(0);
  const fetchRef = useRef(fetcher);
  fetchRef.current = fetcher;

  useEffect(() => {
    let vivo = true;
    setCargando(true);
    fetchRef.current().then((d) => {
      if (vivo) {
        setDatos(d);
        setCargando(false);
      }
    });
    return () => {
      vivo = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, tick]);

  const recargar = useCallback(() => setTick((t) => t + 1), []);
  return { datos, cargando, recargar };
}

/** Caja de mensaje de error (punto 5). */
export function MensajeError({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <p className="rounded-xl border border-fuego-rojo/30 bg-fuego-rojo/10 px-4 py-3 text-sm font-medium text-fuego-rojo">
      {children}
    </p>
  );
}

/** Fila de "cargando…" para tablas. */
export function FilaCargando({ cols }: { cols: number }) {
  return (
    <tr>
      <td colSpan={cols} className="px-4 py-10 text-center text-tinta-tenue">Cargando…</td>
    </tr>
  );
}

/** Fila de "sin resultados" para tablas. */
export function FilaVacia({ cols, texto = "No hay registros." }: { cols: number; texto?: string }) {
  return (
    <tr>
      <td colSpan={cols} className="px-4 py-10 text-center text-tinta-tenue">{texto}</td>
    </tr>
  );
}

/** Paginación por enlaces (punto 2, lado UI). `hrefDe(n)` arma la URL de cada página. */
export function Paginacion({
  page,
  totalPaginas,
  hrefDe,
}: {
  page: number;
  totalPaginas: number;
  hrefDe: (n: number) => string;
}) {
  if (totalPaginas <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: totalPaginas }).map((_, i) => {
        const n = i + 1;
        return (
          <Link
            key={n}
            href={hrefDe(n)}
            className={
              n === page
                ? "rounded-lg bg-fuego-gradient px-3.5 py-2 text-sm font-bold text-[#1a0e00]"
                : "rounded-lg border border-black/15 px-3.5 py-2 text-sm font-semibold text-tinta hover:bg-black/5"
            }
          >
            {n}
          </Link>
        );
      })}
    </div>
  );
}

/** Botón con confirmación previa (punto 7). La acción la ejecuta el padre. */
export function BotonConfirmar({
  mensaje,
  onConfirmar,
  className = "rounded-lg p-2 text-fuego-rojo hover:bg-fuego-rojo/10",
  ariaLabel,
  children,
}: {
  mensaje: string;
  onConfirmar: () => void | Promise<void>;
  className?: string;
  ariaLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (confirm(mensaje)) void onConfirmar();
      }}
      className={className}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
