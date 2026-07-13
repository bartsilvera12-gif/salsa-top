import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatGs } from "@/lib/utils";

export const dynamic = "force-dynamic";

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

async function getPedido(numero: string): Promise<{ pedido: Pedido; items: Item[] } | null> {
  try {
    const supabase = createAdminClient();
    const { data: pedido } = await supabase
      .from("pedidos")
      .select("id, numero, nombre_cliente, estado, metodo_entrega, metodo_pago, subtotal, costo_envio, descuento, total")
      .eq("numero", numero)
      .maybeSingle();
    if (!pedido) return null;
    const { data: items } = await supabase
      .from("pedido_items")
      .select("nombre_producto, descripcion_variante, cantidad, subtotal")
      .eq("pedido_id", pedido.id);
    return { pedido: pedido as Pedido, items: (items as Item[]) ?? [] };
  } catch {
    return null;
  }
}

export default async function PedidoPage({ params }: { params: Promise<{ numero: string }> }) {
  const { numero } = await params;
  const data = await getPedido(numero);

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
