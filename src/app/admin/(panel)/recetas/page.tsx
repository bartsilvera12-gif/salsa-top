import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { getRecetasAdmin } from "@/lib/admin-datos";
import { alternarActivaReceta, eliminarReceta } from "./actions";

export const dynamic = "force-dynamic";

export default async function RecetasPage() {
  await requirePerfil(CONTENIDO);
  const recetas = await getRecetasAdmin();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-tinta-tenue">{recetas.length} receta(s)</p>
        <Link href="/admin/recetas/nueva" className="btn-fuego"><Plus size={18} /> Nueva receta</Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {recetas.length === 0 && <p className="text-tinta-tenue">No hay recetas.</p>}
        {recetas.map((r) => (
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
                <Link href={`/admin/recetas/${r.id}`} className="btn-contorno px-4 py-2 text-xs"><Pencil size={14} /> Editar</Link>
                <form action={alternarActivaReceta.bind(null, r.id, !r.activa)}>
                  <button type="submit" className="rounded-lg px-3 py-2 text-xs font-semibold text-acento hover:bg-black/5">{r.activa ? "Despublicar" : "Publicar"}</button>
                </form>
                <form action={eliminarReceta.bind(null, r.id)}>
                  <button type="submit" className="rounded-lg p-2 text-fuego-rojo hover:bg-fuego-rojo/10" aria-label="Eliminar"><Trash2 size={15} /></button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
