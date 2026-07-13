import type { Metadata } from "next";
import { CheckoutForm } from "@/components/public/checkout-form";
import { getMetodosPago, getMetodosEntrega, getConfiguracion } from "@/lib/datos";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default async function CheckoutPage() {
  const [metodosPago, metodosEntrega, config] = await Promise.all([
    getMetodosPago(),
    getMetodosEntrega(),
    getConfiguracion(),
  ]);

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="mb-6 font-title text-3xl font-extrabold uppercase text-tinta sm:text-4xl">Finalizar pedido</h1>
      <CheckoutForm
        metodosPago={metodosPago}
        metodosEntrega={metodosEntrega}
        whatsapp={config.whatsapp ?? "595994208200"}
      />
    </main>
  );
}
