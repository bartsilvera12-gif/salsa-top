"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

/** Actualiza un parámetro en la URL (resetea la página). */
function useActualizarParam() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const actualizar = (clave: string, valor: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (valor) params.set(clave, valor);
    else params.delete(clave);
    params.delete("page");
    startTransition(() => router.replace(`${pathname}?${params.toString()}`));
  };

  return { actualizar, isPending, searchParams };
}

/** Buscador con debounce que escribe `?q=` en la URL (puntos 3 y 4, lado UI). */
export function Buscador({ placeholder = "Buscar…" }: { placeholder?: string }) {
  const { actualizar, isPending, searchParams } = useActualizarParam();
  const [q, setQ] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const actual = searchParams.get("q") ?? "";
    if (q === actual) return;
    const t = setTimeout(() => actualizar("q", q), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="relative min-w-52 flex-1">
      <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-tenue" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-black/15 bg-white py-2.5 pl-9 pr-9 text-sm outline-none focus:border-fuego-naranja"
      />
      {isPending && (
        <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-tinta-tenue" />
      )}
    </div>
  );
}

/** Select de filtro ligado a un parámetro de URL. */
export function FiltroSelect({
  nombre,
  valorPorDefecto = "",
  opciones,
}: {
  nombre: string;
  valorPorDefecto?: string;
  opciones: { valor: string; etiqueta: string }[];
}) {
  const { actualizar, searchParams } = useActualizarParam();
  return (
    <select
      value={searchParams.get(nombre) ?? valorPorDefecto}
      onChange={(e) => actualizar(nombre, e.target.value === valorPorDefecto ? "" : e.target.value)}
      className="rounded-xl border border-black/15 bg-white px-3 py-2.5 text-sm"
    >
      {opciones.map((o) => (
        <option key={o.valor} value={o.valor}>{o.etiqueta}</option>
      ))}
    </select>
  );
}

/** Contenedor visual de una barra de filtros. */
export function BarraFiltros({ children }: { children: React.ReactNode }) {
  return <div className="recuadro flex flex-wrap items-center gap-3 p-4">{children}</div>;
}
