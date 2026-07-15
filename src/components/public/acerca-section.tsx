import { Reveal } from "@/components/public/reveal";

type Bloque = { eyebrow?: string; titulo: string; parrafos: string[] };

const BLOQUES: Bloque[] = [
  {
    eyebrow: "Nuestro público",
    titulo: "¿A quién impactamos?",
    parrafos: [
      "Creamos productos para quienes disfrutan los sabores sofisticados y convierten cada comida en un momento especial: con amigos, en familia o en cualquier ocasión única. Porque comer bien también es disfrutar la vida.",
    ],
  },
  {
    eyebrow: "Por qué elegirnos",
    titulo: "Beneficios",
    parrafos: [
      "Elaboramos productos artesanales con ingredientes naturales, frutas, verduras y condimentos frescos, muchos de nuestra propia finca, para ofrecerte frescura real y sabor auténtico en cada bocado.",
      "En nuestra elaboración no utilizamos colorantes ni esencias artificiales. El color, el aroma y el sabor son el resultado natural de una cuidadosa selección y combinación de ingredientes de alta calidad.",
      "No es solo una salsa: es una experiencia gourmet. Elaborada de forma artesanal y respaldada por estándares de calidad, para transformar cada comida en un momento especial.",
    ],
  },
  {
    eyebrow: "El mercado",
    titulo: "Competencia de la marca",
    parrafos: [
      "Nuestra marca no posee un competidor directo, ya que desarrolla productos elaborados con ingredientes y combinaciones únicas que actualmente no tienen un equivalente en el mercado. En otras palabras, no existe una marca que ofrezca un portafolio de productos similares al nuestro.",
      "Sin embargo, identificamos como competencia indirecta a marcas reconocidas que participan en la categoría de salsas y condimentos premium, con estándares de calidad comparables, entre las que se destacan Heinz, Tabasco y Kühne. Si bien sus productos difieren en formulación, sabor y propuesta de valor, compiten por el mismo espacio de consumo y por la preferencia del consumidor.",
    ],
  },
];

/**
 * Bloques informativos de la marca, cada uno en un recuadro con el efecto de fuego.
 * `incluir` filtra qué bloques renderizar (por título); si se omite, muestra todos.
 */
export function AcercaSection({ incluir, id }: { incluir?: string[]; id?: string }) {
  const bloques = incluir ? BLOQUES.filter((b) => incluir.includes(b.titulo)) : BLOQUES;
  return (
    <section id={id} className="px-6 pb-24">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {bloques.map((b) => (
          <Reveal key={b.titulo}>
            <div className="recuadro p-8 sm:p-12">
              {b.eyebrow && <p className="eyebrow">{b.eyebrow}</p>}
              <h2 className="mt-3 font-title text-3xl font-extrabold uppercase text-tinta sm:text-4xl">
                {b.titulo}
              </h2>
              <div className="mt-5 space-y-4 text-lg leading-relaxed text-tinta-suave">
                {b.parrafos.map((parrafo, i) => (
                  <p key={i}>{parrafo}</p>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
