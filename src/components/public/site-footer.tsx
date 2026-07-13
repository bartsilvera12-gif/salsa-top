import Image from "next/image";
import type { Configuracion } from "@/lib/datos";
import { SocialIcons } from "@/components/public/social-icons";

const NAV = [
  { label: "Nosotros", href: "#nosotros" },
  { label: "Productos", href: "#productos" },
  { label: "Proceso", href: "#proceso" },
  { label: "Distribuidores", href: "#distribuidores" },
  { label: "Contacto", href: "#contacto" },
];

export function SiteFooter({ config }: { config: Configuracion }) {
  return (
    <footer className="border-t border-black/10 px-6 py-14">
      <div className="mx-auto grid max-w-[1180px] gap-10 sm:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center rounded-xl bg-white px-3 py-2 shadow-recuadro">
              <Image src="/logo-icono.png" alt="Salsa Top" width={28} height={28} />
            </span>
            <span className="font-title text-xl font-extrabold uppercase text-tinta">Salsa Top</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-tinta-suave">
            {config.descripcion_corta ?? "Salsas artesanales gourmet del Paraguay."}
          </p>
        </div>

        <div>
          <p className="font-title text-sm font-bold uppercase tracking-widest text-acento">Navegación</p>
          <ul className="mt-4 space-y-2">
            {NAV.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-tinta-suave hover:text-acento">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-title text-sm font-bold uppercase tracking-widest text-acento">Seguinos</p>
          <div className="mt-4">
            <SocialIcons config={config} />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-[1180px] flex-col items-center justify-between gap-2 border-t border-black/10 pt-6 text-xs text-tinta-tenue sm:flex-row">
        <p>© {new Date().getFullYear()} Salsa Top · Paraguay</p>
        <p className="flex items-center gap-3">
          <a href="/politicadeprivacidad/" className="hover:text-acento">Política de privacidad</a>
          <span>
            Desarrollado por{" "}
            <a href="https://neura.com.py" target="_blank" rel="noopener" className="font-semibold text-acento">
              NEURA
            </a>
          </span>
        </p>
      </div>
    </footer>
  );
}
