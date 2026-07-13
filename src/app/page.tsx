import Image from "next/image";

/**
 * Home temporal (placeholder). La reconstrucción fiel del sitio público
 * (hero, productos, nosotros, etc.) se realiza en la FASE 4.
 */
export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 text-center">
      <div className="borde-fuego-blanco inline-flex items-center rounded-2xl px-6 py-4 shadow-recuadro-fuerte">
        <Image
          src="/logo-icono.png"
          alt="Salsa Top"
          width={48}
          height={48}
          priority
        />
      </div>
      <div>
        <p className="eyebrow">Artesanal · Gourmet · Paraguay</p>
        <h1 className="mt-3 font-title text-5xl font-extrabold uppercase leading-none text-tinta">
          No es solo una salsa.{" "}
          <span className="texto-fuego">Es una experiencia gourmet.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-tinta-suave">
          Migración en curso a Next.js + Supabase. El sitio público se
          reconstruye en la FASE 4 conservando el diseño actual.
        </p>
      </div>
    </main>
  );
}
