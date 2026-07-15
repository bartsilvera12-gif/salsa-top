import Image from "next/image";
import type { Seccion } from "@/lib/datos";

/** Divide "No es solo una salsa. Es una experiencia gourmet." en dos partes. */
function partirTitulo(titulo: string): [string, string | null] {
  const i = titulo.indexOf(". ");
  if (i === -1) return [titulo, null];
  return [titulo.slice(0, i + 1), titulo.slice(i + 2)];
}

export function Hero({ hero }: { hero: Seccion }) {
  const [parte1, parte2] = partirTitulo(hero.titulo ?? "No es solo una salsa. Es una experiencia gourmet.");

  return (
    <section id="top" className="relative overflow-hidden px-6 pb-24 pt-16">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-120px] h-[520px] w-[520px] -translate-x-1/2 animate-floatglow rounded-full"
        style={{ background: "radial-gradient(circle,rgba(255,130,0,.28),transparent 66%)", filter: "blur(20px)" }}
      />
      <div className="relative mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
        {hero.subtitulo && <p className="eyebrow">{hero.subtitulo}</p>}

        <div className="recuadro w-full max-w-xl bg-white px-10 py-12 shadow-recuadro-fuerte">
          <Image
            src="/logo-salsatop.png"
            alt="Salsa Top"
            width={1600}
            height={363}
            className="mx-auto h-auto w-full max-w-[420px]"
            priority
          />
        </div>

        <h1 className="max-w-[16ch] font-title text-4xl font-extrabold uppercase leading-none text-tinta sm:text-6xl">
          {parte1} {parte2 && <span className="texto-fuego">{parte2}</span>}
        </h1>

        {hero.contenido && (
          <p className="max-w-2xl text-lg font-medium leading-relaxed text-tinta">{hero.contenido}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <a href={hero.enlace_boton ?? "#productos"} className="btn-fuego">
            {hero.texto_boton ?? "Ver productos"}
          </a>
          <a href="#distribuidores" className="btn-contorno">
            Quiero distribuir
          </a>
        </div>
      </div>
    </section>
  );
}
