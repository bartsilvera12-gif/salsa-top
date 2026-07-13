import { ChiliBackground } from "@/components/public/chili-background";
import { SiteHeader } from "@/components/public/site-header";
import { SiteFooter } from "@/components/public/site-footer";
import { getConfiguracion } from "@/lib/datos";
import { waLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const config = await getConfiguracion();
  const wa = waLink(config.whatsapp, "Hola Salsa Top, quiero más información.");

  return (
    <>
      <ChiliBackground />
      <SiteHeader whatsappUrl={wa} />
      <div className="min-h-screen">{children}</div>
      <SiteFooter config={config} />
    </>
  );
}
