import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { requirePerfil } from "@/lib/auth";
import { OPERACIONES } from "@/lib/permisos";
import { getPedidoAdmin } from "@/lib/admin-datos";
import { formatGs } from "@/lib/utils";
import { waLink } from "@/lib/whatsapp";
import { EstadoBadge } from "@/components/admin/estado-badge";
import { NotaInterna } from "@/components/admin/nota-interna";
import { cambiarEstadoPedido, cambiarEstadoPago, guardarNotaInterna } from "../actions";

export const dynamic = "force-dynamic";

const FLUJO = ["confirmado", "preparando", "listo", "enviado", "entregado"];
const PAGOS = ["pendiente", "pagado", "rechazado", "reembolsado"];

export default async function PedidoDetallePage({ params }: { params: Promise<{ id: string }> }) {
  await requirePerfil(OPERACIONES);
  const { id } = await params;
  const p = await getPedidoAdmin(id);
  if (!p) notFound();

  const wa = waLink(p.telefono_cliente, `Hola ${p.nombre_cliente}, sobre tu pedido ${p.numero} en Salsa Top:`);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-title text-2xl font-extrabold uppercase text-tinta">Pedido {p.numero}</h2>
          <p className="text-sm text-tinta-tenue">{new Date(p.creado_en).toLocaleString("es-PY")}</p>
        </div>
        <div className="flex items-center gap-2">
          <EstadoBadge estado={p.estado} />
          <EstadoBadge estado={p.estado_pago} />
          <a href={wa} target="_blank" rel="noopener" className="btn-fuego px-4 py-2 text-sm"><MessageCircle size={16} /> WhatsApp</a>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          {/* Cambiar estado */}
          <div className="recuadro p-5">
            <h3 className="mb-3 font-title text-sm font-bold uppercase tracking-widest text-acento">Cambiar estado</h3>
            <div className="flex flex-wrap gap-2">
              {FLUJO.map((e) => (
                <form key={e} action={cambiarEstadoPedido.bind(null, id, e)}>
                  <button type="submit" disabled={p.estado === e}
                    className="rounded-lg border border-black/15 px-3 py-2 text-xs font-semibold capitalize text-tinta hover:bg-black/5 disabled:opacity-40">
                    {e}
                  </button>
                </form>
              ))}
              {p.estado !== "cancelado" && (
                <form action={cambiarEstadoPedido.bind(null, id, "cancelado")}>
                  <button type="submit" className="rounded-lg border border-fuego-rojo/30 px-3 py-2 text-xs font-semibold text-fuego-rojo hover:bg-fuego-rojo/10">Cancelar pedido</button>
                </form>
              )}
            </div>
            <h3 className="mb-3 mt-5 font-title text-sm font-bold uppercase tracking-widest text-acento">Pago</h3>
            <div className="flex flex-wrap gap-2">
              {PAGOS.map((e) => (
                <form key={e} action={cambiarEstadoPago.bind(null, id, e)}>
                  <button type="submit" disabled={p.estado_pago === e}
                    className="rounded-lg border border-black/15 px-3 py-2 text-xs font-semibold capitalize text-tinta hover:bg-black/5 disabled:opacity-40">
                    {e}
                  </button>
                </form>
              ))}
            </div>
          </div>

          {/* Items */}
          <div className="recuadro overflow-hidden p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-black/10 bg-crema-suave text-left text-xs uppercase tracking-wide text-tinta-tenue">
                <tr><th className="px-4 py-3">Producto</th><th className="px-4 py-3">Cant.</th><th className="px-4 py-3">Precio</th><th className="px-4 py-3 text-right">Subtotal</th></tr>
              </thead>
              <tbody>
                {p.items.map((it, i) => (
                  <tr key={i} className="border-b border-black/5 last:border-0">
                    <td className="px-4 py-3 text-tinta">{it.nombre_producto}{it.descripcion_variante ? ` · ${it.descripcion_variante}` : ""}</td>
                    <td className="px-4 py-3 text-tinta-suave">{it.cantidad}</td>
                    <td className="px-4 py-3 text-tinta-suave">{formatGs(it.precio_unitario)}</td>
                    <td className="px-4 py-3 text-right font-semibold text-tinta">{formatGs(it.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="space-y-1 border-t border-black/10 p-4 text-sm">
              <div className="flex justify-between"><span className="text-tinta-suave">Subtotal</span><span>{formatGs(p.subtotal)}</span></div>
              {p.descuento > 0 && <div className="flex justify-between"><span className="text-tinta-suave">Descuento</span><span>- {formatGs(p.descuento)}</span></div>}
              <div className="flex justify-between"><span className="text-tinta-suave">Envío</span><span>{p.costo_envio > 0 ? formatGs(p.costo_envio) : "Gratis"}</span></div>
              <div className="flex justify-between pt-1 font-title text-lg font-extrabold text-tinta"><span>Total</span><span>{formatGs(p.total)}</span></div>
            </div>
          </div>

          {/* Notas internas */}
          <div className="recuadro p-5">
            <h3 className="mb-3 font-title text-sm font-bold uppercase tracking-widest text-acento">Notas internas</h3>
            <NotaInterna valorInicial={p.observaciones_internas ?? ""} guardar={guardarNotaInterna.bind(null, id)} />
          </div>
        </div>

        {/* Panel lateral: cliente + entrega + historial */}
        <aside className="space-y-5">
          <div className="recuadro p-5 text-sm">
            <h3 className="mb-3 font-title text-sm font-bold uppercase tracking-widest text-acento">Cliente</h3>
            <p className="font-semibold text-tinta">{p.nombre_cliente}</p>
            <p className="text-tinta-suave">{p.telefono_cliente}</p>
            {p.email_cliente && <p className="text-tinta-suave">{p.email_cliente}</p>}
            <h3 className="mb-2 mt-4 font-title text-sm font-bold uppercase tracking-widest text-acento">Entrega</h3>
            <p className="text-tinta-suave">{p.metodo_entrega ?? "—"}</p>
            {p.direccion_entrega && <p className="text-tinta-suave">{p.direccion_entrega}</p>}
            {(p.ciudad || p.barrio) && <p className="text-tinta-suave">{[p.barrio, p.ciudad].filter(Boolean).join(", ")}</p>}
            {p.referencia_entrega && <p className="text-tinta-tenue">Ref: {p.referencia_entrega}</p>}
            <h3 className="mb-1 mt-4 font-title text-sm font-bold uppercase tracking-widest text-acento">Pago</h3>
            <p className="text-tinta-suave">{p.metodo_pago ?? "—"}</p>
            {p.observaciones_cliente && (
              <>
                <h3 className="mb-1 mt-4 font-title text-sm font-bold uppercase tracking-widest text-acento">Observaciones</h3>
                <p className="text-tinta-suave">{p.observaciones_cliente}</p>
              </>
            )}
          </div>

          <div className="recuadro p-5">
            <h3 className="mb-3 font-title text-sm font-bold uppercase tracking-widest text-acento">Historial</h3>
            <ul className="space-y-2 text-xs">
              {p.historial.map((h, i) => (
                <li key={i} className="flex items-center justify-between gap-2">
                  <span className="capitalize text-tinta-suave">{h.estado_anterior ? `${h.estado_anterior} → ` : ""}{h.estado_nuevo}</span>
                  <span className="text-tinta-tenue">{new Date(h.creado_en).toLocaleDateString("es-PY")}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
