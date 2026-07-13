import Link from "next/link";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { getTestimoniosAdmin } from "@/lib/admin-datos";
import { alternarAprobadoTestimonio, eliminarTestimonio } from "./actions";

export const dynamic = "force-dynamic";

export default async function TestimoniosPage() {
  await requirePerfil(CONTENIDO);
  const testimonios = await getTestimoniosAdmin();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-tinta-tenue">{testimonios.length} testimonio(s)</p>
        <Link href="/admin/testimonios/nuevo" className="btn-fuego"><Plus size={18} /> Nuevo testimonio</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {testimonios.length === 0 && <p className="text-tinta-tenue">No hay testimonios.</p>}
        {testimonios.map((t) => (
          <div key={t.id} className="recuadro p-5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-title text-lg font-extrabold uppercase text-tinta">{t.nombre_cliente}</h3>
                {t.cargo_o_descripcion && <p className="text-xs text-tinta-tenue">{t.cargo_o_descripcion}</p>}
              </div>
              <span className={t.aprobado
                ? "flex-shrink-0 rounded-full bg-petroleo/10 px-2.5 py-1 text-xs font-semibold text-petroleo"
                : "flex-shrink-0 rounded-full bg-fuego-amarillo/30 px-2.5 py-1 text-xs font-semibold text-acento"}>
                {t.aprobado ? "Aprobado" : "Pendiente"}
              </span>
            </div>
            <div className="mt-2 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={14} className={i < t.calificacion ? "text-fuego-naranja" : "text-black/15"} fill={i < t.calificacion ? "currentColor" : "none"} />
              ))}
            </div>
            <p className="mt-2 line-clamp-3 text-sm text-tinta-suave">“{t.comentario}”</p>
            <div className="mt-4 flex items-center gap-1.5">
              <Link href={`/admin/testimonios/${t.id}`} className="btn-contorno px-4 py-2 text-xs"><Pencil size={14} /> Editar</Link>
              <form action={alternarAprobadoTestimonio.bind(null, t.id, !t.aprobado)}>
                <button type="submit" className="rounded-lg px-3 py-2 text-xs font-semibold text-acento hover:bg-black/5">
                  {t.aprobado ? "Quitar" : "Aprobar"}
                </button>
              </form>
              <form action={eliminarTestimonio.bind(null, t.id)}>
                <button type="submit" className="rounded-lg p-2 text-fuego-rojo hover:bg-fuego-rojo/10" aria-label="Eliminar"><Trash2 size={15} /></button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
