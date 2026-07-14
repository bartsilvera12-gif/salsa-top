"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { recetasRepo } from "@/lib/repositorios/recetas";
import { alternarActivaRecetaCliente, eliminarRecetaCliente } from "./acciones-cliente";
import { useListado, BotonConfirmar } from "@/components/admin/lista-ui";
import { useToast } from "@/components/admin/toast";

export default function RecetasPage() {
  const toast = useToast();
  const { datos, cargando, recargar } = useListado(() => recetasRepo.listar(), []);
  const recetas = datos ?? [];

  async function onEliminar(id: string) {
    const r = await eliminarRecetaCliente(id);
    if ("error" in r) toast.error(r.error);
    else {
      toast.exito("Receta eliminada");
      recargar();
    }
  }

  async function onAlternar(id: string, activa: boolean) {
    const r = await alternarActivaRecetaCliente(id, activa);
    if ("error" in r) toast.error(r.error);
    else {
      toast.exito(activa ? "Receta publicada" : "Receta despublicada");
      recargar();
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-tinta-tenue">{recetas.length} receta(s)</p>
        <Link href="/admin/recetas/nueva/" className="btn-fuego"><Plus size={18} /> Nueva receta</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cargando && <p className="text-tinta-tenue">Cargando…</p>}
        {!cargando && recetas.length === 0 && <p className="text-tinta-tenue">No hay recetas.</p>}
        {!cargando && recetas.map((r) => (
          <div key={r.id} className="recuadro overflow-hidden p-0">
            <div className="relative aspect-[3/2] bg-crema-suave">
              {r.imagen_principal_url && <Image src={r.imagen_principal_url} alt={r.titulo} fill className="object-cover" sizes="360px" />}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-title text-lg font-extrabold uppercase leading-tight text-tinta">{r.titulo}</h3>
                <span className={r.activa ? "flex-shrink-0 rounded-full bg-petroleo/10 px-2.5 py-1 text-xs font-semibold text-petroleo" : "flex-shrink-0 rounded-full bg-black/10 px-2.5 py-1 text-xs font-semibold text-tinta-tenue"}>
                  {r.activa ? "Publicada" : "Borrador"}
                </span>
              </div>
              {r.descripcion_corta && <p className="mt-1 line-clamp-2 text-sm text-tinta-suave">{r.descripcion_corta}</p>}
              <div className="mt-3 flex items-center gap-1.5">
                <Link href={`/admin/recetas/editar/?id=${r.id}`} className="btn-contorno px-4 py-2 text-xs"><Pencil size={14} /> Editar</Link>
                <button type="button" onClick={() => onAlternar(r.id, !r.activa)} className="rounded-lg px-3 py-2 text-xs font-semibold text-acento hover:bg-black/5">{r.activa ? "Despublicar" : "Publicar"}</button>
                <BotonConfirmar mensaje={`¿Eliminar esta receta? Esta acción no se puede deshacer.`} onConfirmar={() => onEliminar(r.id)} ariaLabel="Eliminar receta">
                  <Trash2 size={15} />
                </BotonConfirmar>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
