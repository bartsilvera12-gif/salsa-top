"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UploadCloud, Trash2, Copy, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { slugify } from "@/lib/utils";
import { registrarArchivo, eliminarArchivo } from "@/app/admin/(panel)/multimedia/actions";
import type { ArchivoRow } from "@/lib/admin-datos";

const BUCKET = "saltatop-general";

export function MultimediaManager({ archivos }: { archivos: ArchivoRow[] }) {
  const router = useRouter();
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiado, setCopiado] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    if (!file.type.startsWith("image/")) { setError("Solo imágenes."); return; }
    if (file.size > 5 * 1024 * 1024) { setError("Máximo 5 MB."); return; }

    setSubiendo(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop() ?? "jpg";
      const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "archivo";
      const path = `biblioteca/${Date.now()}-${base}.${ext}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, { cacheControl: "3600" });
      if (upErr) { setError("No se pudo subir."); return; }
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      const res = await registrarArchivo({
        nombre: file.name, url: data.publicUrl, ruta_storage: path,
        mime_type: file.type, tamano_bytes: file.size,
      });
      if ("error" in res) { setError(res.error); return; }
      router.refresh();
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  }

  async function copiar(url: string) {
    try { await navigator.clipboard.writeText(url); setCopiado(url); setTimeout(() => setCopiado(null), 1500); } catch { /* noop */ }
  }

  return (
    <div className="space-y-5">
      <label className="recuadro flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-black/20 py-10 text-tinta-tenue transition hover:border-fuego-naranja">
        <UploadCloud size={26} />
        <span className="text-sm font-semibold">{subiendo ? "Subiendo…" : "Subir imagen a la biblioteca"}</span>
        <span className="text-xs">JPG, PNG, WEBP · máx 5 MB</span>
        <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={subiendo} />
      </label>
      {error && <p className="text-sm font-medium text-fuego-rojo">{error}</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {archivos.length === 0 && <p className="col-span-full text-tinta-tenue">La biblioteca está vacía.</p>}
        {archivos.map((a) => (
          <div key={a.id} className="recuadro overflow-hidden p-0">
            <div className="relative aspect-square bg-white">
              <Image src={a.url} alt={a.nombre} fill className="object-contain" sizes="200px" />
            </div>
            <div className="flex items-center justify-between gap-1 p-2">
              <button type="button" onClick={() => copiar(a.url)} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-acento hover:bg-black/5">
                {copiado === a.url ? <><Check size={13} /> Copiado</> : <><Copy size={13} /> URL</>}
              </button>
              <button type="button" onClick={() => { void eliminarArchivo(a.id, a.ruta_storage).then(() => router.refresh()); }} className="rounded-lg p-1.5 text-fuego-rojo hover:bg-fuego-rojo/10" aria-label="Eliminar">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
