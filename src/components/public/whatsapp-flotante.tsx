import { WhatsappIcon } from "@/components/public/whatsapp-icon";

/**
 * Botón flotante de WhatsApp, fijo abajo a la derecha en todas las páginas.
 * Usa el gradiente de fuego de la marca, igual que el resto de los botones de
 * WhatsApp del sitio.
 */
export function WhatsappFlotante({ url }: { url: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener"
      aria-label="Escribinos por WhatsApp"
      title="Escribinos por WhatsApp"
      className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-fuego-gradient text-[#1a0e00] shadow-recuadro-fuerte transition hover:scale-110 sm:h-16 sm:w-16"
    >
      <WhatsappIcon className="h-7 w-7 sm:h-8 sm:w-8" />
    </a>
  );
}
