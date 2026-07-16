import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TRABAJOS, TrabajoCard } from "@/components/public/nuestros-trabajos-section";
import { Reveal } from "@/components/public/reveal";

export const metadata: Metadata = {
  title: "Nuestros trabajos",
  description:
    "Un recorrido en imágenes por nuestra planta y el proceso artesanal de elaboración de Salsa Top.",
};

export default function NuestrosTrabajosPage() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-8 flex justify-end">
          <Link href="/" className="btn-fuego">
            <ArrowLeft size={18} /> Volver al inicio
          </Link>
        </div>
        <div className="mb-12 text-center">
          <p className="eyebrow">Salsa Top</p>
          <h1 className="mt-3 font-title text-4xl font-extrabold uppercase text-tinta sm:text-5xl">
            Nuestros trabajos
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-tinta-suave">
            Un recorrido por nuestra planta y el proceso artesanal, desde la selección de
            ingredientes hasta el producto terminado.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TRABAJOS.map((t) => (
            <Reveal key={t.src}>
              <TrabajoCard t={t} />
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/" className="btn-fuego">
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
