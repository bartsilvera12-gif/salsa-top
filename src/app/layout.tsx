import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import { CarritoProvider } from "@/lib/carrito";
import { SpotlightTracker } from "@/components/spotlight-tracker";

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-barlow",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://salsatop.com.py";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Salsa Top — Salsas artesanales gourmet del Paraguay",
    template: "%s · Salsa Top",
  },
  description:
    "Salsas picantes, agridulces y untables elaboradas de forma artesanal, con ingredientes naturales de nuestra propia finca. Sabor auténtico, sin colorantes ni esencias artificiales.",
  icons: {
    icon: "/logo-icono.png",
  },
  openGraph: {
    type: "website",
    locale: "es_PY",
    siteName: "Salsa Top",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${barlow.variable} ${barlowCondensed.variable}`}>
      <body>
        <SpotlightTracker />
        <CarritoProvider>{children}</CarritoProvider>
      </body>
    </html>
  );
}
