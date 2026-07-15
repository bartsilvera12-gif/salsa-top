"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { WhatsappIcon } from "@/components/public/whatsapp-icon";

const LINKS = [
  { label: "Nosotros", href: "#nosotros" },
  { label: "Productos", href: "#productos" },
  { label: "Proceso", href: "#proceso" },
  { label: "Distribuidores", href: "#distribuidores" },
  { label: "Contacto", href: "#contacto" },
];

export function SiteHeader({ whatsappUrl }: { whatsappUrl: string }) {
  const [abierto, setAbierto] = useState(false);

  return (
    <header className="relative z-50 px-4 pt-3">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-4">
        {/* Recuadro del logo */}
        <a href="#top" className="borde-fuego-blanco flex flex-shrink-0 items-center rounded-2xl px-5 py-2.5 shadow-recuadro-fuerte">
          <Image src="/logo-salsatop.png" alt="Salsa Top" width={1600} height={363} className="h-7 w-auto" priority />
        </a>

        {/* Recuadro del menú (desktop) */}
        <nav className="borde-fuego hidden items-center gap-6 rounded-2xl px-6 py-2 shadow-recuadro-fuerte lg:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-[15px] font-semibold text-tinta transition hover:text-acento">
              {l.label}
            </a>
          ))}
          <a href={whatsappUrl} target="_blank" rel="noopener" className="btn-fuego px-5 py-2.5 text-[15px]">
            <WhatsappIcon className="h-4 w-4" /> WhatsApp
          </a>
        </nav>

        {/* Botón móvil */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setAbierto((v) => !v)}
            className="borde-fuego grid h-11 w-11 place-items-center rounded-xl text-tinta shadow-recuadro-fuerte"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={abierto}
          >
            {abierto ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Menú móvil desplegable */}
      <div
        className={cn(
          "mx-auto mt-2 max-w-[1280px] overflow-hidden transition-all lg:hidden",
          abierto ? "max-h-96" : "max-h-0",
        )}
      >
        <nav className="borde-fuego flex flex-col gap-1 rounded-2xl p-3 shadow-recuadro-fuerte">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setAbierto(false)}
              className="rounded-lg px-3 py-2.5 text-center font-semibold text-tinta hover:bg-white/60"
            >
              {l.label}
            </a>
          ))}
          <a href={whatsappUrl} target="_blank" rel="noopener" className="btn-fuego mt-1 w-full">
            <WhatsappIcon className="h-4 w-4" /> WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
