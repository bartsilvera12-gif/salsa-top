"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { cuponesRepo } from "@/lib/repositorios/cupones";
import { alternarActivoCuponCliente, eliminarCuponCliente } from "./acciones-cliente";
import { useListado, BotonConfirmar, FilaCargando, FilaVacia } from "@/components/admin/lista-ui";
import { useToast } from "@/components/admin/toast";
import { formatGs } from "@/lib/utils";

const TIPO_LABEL: Record<string, string> = {
  porcentaje: "Porcentaje",
  monto_fijo: "Monto fijo",
  envio_gratis: "Envío gratis",
};

export default function CuponesPage() {
  const toast = useToast();
  const { datos, cargando, recargar } = useListado(() => cuponesRepo.listar(), []);
  const cupones = datos ?? [];

  async function onEliminar(id: string) {
    const r = await eliminarCuponCliente(id);
    if ("error" in r) toast.error(r.error);
    else {
      toast.exito("Cupón eliminado");
      recargar();
    }
  }

  async function onAlternar(id: string, activo: boolean) {
    const r = await alternarActivoCuponCliente(id, activo);
    if ("error" in r) toast.error(r.error);
    else {
      toast.exito(activo ? "Cupón activo" : "Cupón inactivo");
      recargar();
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-tinta-tenue">{cupones.length} cupón(es)</p>
        <Link href="/admin/cupones/nuevo/" className="btn-fuego"><Plus size={18} /> Nuevo cupón</Link>
      </div>

      <div className="recuadro overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-black/10 bg-crema-suave text-left text-xs uppercase tracking-wide text-tinta-tenue">
              <tr>
                <th className="px-4 py-3">Código</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Valor</th>
                <th className="px-4 py-3">Usos</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {cargando && <FilaCargando cols={6} />}
              {!cargando && cupones.length === 0 && <FilaVacia cols={6} texto="No hay cupones." />}
              {!cargando && cupones.map((c) => (
                <tr key={c.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3 font-semibold text-tinta">{c.codigo}</td>
                  <td className="px-4 py-3 text-tinta-suave">{TIPO_LABEL[c.tipo_descuento] ?? c.tipo_descuento}</td>
                  <td className="px-4 py-3 text-tinta-suave">
                    {c.tipo_descuento === "porcentaje" ? `${c.valor}%` : c.tipo_descuento === "monto_fijo" ? formatGs(c.valor) : "—"}
                  </td>
                  <td className="px-4 py-3 text-tinta-suave">{c.usos_actuales}{c.limite_usos != null ? ` / ${c.limite_usos}` : ""}</td>
                  <td className="px-4 py-3">
                    <span className={c.activo ? "rounded-full bg-petroleo/10 px-2.5 py-1 text-xs font-semibold text-petroleo" : "rounded-full bg-black/10 px-2.5 py-1 text-xs font-semibold text-tinta-tenue"}>
                      {c.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link href={`/admin/cupones/editar/?id=${c.id}`} className="rounded-lg p-2 text-tinta hover:bg-black/5" aria-label="Editar"><Pencil size={16} /></Link>
                      <button type="button" onClick={() => onAlternar(c.id, !c.activo)} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-acento hover:bg-black/5">{c.activo ? "Desactivar" : "Activar"}</button>
                      <BotonConfirmar mensaje="¿Eliminar este cupón? Esta acción no se puede deshacer." onConfirmar={() => onEliminar(c.id)} ariaLabel="Eliminar cupón">
                        <Trash2 size={16} />
                      </BotonConfirmar>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
