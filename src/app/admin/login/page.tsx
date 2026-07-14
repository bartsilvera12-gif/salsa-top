import Image from "next/image";
import type { Metadata } from "next";
import { LoginPanel } from "@/components/admin/login-panel";

export const metadata: Metadata = {
  title: "Ingresar al panel",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12">
      {/* Fondo de chiles */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-crema bg-[url('/fondo-beneficios.jpg')] bg-[length:100%_auto] bg-repeat-y opacity-90"
      />
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <span className="borde-fuego-blanco inline-flex items-center rounded-2xl px-6 py-4 shadow-recuadro-fuerte">
            <Image src="/logo-icono.png" alt="Salsa Top" width={44} height={44} priority />
          </span>
        </div>

        <div className="recuadro p-7 sm:p-9">
          <div className="mb-6 text-center">
            <p className="eyebrow">Panel de administración</p>
            <h1 className="mt-2 font-title text-3xl font-extrabold uppercase text-tinta">
              Salsa Top
            </h1>
            <p className="mt-1 text-sm text-tinta-tenue">Ingresá con tu cuenta autorizada.</p>
          </div>

          <LoginPanel />
        </div>

        <p className="mt-6 text-center text-xs text-tinta-tenue">
          Salsa Top · Paraguay · Desarrollado por{" "}
          <a href="https://neura.com.py" className="font-semibold text-acento" target="_blank" rel="noopener">
            NEURA
          </a>
        </p>
      </div>
    </main>
  );
}
