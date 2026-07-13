import { MessageCircle } from "lucide-react";
import type { Configuracion, Seccion } from "@/lib/datos";
import { waLink } from "@/lib/whatsapp";
import { SocialIcons } from "@/components/public/social-icons";
import { Reveal } from "@/components/public/reveal";

export function DistribuidoresSection({ config }: { config: Configuracion }) {
  const url = waLink(config.whatsapp, "Hola Salsa Top, quiero vender sus productos en mi local.");
  return (
    <section id="distribuidores" className="px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <div className="recuadro flex flex-col items-center gap-5 p-8 text-center sm:p-12">
            <p className="eyebrow">Para comercios y mayoristas</p>
            <h2 className="font-title text-3xl font-extrabold uppercase text-tinta sm:text-4xl">
              Sumá Salsa Top a tu local
            </h2>
            <p className="max-w-xl text-lg text-tinta-suave">
              Trabajamos con comercios y mayoristas. Escribinos para conocer condiciones y precios de distribución.
            </p>
            <a href={url} target="_blank" rel="noopener" className="btn-fuego">
              Quiero vender Salsa Top
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function ContactoSection({ config, contacto }: { config: Configuracion; contacto: Seccion }) {
  const url = waLink(config.whatsapp, "Hola Salsa Top, quiero más información.");
  return (
    <section id="contacto" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <div className="recuadro flex flex-col items-center gap-6 p-8 text-center sm:p-12">
            <div>
              <p className="eyebrow">{contacto.subtitulo ?? "Contacto"}</p>
              <h2 className="mt-3 font-title text-3xl font-extrabold uppercase text-tinta sm:text-4xl">
                {contacto.titulo ?? "Hablemos de sabor"}
              </h2>
              {contacto.contenido && (
                <p className="mx-auto mt-4 max-w-xl text-lg text-tinta-suave">{contacto.contenido}</p>
              )}
            </div>
            <a href={url} target="_blank" rel="noopener" className="btn-fuego">
              <MessageCircle size={20} /> {contacto.texto_boton ?? "Escribir por WhatsApp"}
            </a>
            {config.telefono && (
              <p className="font-title text-lg font-bold uppercase tracking-wide text-tinta">
                WhatsApp · {config.telefono}
              </p>
            )}
            <SocialIcons config={config} />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
