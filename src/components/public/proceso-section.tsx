import { Sprout, Hand, ShieldCheck } from "lucide-react";
import type { Seccion } from "@/lib/datos";
import { Reveal } from "@/components/public/reveal";

const PASOS = [
  { icono: Sprout, titulo: "Cultivo propio", desc: "Ingredientes frescos de nuestra finca." },
  { icono: Hand, titulo: "Elaboración a mano", desc: "Procesos artesanales, lote por lote." },
  { icono: ShieldCheck, titulo: "Calidad garantizada", desc: "Control de calidad en cada etapa." },
];

export function ProcesoSection({ proceso, historia }: { proceso: Seccion; historia: Seccion }) {
  return (
    <section id="proceso" className="px-6 py-24">
      <div className="mx-auto max-w-[1180px]">
        <Reveal>
          <div className="recuadro p-8 sm:p-12">
            <div className="text-center">
              <p className="eyebrow">{proceso.subtitulo ?? "Proceso artesanal"}</p>
              <h2 className="mt-3 font-title text-3xl font-extrabold uppercase text-tinta sm:text-4xl">
                {historia.titulo ?? "De la tradición familiar a tu mesa"}
              </h2>
              {historia.contenido && (
                <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-tinta-suave">
                  {historia.contenido}
                </p>
              )}
            </div>
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {PASOS.map((p) => {
                const Icono = p.icono;
                return (
                  <div key={p.titulo} className="flex flex-col items-center gap-3 text-center">
                    <span className="grid h-14 w-14 place-items-center rounded-2xl bg-fuego-gradient text-[#1a0e00]">
                      <Icono size={26} />
                    </span>
                    <h3 className="font-title text-xl font-extrabold uppercase text-tinta">{p.titulo}</h3>
                    <p className="text-sm text-tinta-suave">{p.desc}</p>
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
