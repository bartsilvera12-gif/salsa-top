import { Hand, Leaf, Sparkles, ShieldCheck, type LucideIcon } from "lucide-react";
import type { Beneficio } from "@/lib/datos";
import { Reveal } from "@/components/public/reveal";

const ICONOS: Record<string, LucideIcon> = {
  hand: Hand,
  leaf: Leaf,
  sparkles: Sparkles,
  "shield-check": ShieldCheck,
};

const OBJETIVO = [
  "Construimos una marca de excelencia con productos únicos, hechos de forma artesanal y con ingredientes naturales, frescos y seleccionados, para llevar sabor auténtico al mundo.",
  "Utilizamos procesos y parámetros para futuramente obtener certificación HACCP e ISO 9001, estándares internacionales que respaldan nuestra seguridad alimentaria y calidad total, garantizando productos confiables y de alta calidad.",
  "Nuestro enfoque inicial está en los más diversos puntos de ventas del Paraguay, con planes de expansión para la exportación en los próximos años.",
];

/** "Objetivo" (visión de la marca) + los beneficios, unificados en un solo recuadro. */
export function BeneficiosSection({ beneficios }: { beneficios: Beneficio[] }) {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <div className="recuadro p-8 sm:p-12">
            <div className="mx-auto max-w-3xl text-center">
              <p className="eyebrow">Nuestra visión</p>
              <h2 className="mt-3 font-title text-3xl font-extrabold uppercase text-tinta sm:text-4xl">
                Objetivo
              </h2>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-tinta-suave">
                {OBJETIVO.map((parrafo, i) => (
                  <p key={i}>{parrafo}</p>
                ))}
              </div>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {beneficios.map((b) => {
                const Icono = (b.icono && ICONOS[b.icono]) || Sparkles;
                return (
                  <div
                    key={b.id}
                    className="glow-fuego h-full rounded-2xl border border-black/10 bg-white p-6 shadow-recuadro"
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-fuego-gradient text-[#1a0e00]">
                      <Icono size={24} />
                    </span>
                    <h3 className="mt-4 font-title text-lg font-extrabold uppercase text-tinta">
                      {b.titulo}
                    </h3>
                    {b.descripcion && (
                      <p className="mt-1.5 text-sm leading-relaxed text-tinta-suave">{b.descripcion}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
