import Link from "next/link";
import { Search, Eye } from "lucide-react";
import { requirePerfil } from "@/lib/auth";
import { OPERACIONES } from "@/lib/permisos";
import { getClientesAdmin, PAGINA_CLIENTES } from "@/lib/admin-datos";

export const dynamic = "force-dynamic";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  await requirePerfil(OPERACIONES);
  const sp = await searchParams;
  const q = sp.q ?? "";
  const page = Number(sp.page ?? "1") || 1;
  const { rows, total } = await getClientesAdmin({ q, page });
  const paginas = Math.max(1, Math.ceil(total / PAGINA_CLIENTES));

  return (
    <div className="space-y-5">
      <p className="text-sm text-tinta-tenue">{total} cliente(s)</p>

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
              {rows.length === 0 && <tr><td colSpan={5} className="px-4 py-10 text-center text-tinta-tenue">No hay clientes.</td></tr>}
              {rows.map((c) => (
                <tr key={c.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 font-semibold text-tinta">{c.nombre} {c.apellido ?? ""}<br /><span className="text-xs font-normal text-tinta-tenue">{c.email ?? ""}</span></td>
                  <td className="px-4 py-3 text-tinta-suave">{c.telefono}</td>
                  <td className="px-4 py-3 text-tinta-suave">{c.ciudad ?? "—"}</td>
                  <td className="px-4 py-3"><span className={c.activo ? "rounded-full bg-petroleo/10 px-2.5 py-1 text-xs font-semibold text-petroleo" : "rounded-full bg-black/10 px-2.5 py-1 text-xs font-semibold text-tinta-tenue"}>{c.activo ? "Activo" : "Inactivo"}</span></td>
                  <td className="px-4 py-3 text-right"><Link href={`/admin/clientes/${c.id}`} className="inline-grid h-9 w-9 place-items-center rounded-lg text-tinta hover:bg-black/5" aria-label="Ver"><Eye size={17} /></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {paginas > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: paginas }).map((_, i) => {
            const n = i + 1;
            const params = new URLSearchParams({ q, page: String(n) });
            return <Link key={n} href={`/admin/clientes?${params.toString()}`} className={n === page ? "rounded-lg bg-fuego-gradient px-3.5 py-2 text-sm font-bold text-[#1a0e00]" : "rounded-lg border border-black/15 px-3.5 py-2 text-sm font-semibold text-tinta hover:bg-black/5"}>{n}</Link>;
          })}
        </div>
      )}
    </div>
  );
}
