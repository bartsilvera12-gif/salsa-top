import type { Seccion } from "@/lib/datos";
import { Reveal } from "@/components/public/reveal";

export function PropuestaSection({ propuesta }: { propuesta: Seccion }) {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="recuadro p-8 text-center sm:p-12">
            <p className="eyebrow">{propuesta.subtitulo ?? "Posicionamiento"}</p>
            <h2 className="mt-3 font-title text-3xl font-extrabold uppercase text-tinta sm:text-4xl">
              {propuesta.titulo ?? "Una propuesta única"}
            </h2>
            {propuesta.contenido && (
              <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-tinta-suave">
                {propuesta.contenido}
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
