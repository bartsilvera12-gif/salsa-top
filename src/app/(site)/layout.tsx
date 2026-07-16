import { ChiliBackground } from "@/components/public/chili-background";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { WhatsappFlotante } from "@/components/public/whatsapp-flotante";
import { getConfiguracion } from "@/lib/datos";
import { waLink } from "@/lib/whatsapp";

// Contenido público (header/footer): se cachea con ISR y se regenera cada 5 min.
// Antes era force-dynamic, que consultaba Supabase en cada request.
export const revalidate = 300;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const config = await getConfiguracion();
  const wa = waLink(config.whatsapp, "Hola Salsa Top, quiero más información.");

  return (
    <>
      <ChiliBackground />
      <SiteHeader whatsappUrl={wa} />
      <div className="min-h-screen">{children}</div>
      <SiteFooter config={config} />
      <WhatsappFlotante url={wa} />
    </>
  );
}
