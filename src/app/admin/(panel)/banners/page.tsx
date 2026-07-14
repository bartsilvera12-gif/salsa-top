"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { bannersRepo } from "@/lib/repositorios/banners";
import { alternarActivoBannerCliente, eliminarBannerCliente } from "./acciones-cliente";
import { useListado, BotonConfirmar } from "@/components/admin/lista-ui";
import { useToast } from "@/components/admin/toast";

export default function BannersPage() {
  const toast = useToast();
  const { datos, cargando, recargar } = useListado(() => bannersRepo.listar(), []);
  const banners = datos ?? [];

  async function onEliminar(id: string) {
    const r = await eliminarBannerCliente(id);
    if ("error" in r) toast.error(r.error);
    else {
      toast.exito("Banner eliminado");
      recargar();
    }
  }

  async function onAlternar(id: string, activo: boolean) {
    const r = await alternarActivoBannerCliente(id, activo);
    if ("error" in r) toast.error(r.error);
    else {
      toast.exito(activo ? "Banner visible" : "Banner oculto");
      recargar();
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-tinta-tenue">{banners.length} banner(s)</p>
        <Link href="/admin/banners/nuevo/" className="btn-fuego"><Plus size={18} /> Nuevo banner</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {cargando && <p className="text-tinta-tenue">Cargando…</p>}
        {!cargando && banners.length === 0 && <p className="text-tinta-tenue">No hay banners.</p>}
        {!cargando && banners.map((b) => (
          <div key={b.id} className="recuadro overflow-hidden p-0">
            <div className="relative aspect-[16/6] bg-crema-suave">
              {b.imagen_desktop_url && <Image src={b.imagen_desktop_url} alt={b.titulo ?? ""} fill className="object-cover" sizes="500px" />}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-title text-xs font-bold uppercase tracking-widest text-acento">{b.subtitulo ?? "Banner"}</p>
                  <h3 className="font-title text-lg font-extrabold uppercase text-tinta">{b.titulo ?? "—"}</h3>
                </div>
                <span className={b.activo ? "flex-shrink-0 rounded-full bg-petroleo/10 px-2.5 py-1 text-xs font-semibold text-petroleo" : "flex-shrink-0 rounded-full bg-black/10 px-2.5 py-1 text-xs font-semibold text-tinta-tenue"}>
                  {b.activo ? "Activo" : "Oculto"}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1.5">
                <Link href={`/admin/banners/editar/?id=${b.id}`} className="btn-contorno px-4 py-2 text-xs"><Pencil size={14} /> Editar</Link>
                <button type="button" onClick={() => onAlternar(b.id, !b.activo)} className="rounded-lg px-3 py-2 text-xs font-semibold text-acento hover:bg-black/5">{b.activo ? "Ocultar" : "Mostrar"}</button>
                <BotonConfirmar mensaje={`¿Eliminar este banner? Esta acción no se puede deshacer.`} onConfirmar={() => onEliminar(b.id)} ariaLabel="Eliminar banner">
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
