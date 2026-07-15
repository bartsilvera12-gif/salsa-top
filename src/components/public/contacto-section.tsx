import type { Configuracion, Seccion } from "@/lib/datos";
import { waLink } from "@/lib/whatsapp";
import { WhatsappIcon } from "@/components/public/whatsapp-icon";
import { Reveal } from "@/components/public/reveal";

/** Contacto y distribución (minorista/mayorista) unificados en un solo recuadro. */
export function ContactoSection({ config, contacto }: { config: Configuracion; contacto: Seccion }) {
  const urlMinorista = waLink(
    config.whatsapp,
    "Hola Salsa Top, soy minorista y quiero vender sus productos en mi local.",
  );
  const urlMayorista = waLink(
    config.whatsapp,
    "Hola Salsa Top, soy mayorista y quiero distribuir sus productos.",
  );

  return (
    <section id="contacto" className="px-6 py-24">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <div
            id="distribuidores"
            className="recuadro flex scroll-mt-8 flex-col items-center gap-7 p-8 text-center sm:p-12"
          >
            <div>
              <p className="eyebrow">{contacto.subtitulo ?? "Contacto"}</p>
              <h2 className="mt-3 font-title text-3xl font-extrabold uppercase text-tinta sm:text-4xl">
                {contacto.titulo ?? "Hablemos de sabor"}
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-tinta-suave">
                Escribinos por WhatsApp para cualquier consulta, o sumá Salsa Top a tu local:
                trabajamos con comercios minoristas y mayoristas.
              </p>
            </div>

            {/* Distribución: elegí tu caso */}
            <div className="flex w-full flex-col items-center gap-3">
              <p className="text-sm font-semibold uppercase tracking-wide text-tinta-tenue">
                ¿Querés vender Salsa Top?
              </p>
              <div className="flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
                <a href={urlMinorista} target="_blank" rel="noopener" className="btn-fuego">
                  <WhatsappIcon /> Soy minorista
                </a>
                <a href={urlMayorista} target="_blank" rel="noopener" className="btn-fuego">
                  <WhatsappIcon /> Soy mayorista
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
