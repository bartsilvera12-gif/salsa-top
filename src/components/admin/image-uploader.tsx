"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";
import { subirImagenCliente } from "@/lib/storage-cliente";

export function ImageUploader({
  value,
  onChange,
  bucket = "saltatop-productos",
  carpeta = "productos",
}: {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket?: string;
  carpeta?: string;
}) {
  const [subiendo, setSubiendo] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("La imagen no puede superar 5 MB.");
      return;
    }

    setSubiendo(true);
    try {
      const res = await subirImagenCliente(file, bucket, carpeta);
      if ("error" in res) {
        setError(res.error || "No se pudo subir la imagen.");
        return;
      }
      onChange(res.url);
    } catch {
      setError("No se pudo subir la imagen.");
    } finally {
      setSubiendo(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      {value ? (
        <div className="relative inline-block">
          <div className="relative h-40 w-32 overflow-hidden rounded-xl border border-black/10 bg-white">
            <Image src={value} alt="Imagen del producto" fill className="object-contain" sizes="128px" />
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-full bg-fuego-rojo text-white shadow"
            aria-label="Quitar imagen"
          >
            <X size={15} />
          </button>
        </div>
      ) : (
        <label className="flex h-40 w-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/20 bg-white text-tinta-tenue transition hover:border-fuego-naranja">
          <UploadCloud size={22} />
          <span className="px-2 text-center text-xs font-medium">
            {subiendo ? "Subiendo…" : "Subir imagen"}
          </span>
          <input type="file" accept="image/*" className="hidden" onChange={onFile} disabled={subiendo} />
        </label>
      )}
      {error && <p className="mt-1 text-xs font-medium text-fuego-rojo">{error}</p>}
    </div>
  );
}
