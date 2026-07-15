import Image from "next/image";
import type { Configuracion } from "@/lib/datos";
import { SocialIcons } from "@/components/public/social-icons";
import { WhatsappIcon } from "@/components/public/whatsapp-icon";
import { waLink } from "@/lib/whatsapp";

const NAV = [
  { label: "Nosotros", href: "#nosotros" },
  { label: "Productos", href: "#productos" },
  { label: "Proceso", href: "#proceso" },
  { label: "Distribuidores", href: "#distribuidores" },
  { label: "Contacto", href: "#contacto" },
];

export function SiteFooter({ config }: { config: Configuracion }) {
  const wa = waLink(config.whatsapp, "Hola Salsa Top, quiero más información.");
  return (
    <footer className="px-6 py-10">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        {/* Logo + descripción */}
        <div className="flex flex-col items-center gap-1.5 md:items-start">
          <Image
            src="/logo-salsatop.png"
            alt="Salsa Top"
            width={1600}
            height={363}
            className="h-8 w-auto"
          />
          <p className="text-xs text-tinta-suave">
            {config.descripcion_corta ?? "Salsas artesanales gourmet del Paraguay."}
          </p>
        </div>

        {/* Navegación */}
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1.5">
          {NAV.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-tinta-suave transition-colors hover:text-acento"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Contacto + redes */}
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            href={wa}
            target="_blank"
            rel="noopener"
            className="btn-fuego px-5 py-2 text-sm"
          >
            <WhatsappIcon className="h-4 w-4" /> WhatsApp
          </a>
          <SocialIcons config={config} />
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1180px] flex-col items-center justify-between gap-2 border-t border-black/10 pt-5 text-xs text-tinta-tenue sm:flex-row">
        <p>© {new Date().getFullYear()} Salsa Top · Paraguay</p>
        <p className="flex items-center gap-3">
          <a href="/politicadeprivacidad/" className="hover:text-acento">
            Política de privacidad
          </a>
          <span>
            Desarrollado por{" "}
            <a
              href="https://neura.com.py"
              target="_blank"
              rel="noopener"
              className="font-semibold text-acento"
            >
              NEURA
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
