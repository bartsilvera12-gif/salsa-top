import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { getBeneficiosAdmin } from "@/lib/admin-datos";
import { alternarActivoBeneficio, eliminarBeneficio } from "./actions";

export const dynamic = "force-dynamic";

export default async function BeneficiosPage() {
  await requirePerfil(CONTENIDO);
  const beneficios = await getBeneficiosAdmin();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-tinta-tenue">{beneficios.length} beneficio(s)</p>
        <Link href="/admin/beneficios/nuevo" className="btn-fuego"><Plus size={18} /> Nuevo beneficio</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {beneficios.length === 0 && <p className="text-tinta-tenue">No hay beneficios.</p>}
        {beneficios.map((b) => (
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
              <Link href={`/admin/beneficios/${b.id}`} className="btn-contorno px-4 py-2 text-xs"><Pencil size={14} /> Editar</Link>
              <form action={alternarActivoBeneficio.bind(null, b.id, !b.activo)}>
                <button type="submit" className="rounded-lg px-3 py-2 text-xs font-semibold text-acento hover:bg-black/5">
                  {b.activo ? "Ocultar" : "Mostrar"}
                </button>
              </form>
              <form action={eliminarBeneficio.bind(null, b.id)}>
                <button type="submit" className="rounded-lg p-2 text-fuego-rojo hover:bg-fuego-rojo/10" aria-label="Eliminar"><Trash2 size={15} /></button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
