import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Copy, Pencil } from "lucide-react";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { getProductosAdmin, PAGINA_PRODUCTOS } from "@/lib/admin-datos";
import { formatGs } from "@/lib/utils";
import { alternarActivo, duplicarProducto } from "./actions";

export const dynamic = "force-dynamic";

export default async function ProductosPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; estado?: string; page?: string }>;
}) {
  await requirePerfil(CONTENIDO);
  const sp = await searchParams;
  const q = sp.q ?? "";
  const estado = (sp.estado as "todos" | "activos" | "inactivos") ?? "todos";
  const page = Number(sp.page ?? "1") || 1;

  const { rows, total } = await getProductosAdmin({ q, estado, page });
  const paginas = Math.max(1, Math.ceil(total / PAGINA_PRODUCTOS));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-tinta-tenue">{total} producto(s)</p>
        <Link href="/admin/productos/nuevo" className="btn-fuego">
          <Plus size={18} /> Nuevo producto
        </Link>
      </div>

      <form className="recuadro flex flex-wrap gap-3 p-4" method="get">
        <div className="relative min-w-52 flex-1">
          <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-tinta-tenue" />
          <input
            name="q"
            defaultValue={q}
            placeholder="Buscar por nombre…"
            className="w-full rounded-xl border border-black/15 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-fuego-naranja"
          />
        </div>
        <select name="estado" defaultValue={estado} className="rounded-xl border border-black/15 bg-white px-3 text-sm">
          <option value="todos">Todos</option>
          <option value="activos">Activos</option>
          <option value="inactivos">Inactivos</option>
        </select>
        <button type="submit" className="btn-contorno px-5 py-2.5 text-sm">Filtrar</button>
      </form>

      <div className="recuadro overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-black/10 bg-crema-suave text-left text-xs uppercase tracking-wide text-tinta-tenue">
              <tr>
                <th className="px-4 py-3">Producto</th>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-tinta-tenue">No hay productos.</td></tr>
              )}
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-11 w-9 flex-shrink-0 overflow-hidden rounded bg-white">
                        {p.imagen_principal_url && (
                          <Image src={p.imagen_principal_url} alt="" fill className="object-contain" sizes="36px" />
                        )}
                      </div>
                      <span className="font-semibold text-tinta">{p.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-tinta-suave">{p.categoria ?? "—"}</td>
                  <td className="px-4 py-3 text-tinta-suave">{p.precio > 0 ? formatGs(p.precio) : "—"}</td>
                  <td className="px-4 py-3 text-tinta-suave">{p.stock}</td>
                  <td className="px-4 py-3">
                    <span className={p.activo
                      ? "rounded-full bg-petroleo/10 px-2.5 py-1 text-xs font-semibold text-petroleo"
                      : "rounded-full bg-black/10 px-2.5 py-1 text-xs font-semibold text-tinta-tenue"}>
                      {p.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/admin/productos/${p.id}`} className="rounded-lg p-2 text-tinta hover:bg-black/5" aria-label="Editar">
                        <Pencil size={16} />
                      </Link>
                      <form action={duplicarProducto.bind(null, p.id)}>
                        <button type="submit" className="rounded-lg p-2 text-tinta hover:bg-black/5" aria-label="Duplicar">
                          <Copy size={16} />
                        </button>
                      </form>
                      <form action={alternarActivo.bind(null, p.id, !p.activo)}>
                        <button type="submit" className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-acento hover:bg-black/5">
                          {p.activo ? "Desactivar" : "Activar"}
                        </button>
                      </form>
                    </div>
                  </td>
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
            const params = new URLSearchParams({ q, estado, page: String(n) });
            return (
              <Link key={n} href={`/admin/productos?${params.toString()}`}
                className={n === page
                  ? "rounded-lg bg-fuego-gradient px-3.5 py-2 text-sm font-bold text-[#1a0e00]"
                  : "rounded-lg border border-black/15 px-3.5 py-2 text-sm font-semibold text-tinta hover:bg-black/5"}>
                {n}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
