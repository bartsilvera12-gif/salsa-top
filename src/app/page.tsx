import { ChiliBackground } from "@/components/public/chili-background";
import { SiteHeader } from "@/components/public/site-header";
import { Hero } from "@/components/public/hero";
import { NosotrosSection } from "@/components/public/nosotros-section";
import { ProductosSection } from "@/components/public/productos-section";
import { BeneficiosSection } from "@/components/public/beneficios-section";
import { ProcesoSection } from "@/components/public/proceso-section";
import { PropuestaSection } from "@/components/public/propuesta-section";
import { DistribuidoresSection, ContactoSection } from "@/components/public/contacto-section";
import { SiteFooter } from "@/components/public/site-footer";
import { getConfiguracion, getSecciones, getProductos, getBeneficios } from "@/lib/datos";
import { waLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [config, secciones, productos, beneficios] = await Promise.all([
    getConfiguracion(),
    getSecciones(),
    getProductos(),
    getBeneficios(),
  ]);

  const wa = waLink(config.whatsapp, "Hola Salsa Top, quiero más información.");

  return (
    <>
      <ChiliBackground />
      <SiteHeader whatsappUrl={wa} />
      <main>
        <Hero hero={secciones.hero} />
        <NosotrosSection historia={secciones.historia} />
        <ProductosSection productos={productos} />
        <BeneficiosSection beneficios={beneficios} />
        <ProcesoSection proceso={secciones.proceso} />
        <PropuestaSection propuesta={secciones.propuesta} />
        <DistribuidoresSection config={config} />
        <ContactoSection config={config} contacto={secciones.contacto} />
      </main>
      <SiteFooter config={config} />
    </>
  );
}
