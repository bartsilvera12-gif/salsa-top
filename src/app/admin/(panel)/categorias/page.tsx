"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { categoriasRepo } from "@/lib/repositorios/categorias";
import { alternarActivaCategoriaCliente, eliminarCategoriaCliente } from "./acciones-cliente";
import { useListado, BotonConfirmar, FilaCargando, FilaVacia } from "@/components/admin/lista-ui";
import { useToast } from "@/components/admin/toast";

export default function CategoriasPage() {
  const toast = useToast();
  const { datos, cargando, recargar } = useListado(() => categoriasRepo.listarConConteo(), []);
  const categorias = datos ?? [];

  async function onEliminar(id: string, nombre: string) {
    const r = await eliminarCategoriaCliente(id);
    if ("error" in r) toast.error(r.error);
    else {
      toast.exito(`"${nombre}" eliminada`);
      recargar();
    }
  }

  async function onAlternar(id: string, activa: boolean) {
    const r = await alternarActivaCategoriaCliente(id, activa);
    if ("error" in r) toast.error(r.error);
    else {
      toast.exito(activa ? "Categoría activada" : "Categoría desactivada");
      recargar();
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-tinta-tenue">{categorias.length} categoría(s)</p>
        <Link href="/admin/categorias/nuevo/" className="btn-fuego">
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
              {cargando && <FilaCargando cols={6} />}
              {!cargando && categorias.length === 0 && <FilaVacia cols={6} texto="No hay categorías." />}
              {!cargando &&
                categorias.map((c) => (
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
                        <Link href={`/admin/categorias/editar/?id=${c.id}`} className="rounded-lg p-2 text-tinta hover:bg-black/5" aria-label="Editar">
                          <Pencil size={16} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => onAlternar(c.id, !c.activa)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-acento hover:bg-black/5"
                        >
                          {c.activa ? "Desactivar" : "Activar"}
                        </button>
                        {c.productos === 0 && (
                          <BotonConfirmar
                            mensaje={`¿Eliminar "${c.nombre}"? Esta acción no se puede deshacer.`}
                            onConfirmar={() => onEliminar(c.id, c.nombre)}
                            ariaLabel={`Eliminar ${c.nombre}`}
                          >
                            <Trash2 size={16} />
                          </BotonConfirmar>
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
