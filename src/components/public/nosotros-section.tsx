import Image from "next/image";
import { Reveal } from "@/components/public/reveal";

const STATS = [
  { valor: "100%", label: "Artesanal" },
  { valor: "0", label: "Colorantes artificiales" },
  { valor: "Finca", label: "Ingredientes propios" },
];

const PARRAFOS = [
  "Somos una marca que nace de la tradición familiar en la producción artesanal de salsas picantes, agridulces, untables y otros productos relacionados a la gastronomía.",
  "Combinamos técnicas artesanales con ingredientes naturales de excelente calidad, muchos de ellos cultivados en nuestra propia finca, y también utilizamos insumos importados cuidadosamente seleccionados, para crear una línea gourmet auténtica y llena de sabor.",
  "Salsa Top es símbolo de sabor y calidad garantizada, ofreciendo experiencias inolvidables en cada producto.",
];

export function NosotrosSection() {
  return (
    <section id="nosotros" className="px-6 py-24">
      <div className="mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="glow-fuego border border-black/10 shadow-recuadro">
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
            <p className="eyebrow">Salsa Top</p>
            <h2 className="mt-3 font-title text-3xl font-extrabold uppercase text-tinta sm:text-4xl">
              Quién somos
            </h2>
            <div className="mt-4 space-y-3 text-base leading-relaxed text-tinta-suave">
              {PARRAFOS.map((parrafo, i) => (
                <p key={i}>{parrafo}</p>
              ))}
            </div>
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
