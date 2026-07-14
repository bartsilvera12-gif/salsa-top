"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, Eye } from "lucide-react";
import { formatGs } from "@/lib/utils";
import { totalPaginas } from "@/lib/crud/paginacion";
import { pedidosRepo } from "@/lib/repositorios/pedidos";
import { EstadoBadge } from "@/components/admin/estado-badge";
import { useListado, Paginacion, FilaCargando, FilaVacia } from "@/components/admin/lista-ui";

const ESTADOS = ["todos", "pendiente", "confirmado", "preparando", "listo", "enviado", "entregado", "cancelado"];
const PAGOS = ["todos", "pendiente", "pagado", "rechazado", "reembolsado"];

function PedidosLista() {
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";
  const estado = sp.get("estado") ?? "todos";
  const pago = sp.get("pago") ?? "todos";
  const page = Number(sp.get("page") ?? "1") || 1;

  const { datos, cargando } = useListado(
    () => pedidosRepo.listar({ q, estado, estadoPago: pago, page }),
    [q, estado, pago, page],
  );

  const lista = datos ?? { rows: [], total: 0 };
  const paginas = totalPaginas(lista.total, pedidosRepo.pageSize);

  return (
    <div className="space-y-5">
      <p className="text-sm text-tinta-tenue">{lista.total} pedido(s)</p>

      <form className="recuadro flex flex-wrap gap-3 p-4" method="get">
        <div className="relative min-w-52 flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-tenue" />
          <input name="q" defaultValue={q} placeholder="Número, cliente o teléfono…" className="w-full rounded-xl border border-black/15 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-fuego-naranja" />
        </div>
        <select name="estado" defaultValue={estado} className="rounded-xl border border-black/15 bg-white px-3 text-sm capitalize">
          {ESTADOS.map((e) => <option key={e} value={e}>{e === "todos" ? "Todos los estados" : e}</option>)}
        </select>
        <select name="pago" defaultValue={pago} className="rounded-xl border border-black/15 bg-white px-3 text-sm capitalize">
          {PAGOS.map((e) => <option key={e} value={e}>{e === "todos" ? "Todo pago" : e}</option>)}
        </select>
        <button type="submit" className="btn-contorno px-5 py-2.5 text-sm">Filtrar</button>
      </form>

      <div className="recuadro overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-black/10 bg-crema-suave text-left text-xs uppercase tracking-wide text-tinta-tenue">
              <tr>
                <th className="px-4 py-3">Número</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Pago</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3 text-right">Ver</th>
              </tr>
            </thead>
            <tbody>
              {cargando && <FilaCargando cols={6} />}
              {!cargando && lista.rows.length === 0 && <FilaVacia cols={6} texto="No hay pedidos." />}
              {!cargando && lista.rows.map((p) => (
                <tr key={p.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 font-semibold text-tinta">{p.numero}</td>
                  <td className="px-4 py-3 text-tinta-suave">{p.nombre_cliente}<br /><span className="text-xs text-tinta-tenue">{p.telefono_cliente}</span></td>
                  <td className="px-4 py-3"><EstadoBadge estado={p.estado} /></td>
                  <td className="px-4 py-3"><EstadoBadge estado={p.estado_pago} /></td>
                  <td className="px-4 py-3 font-semibold text-tinta">{formatGs(p.total)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/pedidos/ver/?id=${p.id}`} className="inline-grid h-9 w-9 place-items-center rounded-lg text-tinta hover:bg-black/5" aria-label="Ver detalle"><Eye size={17} /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Paginacion
        page={page}
        totalPaginas={paginas}
        hrefDe={(n) => `/admin/pedidos/?${new URLSearchParams({ q, estado, pago, page: String(n) }).toString()}`}
      />
    </div>
  );
}

export default function PedidosPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-tinta-tenue">Cargando…</div>}>
      <PedidosLista />
    </Suspense>
  );
}
