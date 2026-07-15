"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Flame } from "lucide-react";
import type { Producto } from "@/lib/datos";
import { createPublicClient } from "@/lib/supabase/public";
import { formatGs } from "@/lib/utils";
import { Reveal } from "@/components/public/reveal";

const CAMPOS =
  "id, nombre, slug, descripcion_corta, contenido_neto, precio, precio_oferta, en_oferta, nivel_picante, imagen_principal_url, destacado";

function Picante({ nivel }: { nivel: number }) {
  if (!nivel) return null;
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`Nivel de picante ${nivel} de 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Flame
          key={i}
          size={14}
          className={i < nivel ? "text-fuego-rojo" : "text-black/15"}
          fill={i < nivel ? "currentColor" : "none"}
        />
      ))}
    </span>
  );
}

function ProductCard({ p }: { p: Producto }) {
  const precio = p.en_oferta && p.precio_oferta ? p.precio_oferta : p.precio;
  return (
    <div className="glow-fuego bg-white shadow-[0_18px_44px_rgba(0,0,0,.12)]">
      <div className="relative aspect-[578/884] bg-white p-1">
        {p.imagen_principal_url && (
          <Image
            src={p.imagen_principal_url}
            alt={p.nombre}
            fill
            sizes="(max-width:640px) 100vw, 25vw"
            className="object-contain"
          />
        )}
      </div>
      <div className="px-5 pb-6 pt-4">
        <div className="flex items-center justify-between gap-2">
          {p.nivel_picante > 0 ? (
            <Picante nivel={p.nivel_picante} />
          ) : (
            <span className="text-xs font-semibold uppercase tracking-wider text-acento">Gourmet</span>
          )}
          {p.contenido_neto && (
            <span className="text-xs font-medium text-tinta-tenue">{p.contenido_neto}</span>
          )}
        </div>
        <h3 className="mt-2 line-clamp-2 min-h-[2.8rem] font-title text-lg font-extrabold uppercase leading-tight text-tinta">
          {p.nombre}
        </h3>
        <p className="mt-1.5 line-clamp-3 min-h-[4.25rem] text-sm leading-relaxed text-tinta-suave">
          {p.descripcion_corta}
        </p>
        {precio > 0 && (
          <p className="mt-3 font-title text-xl font-extrabold text-tinta">{formatGs(precio)}</p>
        )}
      </div>
    </div>
  );
}

export function ProductosSection({ productos }: { productos: Producto[] }) {
  // `productos` son los del build (render inmediato). Al montar, se refrescan en
  // vivo desde la base, así los cambios del admin (agregar/eliminar) se ven al
  // recargar la página, SIN necesidad de reconstruir el sitio.
  const [lista, setLista] = useState<Producto[]>(productos);

  useEffect(() => {
    let activo = true;
    createPublicClient()
      .from("productos")
      .select(CAMPOS)
      .eq("activo", true)
      .order("orden", { ascending: true })
      .then(({ data, error }) => {
        if (activo && !error && data) setLista(data as Producto[]);
      });
    return () => {
      activo = false;
    };
  }, []);

  return (
    <section id="productos" className="px-6 py-24">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="mb-12 text-center">
          <p className="eyebrow">Nuestra línea gourmet</p>
          <h2 className="mt-3 font-title text-4xl font-extrabold uppercase text-tinta sm:text-5xl">
            Productos Salsa Top
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-tinta-suave">
            Una selección pensada para quienes disfrutan de los sabores sofisticados en cada comida.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {lista.map((p) => (
            <Reveal key={p.id}>
              <ProductCard p={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
