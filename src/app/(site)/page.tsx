import { Hero } from "@/components/public/hero";
import { NosotrosSection } from "@/components/public/nosotros-section";
import { ProductosSection } from "@/components/public/productos-section";
import { BeneficiosSection } from "@/components/public/beneficios-section";
import { ProcesoSection } from "@/components/public/proceso-section";
import { PropuestaSection } from "@/components/public/propuesta-section";
import { DistribuidoresSection, ContactoSection } from "@/components/public/contacto-section";
import { getConfiguracion, getSecciones, getProductos, getBeneficios } from "@/lib/datos";

// Home pública: ISR: se sirve estática desde caché y se regenera cada 5 min.
export const revalidate = 300;

export default async function Home() {
  const [config, secciones, productos, beneficios] = await Promise.all([
    getConfiguracion(),
    getSecciones(),
    getProductos(),
    getBeneficios(),
  ]);

  return (
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
  );
}
