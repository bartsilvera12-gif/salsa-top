import { Hand, Leaf, Sparkles, ShieldCheck, type LucideIcon } from "lucide-react";
import type { Beneficio } from "@/lib/datos";
import { Reveal } from "@/components/public/reveal";

const ICONOS: Record<string, LucideIcon> = {
  hand: Hand,
  leaf: Leaf,
  sparkles: Sparkles,
  "shield-check": ShieldCheck,
};

export function BeneficiosSection({ beneficios }: { beneficios: Beneficio[] }) {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="mb-12 text-center">
          <p className="eyebrow">Por qué Salsa Top</p>
          <h2 className="mt-3 font-title text-4xl font-extrabold uppercase text-tinta sm:text-5xl">
            Sabor real, hecho con cuidado
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {beneficios.map((b) => {
            const Icono = (b.icono && ICONOS[b.icono]) || Sparkles;
            return (
              <Reveal key={b.id}>
                <div className="recuadro h-full p-6">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-fuego-gradient text-[#1a0e00]">
                    <Icono size={24} />
                  </span>
                  <h3 className="mt-4 font-title text-lg font-extrabold uppercase text-tinta">{b.titulo}</h3>
                  {b.descripcion && <p className="mt-1.5 text-sm text-tinta-suave">{b.descripcion}</p>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
