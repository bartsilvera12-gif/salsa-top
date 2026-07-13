import Image from "next/image";
import type { Seccion } from "@/lib/datos";
import { Reveal } from "@/components/public/reveal";

const STATS = [
  { valor: "100%", label: "Artesanal" },
  { valor: "0", label: "Colorantes artificiales" },
  { valor: "Finca", label: "Ingredientes propios" },
];

export function NosotrosSection({ historia }: { historia: Seccion }) {
  return (
    <section id="nosotros" className="px-6 py-24">
      <div className="mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="overflow-hidden rounded-3xl border border-black/10 shadow-recuadro">
            <Image
              src="/fabrica.jpg"
              alt="Planta de elaboración Salsa Top"
              width={900}
              height={650}
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
        <Reveal>
          <div className="recuadro p-8 sm:p-10">
            {historia.subtitulo && <p className="eyebrow">{historia.subtitulo}</p>}
            <h2 className="mt-3 font-title text-3xl font-extrabold uppercase text-tinta sm:text-4xl">
              {historia.titulo}
            </h2>
            {historia.contenido && (
              <p className="mt-4 text-lg leading-relaxed text-tinta-suave">{historia.contenido}</p>
            )}
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-black/10 pt-6">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="font-title text-2xl font-extrabold text-acento">{s.valor}</p>
                  <p className="text-xs font-medium uppercase tracking-wide text-tinta-tenue">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
