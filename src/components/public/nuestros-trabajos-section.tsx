import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/public/reveal";

export type Trabajo = { src: string; alt: string; titulo: string; texto: string };

export const TRABAJOS: Trabajo[] = [
  {
    src: "/fabrica.jpg",
    alt: "Planta de elaboración Salsa Top",
    titulo: "Nuestra planta",
    texto:
      "Instalaciones propias en Paraguay, donde combinamos la tradición artesanal con estándares modernos de higiene y calidad.",
  },
  {
    src: "/planta-produccion.jpg",
    alt: "Sala de producción con maquinaria de acero inoxidable",
    titulo: "Sala de producción",
    texto:
      "Un espacio amplio y equipado con maquinaria de acero inoxidable, pensado para cuidar cada detalle de la elaboración.",
  },
  {
    src: "/planta-corte.jpg",
    alt: "Selección y corte de ingredientes frescos",
    titulo: "Selección y corte",
    texto:
      "Seleccionamos y cortamos a mano ingredientes frescos, muchos de nuestra propia finca, para asegurar frescura y sabor.",
  },
  {
    src: "/planta-ingredientes.jpg",
    alt: "Ajíes y morrones naturales listos para procesar",
    titulo: "Ingredientes naturales",
    texto:
      "Ajíes, morrones y condimentos frescos y de excelente calidad, la base natural de cada una de nuestras salsas.",
  },
  {
    src: "/planta-maquinas.jpg",
    alt: "Marmitas y mezcladoras industriales",
    titulo: "Cocción y mezclado",
    texto:
      "Marmitas y mezcladoras industriales donde cocinamos y combinamos los ingredientes con control preciso de temperatura.",
  },
  {
    src: "/planta-coccion.jpg",
    alt: "Control del punto de cocción de la salsa",
    titulo: "Control de cocción",
    texto:
      "Supervisamos cada lote durante la cocción para lograr siempre la textura y el punto justo de sabor.",
  },
  {
    src: "/planta-coccion-detalle.jpg",
    alt: "Detalle de la textura de la salsa en elaboración",
    titulo: "El punto justo",
    texto:
      "Cuidamos la consistencia hasta el último detalle: color, aroma y sabor naturales, sin colorantes ni esencias.",
  },
  {
    src: "/planta-sellado.jpg",
    alt: "Envasado de la salsa en sachets",
    titulo: "Envasado en sachets",
    texto:
      "Envasamos la salsa en sachets individuales con maquinaria automática, cuidando la higiene en todo el proceso.",
  },
  {
    src: "/planta-linea.jpg",
    alt: "Línea de sachets y displays de producto",
    titulo: "Línea de producción",
    texto:
      "Miles de sachets y displays listos cada día, elaborados con el mismo cuidado del primer lote artesanal.",
  },
  {
    src: "/planta-envasadora.jpg",
    alt: "Envasadora automática junto a la marmita",
    titulo: "Envasadora automática",
    texto:
      "Tecnología que acompaña al trabajo artesanal para lograr un producto uniforme, seguro y de calidad constante.",
  },
  {
    src: "/planta-armado-displays.jpg",
    alt: "Armado de displays de Salsa Top",
    titulo: "Armado de displays",
    texto:
      "Armamos los displays de exhibición sachet por sachet, listos para el punto de venta.",
  },
  {
    src: "/planta-control-caja.jpg",
    alt: "Control de calidad del producto empacado",
    titulo: "Control de calidad",
    texto:
      "Revisamos cada display y caja antes del despacho, para que cada producto Salsa Top llegue impecable.",
  },
  {
    src: "/planta-empaquetado.jpg",
    alt: "Empaque y sellado de cajas Salsa Top",
    titulo: "Empaque y sellado",
    texto:
      "Empacamos y sellamos cada caja con cuidado, listas para llegar en perfecto estado a los puntos de venta.",
  },
  {
    src: "/planta-deposito.jpg",
    alt: "Depósito con cajas de productos Salsa Top",
    titulo: "Depósito",
    texto:
      "Un depósito ordenado con stock de nuestra línea gourmet, listo para distribuir en todo el país.",
  },
  {
    src: "/planta-pasillo.jpg",
    alt: "Producto terminado en tránsito dentro de la planta",
    titulo: "Producto terminado",
    texto:
      "Cada lote recorre un proceso ordenado y controlado, desde la elaboración hasta el despacho final.",
  },
  {
    src: "/evento-degustacion.jpg",
    alt: "Stand de Salsa Top con degustación de toda la línea de salsas",
    titulo: "Degustaciones",
    texto:
      "Llevamos la marca a eventos y puntos de venta con degustaciones de toda nuestra línea, para que cada persona descubra su salsa favorita.",
  },
];

/** Galería de la planta: imágenes con texto, en recuadros con el efecto de fuego. */
/** Tarjeta de imagen + texto, en un recuadro con el efecto de fuego. */
export function TrabajoCard({ t }: { t: Trabajo }) {
  return (
    <div className="recuadro h-full rounded-none">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={t.src}
          alt={t.alt}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="font-title text-lg font-extrabold uppercase text-tinta">{t.titulo}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-tinta-suave">{t.texto}</p>
      </div>
    </div>
  );
}

/**
 * Galería de la planta. En la home muestra `limite` imágenes en una fila de 4 y,
 * si hay más, un botón "Ver más" que abre la página completa en una pestaña nueva.
 */
export function NuestrosTrabajosSection({ limite }: { limite?: number }) {
  const items = limite ? TRABAJOS.slice(0, limite) : TRABAJOS;
  const hayMas = limite !== undefined && TRABAJOS.length > limite;
  return (
    <section id="nuestros-trabajos" className="px-6 py-24">
      <div className="mx-auto max-w-[1180px]">
        <Reveal className="mb-12 text-center">
          <p className="eyebrow">Salsa Top</p>
          <h2 className="mt-3 font-title text-4xl font-extrabold uppercase text-tinta sm:text-5xl">
            Nuestros trabajos
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((t) => (
            <Reveal key={t.src}>
              <TrabajoCard t={t} />
            </Reveal>
          ))}
        </div>
        {hayMas && (
          <div className="mt-12 text-center">
            <Link href="/nuestros-trabajos/" className="btn-fuego">
              Ver más
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
