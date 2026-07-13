import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { getCategoriasAdmin } from "@/lib/admin-datos";
import { alternarActivaCategoria, eliminarCategoria } from "./actions";

export const dynamic = "force-dynamic";

export default async function CategoriasPage() {
  await requirePerfil(CONTENIDO);
  const categorias = await getCategoriasAdmin();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-tinta-tenue">{categorias.length} categoría(s)</p>
        <Link href="/admin/categorias/nuevo" className="btn-fuego">
          <Plus size={18} /> Nueva categoría
        </Link>
      </div>

      <div className="recuadro overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-black/10 bg-crema-suave text-left text-xs uppercase tracking-wide text-tinta-tenue">
              <tr>
                <th className="px-4 py-3">Categoría</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Productos</th>
                <th className="px-4 py-3">Orden</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-tinta-tenue">No hay categorías.</td></tr>
              )}
              {categorias.map((c) => (
                <tr key={c.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="h-4 w-4 rounded-full border border-black/10" style={{ background: c.color ?? "#FF8200" }} />
                      <span className="font-semibold text-tinta">{c.nombre}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-tinta-suave">{c.slug}</td>
                  <td className="px-4 py-3 text-tinta-suave">{c.productos}</td>
                  <td className="px-4 py-3 text-tinta-suave">{c.orden}</td>
                  <td className="px-4 py-3">
                    <span className={c.activa
                      ? "rounded-full bg-petroleo/10 px-2.5 py-1 text-xs font-semibold text-petroleo"
                      : "rounded-full bg-black/10 px-2.5 py-1 text-xs font-semibold text-tinta-tenue"}>
                      {c.activa ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/admin/categorias/${c.id}`} className="rounded-lg p-2 text-tinta hover:bg-black/5" aria-label="Editar">
                        <Pencil size={16} />
                      </Link>
                      <form action={alternarActivaCategoria.bind(null, c.id, !c.activa)}>
                        <button type="submit" className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-acento hover:bg-black/5">
                          {c.activa ? "Desactivar" : "Activar"}
                        </button>
                      </form>
                      {c.productos === 0 && (
                        <form action={eliminarCategoria.bind(null, c.id)}>
                          <button type="submit" className="rounded-lg p-2 text-fuego-rojo hover:bg-fuego-rojo/10" aria-label="Eliminar">
                            <Trash2 size={16} />
                          </button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="text-xs text-tinta-tenue">
        Solo se pueden eliminar categorías sin productos. Reasigná los productos antes de eliminar.
      </p>
    </div>
  );
}
