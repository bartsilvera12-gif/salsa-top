"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, Trash2, Loader2 } from "lucide-react";

type Opcion = { id: string; nombre: string };

/** Botón de eliminar producto con confirmación previa. La acción (borrado cliente
 *  + recarga del listado) la ejecuta el componente padre vía `onConfirmar`. */
export function BotonEliminarProducto({
  nombre,
  onConfirmar,
}: {
  nombre: string;
  onConfirmar: () => void | Promise<void>;
}) {
  return (
    <button
      type="button"
      onClick={() => {
        if (confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) {
          void onConfirmar();
        }
      }}
      className="rounded-lg p-2 text-fuego-rojo hover:bg-fuego-rojo/10"
      aria-label={`Eliminar ${nombre}`}
    >
      <Trash2 size={16} />
    </button>
  );
}

/**
 * Barra de filtros con buscador inteligente (búsqueda en vivo con debounce)
 * + filtro por estado + filtro por categoría. Todo actualiza la URL al
 * instante, sin botón de "Filtrar" ni recargar la página.
 */
export function ProductosFiltros({ categorias }: { categorias: Opcion[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(searchParams.get("q") ?? "");

  // Búsqueda en vivo: espera 350ms tras dejar de escribir y actualiza la URL.
  useEffect(() => {
    const actual = searchParams.get("q") ?? "";
    if (q === actual) return;
    const t = setTimeout(() => actualizar("q", q), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  function actualizar(clave: string, valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) params.set(clave, valor);
    else params.delete(clave);
    params.delete("page"); // al filtrar, volver a la página 1
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  }

  return (
    <div className="recuadro flex flex-wrap items-center gap-3 p-4">
      <div className="relative min-w-52 flex-1">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-tenue" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar por nombre…"
          className="w-full rounded-xl border border-black/15 bg-white py-2.5 pl-9 pr-9 text-sm outline-none focus:border-fuego-naranja"
        />
        {isPending && (
          <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-tinta-tenue" />
        )}
      </div>

      <select
        value={searchParams.get("estado") ?? "todos"}
        onChange={(e) => actualizar("estado", e.target.value === "todos" ? "" : e.target.value)}
        className="rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm"
      >
        <option value="todos">Todos los estados</option>
        <option value="activos">Activos</option>
        <option value="inactivos">Inactivos</option>
      </select>

      <select
        value={searchParams.get("categoria") ?? ""}
        onChange={(e) => actualizar("categoria", e.target.value)}
        className="rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm"
      >
        <option value="">Todas las categorías</option>
        {categorias.map((c) => (
          <option key={c.id} value={c.id}>{c.nombre}</option>
        ))}
      </select>
    </div>
  );
}
