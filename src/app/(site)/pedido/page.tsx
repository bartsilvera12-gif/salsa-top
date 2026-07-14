"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { getSupabase } from "@/lib/supabase/browser";
import { formatGs } from "@/lib/utils";

type Pedido = {
  numero: string;
  nombre_cliente: string;
  estado: string;
  metodo_entrega: string | null;
  metodo_pago: string | null;
  subtotal: number;
  costo_envio: number;
  descuento: number;
  total: number;
};
type Item = { nombre_producto: string; descripcion_variante: string | null; cantidad: number; subtotal: number };

function PedidoInterior() {
  const sp = useSearchParams();
  const numero = sp.get("numero") ?? "";
  const [data, setData] = useState<{ pedido: Pedido; items: Item[] } | null>(null);

  useEffect(() => {
    if (!numero) return;
    // Lectura pública por número (token no adivinable) vía RPC SECURITY DEFINER.
    // Sin service_role: el cliente browser anónimo llama saltatop.obtener_pedido_publico.
    getSupabase()
      .rpc("obtener_pedido_publico", { p_numero: numero })
      .then(({ data: d }) => {
        const r = d as { pedido: Pedido; items: Item[] } | null;
        if (r && r.pedido) setData(r);
      });
  }, [numero]);

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <div className="recuadro p-8 text-center sm:p-10">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-fuego-gradient text-[#1a0e00]">
          <CheckCircle2 size={30} />
        </span>
        <h1 className="mt-5 font-title text-3xl font-extrabold uppercase text-tinta">¡Pedido recibido!</h1>
        <p className="mt-2 text-tinta-suave">
          Tu número de pedido es <strong className="text-tinta">{numero}</strong>. Te contactaremos por WhatsApp para confirmarlo.
        </p>

        {data && (
          <div className="mt-6 space-y-2 rounded-2xl border border-black/10 bg-white/60 p-5 text-left text-sm">
            {data.items.map((i, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-tinta-suave">{i.cantidad}x {i.nombre_producto}</span>
                <span className="text-tinta">{i.subtotal > 0 ? formatGs(i.subtotal) : "—"}</span>
              </div>
            ))}
            <div className="flex justify-between border-t border-black/10 pt-2">
              <span className="text-tinta-suave">Envío</span>
              <span>{data.pedido.costo_envio > 0 ? formatGs(data.pedido.costo_envio) : "Gratis"}</span>
            </div>
            <div className="flex justify-between font-title text-lg font-extrabold text-tinta">
              <span>Total</span><span>{formatGs(data.pedido.total)}</span>
            </div>
          </div>
        )}

        <Link href="/#productos" className="btn-fuego mt-7">Seguir comprando</Link>
      </div>
    </main>
  );
}

export default function PedidoPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-2xl px-6 py-20" />}>
      <PedidoInterior />
    </Suspense>
  );
}
