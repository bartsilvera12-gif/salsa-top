"use client";

import { useEffect, useState } from "react";
import type { Producto } from "@/lib/datos";
import { createPublicClient } from "@/lib/supabase/public";
import { Reveal } from "@/components/public/reveal";
import { CAMPOS, ProductCard } from "@/components/public/productos-section";

/**
 * Productos marcados como "Destacado" en el panel. Igual que ProductosSection,
 * arranca con los datos del build y se refresca en vivo, así los cambios del
 * admin se ven al recargar, sin reconstruir el sitio.
 *
 * Si no hay ninguno destacado, la sección no se muestra.
 */
export function DestacadosSection({ productos }: { productos: Producto[] }) {
  const [lista, setLista] = useState<Producto[]>(productos.filter((p) => p.destacado));

  useEffect(() => {
    let activo = true;
    createPublicClient()
      .from("productos")
      .select(CAMPOS)
      .eq("activo", true)
      .eq("destacado", true)
      .order("orden", { ascending: true })
      .then(({ data, error }) => {
        if (activo && !error && data) setLista(data as Producto[]);
      });
    return () => {
      activo = false;
    };
  }, []);

  if (lista.length === 0) return null;

  return (
    <section id="destacados" className="px-6 pb-8 pt-16">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="mb-12 text-center">
          <p className="eyebrow">Nuestra selección</p>
          <h2 className="mt-3 font-title text-4xl font-extrabold uppercase text-tinta sm:text-5xl">
            Destacados
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-tinta-suave">
            Las salsas que más nos piden, para empezar a descubrir la línea gourmet.
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
