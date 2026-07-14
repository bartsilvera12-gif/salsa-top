"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Plus, Pencil } from "lucide-react";
import { formatGs } from "@/lib/utils";
import {
  getProductosAdminCliente,
  getCategoriasOpcionesCliente,
  PAGINA_PRODUCTOS,
} from "@/lib/admin-datos-cliente";
import { alternarActivoCliente, eliminarProductoCliente } from "./acciones-cliente";
import { BotonEliminarProducto, ProductosFiltros } from "@/components/admin/producto-lista-controls";
import type { ListaProductos, Opcion } from "@/lib/admin-datos";

function ProductosLista() {
  const sp = useSearchParams();
  const q = sp.get("q") ?? "";
  const estado = ((sp.get("estado") as "todos" | "activos" | "inactivos") ?? "todos") || "todos";
  const categoria = sp.get("categoria") ?? "";
  const page = Number(sp.get("page") ?? "1") || 1;

  const [lista, setLista] = useState<ListaProductos>({ rows: [], total: 0 });
  const [categorias, setCategorias] = useState<Opcion[]>([]);
  const [cargando, setCargando] = useState(true);

  const recargar = useCallback(async () => {
    setCargando(true);
    const data = await getProductosAdminCliente({ q, estado, categoria, page });
    setLista(data);
    setCargando(false);
  }, [q, estado, categoria, page]);

  useEffect(() => {
    recargar();
  }, [recargar]);
  useEffect(() => {
    getCategoriasOpcionesCliente().then(setCategorias);
  }, []);

  const paginas = Math.max(1, Math.ceil(lista.total / PAGINA_PRODUCTOS));

  async function onEliminar(id: string) {
    await eliminarProductoCliente(id);
    recargar();
  }
  async function onAlternar(id: string, activo: boolean) {
    await alternarActivoCliente(id, activo);
    recargar();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-tinta-tenue">{lista.total} producto(s)</p>
        <Link href="/admin/productos/nuevo/" className="btn-fuego">
          <Plus size={18} /> Nuevo producto
        </Link>
      </div>

      <ProductosFiltros categorias={categorias} />

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
              {cargando && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-tinta-tenue">Cargando…</td></tr>
              )}
              {!cargando && lista.rows.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-10 text-center text-tinta-tenue">No hay productos.</td></tr>
              )}
              {!cargando && lista.rows.map((p) => (
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
                      <BotonEliminarProducto nombre={p.nombre} onConfirmar={() => onEliminar(p.id)} />
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

      {paginas > 1 && (
        <div className="flex items-center justify-center gap-2">
          {Array.from({ length: paginas }).map((_, i) => {
            const n = i + 1;
            const params = new URLSearchParams({ q, estado, categoria, page: String(n) });
            return (
              <Link key={n} href={`/admin/productos/?${params.toString()}`}
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

export default function ProductosPage() {
  return (
    <Suspense fallback={<div className="py-10 text-center text-tinta-tenue">Cargando…</div>}>
      <ProductosLista />
    </Suspense>
  );
}
