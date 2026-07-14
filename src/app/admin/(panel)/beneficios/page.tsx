"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { beneficiosRepo } from "@/lib/repositorios/beneficios";
import { alternarActivoBeneficioCliente, eliminarBeneficioCliente } from "./acciones-cliente";
import { useListado, BotonConfirmar } from "@/components/admin/lista-ui";
import { useToast } from "@/components/admin/toast";

export default function BeneficiosPage() {
  const toast = useToast();
  const { datos, cargando, recargar } = useListado(() => beneficiosRepo.listar(), []);
  const beneficios = datos ?? [];

  async function onEliminar(id: string) {
    const r = await eliminarBeneficioCliente(id);
    if ("error" in r) toast.error(r.error);
    else {
      toast.exito("Beneficio eliminado");
      recargar();
    }
  }

  async function onAlternar(id: string, activo: boolean) {
    const r = await alternarActivoBeneficioCliente(id, activo);
    if ("error" in r) toast.error(r.error);
    else {
      toast.exito(activo ? "Beneficio visible" : "Beneficio oculto");
      recargar();
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-tinta-tenue">{beneficios.length} beneficio(s)</p>
        <Link href="/admin/beneficios/nuevo/" className="btn-fuego"><Plus size={18} /> Nuevo beneficio</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cargando && <p className="text-tinta-tenue">Cargando…</p>}
        {!cargando && beneficios.length === 0 && <p className="text-tinta-tenue">No hay beneficios.</p>}
        {!cargando && beneficios.map((b) => (
          <div key={b.id} className="recuadro p-5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-title text-lg font-extrabold uppercase text-tinta">{b.titulo}</h3>
              <span className={b.activo
                ? "flex-shrink-0 rounded-full bg-petroleo/10 px-2.5 py-1 text-xs font-semibold text-petroleo"
                : "flex-shrink-0 rounded-full bg-black/10 px-2.5 py-1 text-xs font-semibold text-tinta-tenue"}>
                {b.activo ? "Activo" : "Oculto"}
              </span>
            </div>
            {b.descripcion && <p className="mt-1.5 text-sm text-tinta-suave">{b.descripcion}</p>}
            <div className="mt-4 flex items-center gap-1.5">
              <Link href={`/admin/beneficios/editar/?id=${b.id}`} className="btn-contorno px-4 py-2 text-xs"><Pencil size={14} /> Editar</Link>
              <button type="button" onClick={() => onAlternar(b.id, !b.activo)} className="rounded-lg px-3 py-2 text-xs font-semibold text-acento hover:bg-black/5">
                {b.activo ? "Ocultar" : "Mostrar"}
              </button>
              <BotonConfirmar mensaje={`¿Eliminar este beneficio? Esta acción no se puede deshacer.`} onConfirmar={() => onEliminar(b.id)} ariaLabel="Eliminar beneficio">
                <Trash2 size={15} />
              </BotonConfirmar>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
