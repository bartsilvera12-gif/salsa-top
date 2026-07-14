"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { formatGs } from "@/lib/utils";
import { totalPaginas } from "@/lib/crud/paginacion";
import { productosRepo } from "@/lib/repositorios/productos";
import { categoriasRepo } from "@/lib/repositorios/categorias";
import { alternarActivoCliente, eliminarProductoCliente } from "./acciones-cliente";
import { useListado, Paginacion, BotonConfirmar, FilaCargando, FilaVacia } from "@/components/admin/lista-ui";
import { Buscador, FiltroSelect, BarraFiltros } from "@/components/admin/filtros-ui";
import { useToast } from "@/components/admin/toast";
import type { Opcion } from "@/lib/crud/tipos";

function ProductosLista() {
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";
  const estado = (sp.get("estado") as "todos" | "activos" | "inactivos") ?? "todos";
  const categoria = sp.get("categoria") ?? "";
  const page = Number(sp.get("page") ?? "1") || 1;
  const toast = useToast();

  const { datos, cargando, recargar } = useListado(
    () => productosRepo.listar({ q, estado, categoria, page }),
    [q, estado, categoria, page],
  );
  const [categorias, setCategorias] = useState<Opcion[]>([]);
  useEffect(() => {
    categoriasRepo.opciones().then(setCategorias);
  }, []);

  const lista = datos ?? { rows: [], total: 0 };
  const paginas = totalPaginas(lista.total, productosRepo.pageSize);

  async function onEliminar(id: string, nombre: string) {
    const r = await eliminarProductoCliente(id);
    if ("error" in r) toast.error(r.error);
    else {
      toast.exito(`"${nombre}" eliminado`);
      recargar();
    }
  }
  async function onAlternar(id: string, activo: boolean) {
    const r = await alternarActivoCliente(id, activo);
    if ("error" in r) toast.error(r.error);
    else {
      toast.exito(activo ? "Producto activado" : "Producto desactivado");
      recargar();
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-tinta-tenue">{lista.total} producto(s)</p>
        <Link href="/admin/productos/nuevo/" className="btn-fuego">
          <Plus size={18} /> Nuevo producto
        </Link>
      </div>

      <BarraFiltros>
        <Buscador placeholder="Buscar por nombre…" />
        <FiltroSelect
          nombre="estado"
          valorPorDefecto="todos"
          opciones={[
            { valor: "todos", etiqueta: "Todos los estados" },
            { valor: "activos", etiqueta: "Activos" },
            { valor: "inactivos", etiqueta: "Inactivos" },
          ]}
        />
        <FiltroSelect
          nombre="categoria"
          opciones={[
            { valor: "", etiqueta: "Todas las categorías" },
            ...categorias.map((c) => ({ valor: c.id, etiqueta: c.nombre })),
          ]}
        />
      </BarraFiltros>

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
              {cargando && <FilaCargando cols={6} />}
              {!cargando && lista.rows.length === 0 && <FilaVacia cols={6} texto="No hay productos." />}
              {!cargando &&
                lista.rows.map((p) => (
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
                        <Link href={`/admin/productos/editar/?id=${p.id}`} className="rounded-lg p-2 text-tinta hover:bg-black/5" aria-label="Editar">
                          <Pencil size={16} />
                        </Link>
                        <BotonConfirmar
                          mensaje={`¿Eliminar "${p.nombre}"? Esta acción no se puede deshacer.`}
                          onConfirmar={() => onEliminar(p.id, p.nombre)}
                          ariaLabel={`Eliminar ${p.nombre}`}
                        >
                          <Trash2 size={16} />
                        </BotonConfirmar>
                        <button
                          type="button"
                          onClick={() => onAlternar(p.id, !p.activo)}
                          className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-acento hover:bg-black/5"
                        >
                          {p.activo ? "Desactivar" : "Activar"}
                        </button>
                      </div>
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
        hrefDe={(n) =>
          `/admin/productos/?${new URLSearchParams({ q, estado, categoria, page: String(n) }).toString()}`
        }
      />
    </div>
  );
}

export default function ProductosPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-tinta-tenue">Cargando…</div>}>
      <ProductosLista />
    </Suspense>
  );
}
