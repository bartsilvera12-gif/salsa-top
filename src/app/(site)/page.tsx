import { Hero } from "@/components/public/hero";
import { AcercaSection } from "@/components/public/acerca-section";
import { NosotrosSection } from "@/components/public/nosotros-section";
import { ProductosSection } from "@/components/public/productos-section";
import { BeneficiosSection } from "@/components/public/beneficios-section";
import { ProcesoSection } from "@/components/public/proceso-section";
import { NuestrosTrabajosSection } from "@/components/public/nuestros-trabajos-section";
import { ContactoSection } from "@/components/public/contacto-section";
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
      <NosotrosSection />
      <ProductosSection productos={productos} />
      <AcercaSection incluir={["Beneficios"]} />
      <BeneficiosSection beneficios={beneficios} />
      <AcercaSection incluir={["Competencia de la marca"]} />
      <ProcesoSection proceso={secciones.proceso} historia={secciones.historia} />
      <NuestrosTrabajosSection limite={4} />
      <AcercaSection incluir={["¿A quién impactamos?"]} />
      <ContactoSection config={config} contacto={secciones.contacto} />
    </main>
  );
}
