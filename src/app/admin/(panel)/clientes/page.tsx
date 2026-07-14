"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Eye } from "lucide-react";
import { clientesRepo } from "@/lib/repositorios/clientes";
import { totalPaginas } from "@/lib/crud/paginacion";
import { useListado, Paginacion, FilaCargando, FilaVacia } from "@/components/admin/lista-ui";

function ClientesLista() {
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";
  const page = Number(sp.get("page") ?? "1") || 1;

  const { datos, cargando } = useListado(() => clientesRepo.listar({ q, page }), [q, page]);
  const lista = datos ?? { rows: [], total: 0 };
  const paginas = totalPaginas(lista.total, clientesRepo.pageSize);

  return (
    <div className="space-y-5">
      <p className="text-sm text-tinta-tenue">{lista.total} cliente(s)</p>

      <form className="recuadro flex flex-wrap gap-3 p-4" method="get">
        <div className="relative min-w-52 flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-tenue" />
          <input name="q" defaultValue={q} placeholder="Nombre, teléfono o email…" className="w-full rounded-xl border border-black/15 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-fuego-naranja" />
        </div>
        <button type="submit" className="btn-contorno px-5 py-2.5 text-sm">Buscar</button>
      </form>

      <div className="recuadro overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-black/10 bg-crema-suave text-left text-xs uppercase tracking-wide text-tinta-tenue">
              <tr><th className="px-4 py-3">Cliente</th><th className="px-4 py-3">Teléfono</th><th className="px-4 py-3">Ciudad</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3 text-right">Ver</th></tr>
            </thead>
            <tbody>
              {cargando && <FilaCargando cols={5} />}
              {!cargando && lista.rows.length === 0 && <FilaVacia cols={5} texto="No hay clientes." />}
              {!cargando && lista.rows.map((c) => (
                <tr key={c.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 font-semibold text-tinta">{c.nombre} {c.apellido ?? ""}<br /><span className="text-xs font-normal text-tinta-tenue">{c.email ?? ""}</span></td>
                  <td className="px-4 py-3 text-tinta-suave">{c.telefono}</td>
                  <td className="px-4 py-3 text-tinta-suave">{c.ciudad ?? "—"}</td>
                  <td className="px-4 py-3"><span className={c.activo ? "rounded-full bg-petroleo/10 px-2.5 py-1 text-xs font-semibold text-petroleo" : "rounded-full bg-black/10 px-2.5 py-1 text-xs font-semibold text-tinta-tenue"}>{c.activo ? "Activo" : "Inactivo"}</span></td>
                  <td className="px-4 py-3 text-right"><Link href={`/admin/clientes/ver/?id=${c.id}`} className="inline-grid h-9 w-9 place-items-center rounded-lg text-tinta hover:bg-black/5" aria-label="Ver"><Eye size={17} /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Paginacion
        page={page}
        totalPaginas={paginas}
        hrefDe={(n) => `/admin/clientes/?${new URLSearchParams({ q, page: String(n) }).toString()}`}
      />
    </div>
  );
}

export default function ClientesPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-tinta-tenue">Cargando…</div>}>
      <ClientesLista />
    </Suspense>
  );
}
