"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { auditoriaRepo, PAGINA_AUDITORIA } from "@/lib/repositorios/auditoria";
import { useListado, FilaCargando, FilaVacia } from "@/components/admin/lista-ui";

function AuditoriaInterior() {
  const sp = useSearchParams();
  const page = Number(sp.get("page") ?? "1") || 1;
  const { datos, cargando } = useListado(() => auditoriaRepo.listar(page), [page]);
  const { rows, total } = datos ?? { rows: [], total: 0 };
  const paginas = Math.max(1, Math.ceil(total / PAGINA_AUDITORIA));

  return (
    <div className="space-y-5">
      <p className="text-sm text-tinta-tenue">Registro de acciones ({total})</p>

      <div className="recuadro overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-black/10 bg-crema-suave text-left text-xs uppercase tracking-wide text-tinta-tenue">
              <tr>
                <th className="px-4 py-3">Fecha</th>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Acción</th>
                <th className="px-4 py-3">Entidad</th>
              </tr>
            </thead>
            <tbody>
              {cargando && <FilaCargando cols={4} />}
              {!cargando && rows.length === 0 && <FilaVacia cols={4} texto="Sin registros de auditoría." />}
              {!cargando && rows.map((a) => (
                <tr key={a.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 text-tinta-tenue">{new Date(a.creado_en).toLocaleString("es-PY")}</td>
                  <td className="px-4 py-3 text-tinta-suave">{a.usuario ?? "—"}</td>
                  <td className="px-4 py-3 font-semibold text-tinta">{a.accion}</td>
                  <td className="px-4 py-3 text-tinta-suave">{a.entidad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {paginas > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: Math.min(paginas, 20) }).map((_, i) => {
            const n = i + 1;
            return <Link key={n} href={`/admin/auditoria/?page=${n}`} className={n === page ? "rounded-lg bg-fuego-gradient px-3.5 py-2 text-sm font-bold text-[#1a0e00]" : "rounded-lg border border-black/15 px-3.5 py-2 text-sm font-semibold text-tinta hover:bg-black/5"}>{n}</Link>;
          })}
        </div>
      )}
    </div>
  );
}

export default function AuditoriaPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-tinta-tenue">Cargando…</div>}>
      <AuditoriaInterior />
    </Suspense>
  );
}
