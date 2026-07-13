import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { getSeccionesAdmin } from "@/lib/admin-datos";
import { alternarActivaSeccion } from "./actions";

export const dynamic = "force-dynamic";

export default async function ContenidoPage() {
  await requirePerfil(CONTENIDO);
  const secciones = await getSeccionesAdmin();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-tinta-tenue">Secciones editables del sitio público</p>
        <Link href="/admin/contenido/nuevo" className="btn-fuego"><Plus size={18} /> Nueva sección</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {secciones.length === 0 && <p className="text-tinta-tenue">No hay secciones.</p>}
        {secciones.map((s) => (
          <div key={s.id} className="recuadro p-5">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-title text-xs font-bold uppercase tracking-widest text-acento">{s.clave}</p>
                <h3 className="mt-1 truncate font-title text-lg font-extrabold uppercase text-tinta">{s.titulo ?? "—"}</h3>
                {s.contenido && <p className="mt-1 line-clamp-2 text-sm text-tinta-suave">{s.contenido}</p>}
              </div>
              <span className={s.activa
                ? "flex-shrink-0 rounded-full bg-petroleo/10 px-2.5 py-1 text-xs font-semibold text-petroleo"
                : "flex-shrink-0 rounded-full bg-black/10 px-2.5 py-1 text-xs font-semibold text-tinta-tenue"}>
                {s.activa ? "Activa" : "Oculta"}
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <Link href={`/admin/contenido/${s.id}`} className="btn-contorno px-4 py-2 text-xs">
                <Pencil size={14} /> Editar
              </Link>
              <form action={alternarActivaSeccion.bind(null, s.id, !s.activa)}>
                <button type="submit" className="rounded-lg px-3 py-2 text-xs font-semibold text-acento hover:bg-black/5">
                  {s.activa ? "Ocultar" : "Mostrar"}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
