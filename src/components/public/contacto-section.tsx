import { MapPin } from "lucide-react";
import type { Configuracion, Seccion } from "@/lib/datos";
import { waLink } from "@/lib/whatsapp";
import { WhatsappIcon } from "@/components/public/whatsapp-icon";
import { Reveal } from "@/components/public/reveal";

/** Contacto y distribución (minorista/mayorista) unificados en un solo recuadro. */
export function ContactoSection({ config, contacto }: { config: Configuracion; contacto: Seccion }) {
  const urlConsulta = waLink(
    config.whatsapp,
    "Hola Salsa Top, quiero hacer una consulta.",
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

            <a href={urlConsulta} target="_blank" rel="noopener" className="btn-fuego">
              <WhatsappIcon /> Consultar ahora
            </a>

            <div className="flex items-start gap-3 border-t border-black/10 pt-6 text-left">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-acento" aria-hidden />
              <address className="not-italic text-sm leading-relaxed text-tinta-suave">
                <span className="font-semibold text-tinta">LUMA COMEX S.A.</span>
                <br />
                Ruta PY03 · Km 156
                <br />
                San Estanislao, San Pedro
                <br />
                Paraguay
              </address>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
