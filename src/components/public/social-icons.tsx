import { Instagram, Facebook } from "lucide-react";
import type { Configuracion } from "@/lib/datos";

function TikTok({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.6 5.8a4.3 4.3 0 0 1-1-2.8h-3v11.6a2.4 2.4 0 1 1-2.4-2.4c.2 0 .5 0 .7.1V9.2a5.6 5.6 0 0 0-.7-.1 5.4 5.4 0 1 0 5.4 5.4V8.6a7.2 7.2 0 0 0 4 1.2V6.7a4.3 4.3 0 0 1-3-.9z" />
    </svg>
  );
}

const CIRCULO =
  "grid h-12 w-12 place-items-center rounded-full bg-fuego-gradient-135 text-[#1a0e00] transition-transform hover:-translate-y-0.5";

export function SocialIcons({ config }: { config: Configuracion }) {
  return (
    <div className="flex items-center gap-3">
      {config.instagram_url && (
        <a href={config.instagram_url} target="_blank" rel="noopener" aria-label="Instagram" className={CIRCULO}>
          <Instagram size={22} />
        </a>
      )}
      {config.facebook_url && (
        <a href={config.facebook_url} target="_blank" rel="noopener" aria-label="Facebook" className={CIRCULO}>
          <Facebook size={22} />
        </a>
      )}
      {config.tiktok_url && (
        <a href={config.tiktok_url} target="_blank" rel="noopener" aria-label="TikTok" className={CIRCULO}>
          <TikTok />
        </a>
      )}
    </div>
  );
}
