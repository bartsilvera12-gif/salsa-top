import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { requirePerfil } from "@/lib/auth";
import { ADMIN } from "@/lib/permisos";
import { getCuponesAdmin } from "@/lib/admin-datos";
import { formatGs } from "@/lib/utils";
import { alternarActivoCupon, eliminarCupon } from "./actions";

export const dynamic = "force-dynamic";

const TIPO_LABEL: Record<string, string> = {
  porcentaje: "Porcentaje",
  monto_fijo: "Monto fijo",
  envio_gratis: "Envío gratis",
};

export default async function CuponesPage() {
  await requirePerfil(ADMIN);
  const cupones = await getCuponesAdmin();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-tinta-tenue">{cupones.length} cupón(es)</p>
        <Link href="/admin/cupones/nuevo" className="btn-fuego"><Plus size={18} /> Nuevo cupón</Link>
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
              {cupones.length === 0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-tinta-tenue">No hay cupones.</td></tr>}
              {cupones.map((c) => (
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
                      <Link href={`/admin/cupones/${c.id}`} className="rounded-lg p-2 text-tinta hover:bg-black/5" aria-label="Editar"><Pencil size={16} /></Link>
                      <form action={alternarActivoCupon.bind(null, c.id, !c.activo)}>
                        <button type="submit" className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-acento hover:bg-black/5">{c.activo ? "Desactivar" : "Activar"}</button>
                      </form>
                      <form action={eliminarCupon.bind(null, c.id)}>
                        <button type="submit" className="rounded-lg p-2 text-fuego-rojo hover:bg-fuego-rojo/10" aria-label="Eliminar"><Trash2 size={16} /></button>
                      </form>
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
