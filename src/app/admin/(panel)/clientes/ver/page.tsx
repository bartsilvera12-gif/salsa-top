"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { clientesRepo, type ClienteDetalle } from "@/lib/repositorios/clientes";
import { formatGs } from "@/lib/utils";
import { EstadoBadge } from "@/components/admin/estado-badge";
import { NotaInterna } from "@/components/admin/nota-interna";
import { alternarActivoCliente, guardarNotaCliente } from "../acciones-cliente";
import { useToast } from "@/components/admin/toast";

function ClienteDetalleInterior() {
  const sp = useSearchParams();
  const id = sp.get("id");
  const toast = useToast();

  const [c, setC] = useState<ClienteDetalle | null>(null);
  const [estado, setEstado] = useState<"cargando" | "ok" | "nohay">("cargando");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!id) {
      setEstado("nohay");
      return;
    }
    let vivo = true;
    setEstado("cargando");
    clientesRepo.obtenerDetalle(id).then((d) => {
      if (!vivo) return;
      if (!d) setEstado("nohay");
      else {
        setC(d);
        setEstado("ok");
      }
    });
    return () => {
      vivo = false;
    };
  }, [id, tick]);

  if (estado === "cargando") {
    return <p className="py-10 text-center text-tinta-tenue">Cargando…</p>;
  }
  if (estado === "nohay" || !c || !id) {
    return (
      <div className="recuadro p-10 text-center">
        <p className="text-tinta-suave">Cliente no encontrado.</p>
        <Link href="/admin/clientes/" className="btn-fuego mt-4">Volver a clientes</Link>
      </div>
    );
  }

  const ultima = c.pedidos[0]?.creado_en;

  async function onAlternar() {
    const r = await alternarActivoCliente(id!, !c!.activo);
    if ("error" in r) toast.error(r.error);
    else {
      toast.exito(c!.activo ? "Cliente desactivado" : "Cliente activado");
      setTick((t) => t + 1);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-title text-2xl font-extrabold uppercase text-tinta">{c.nombre} {c.apellido ?? ""}</h2>
        <button type="button" onClick={onAlternar} className="btn-contorno px-4 py-2 text-sm">{c.activo ? "Desactivar" : "Activar"}</button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-5">
          <div className="recuadro p-5 text-sm">
            <h3 className="mb-3 font-title text-sm font-bold uppercase tracking-widest text-acento">Contacto</h3>
            <p className="text-tinta-suave">{c.telefono}</p>
            {c.email && <p className="text-tinta-suave">{c.email}</p>}
            {c.documento && <p className="text-tinta-tenue">Doc: {c.documento}</p>}
            {(c.direccion || c.ciudad) && (
              <>
                <h3 className="mb-1 mt-4 font-title text-sm font-bold uppercase tracking-widest text-acento">Dirección</h3>
                {c.direccion && <p className="text-tinta-suave">{c.direccion}</p>}
                <p className="text-tinta-suave">{[c.barrio, c.ciudad].filter(Boolean).join(", ")}</p>
              </>
            )}
          </div>
          <div className="recuadro p-5">
            <div className="flex justify-between text-sm"><span className="text-tinta-suave">Total comprado</span><span className="font-title text-lg font-extrabold text-tinta">{formatGs(c.totalComprado)}</span></div>
            <div className="mt-1 flex justify-between text-sm"><span className="text-tinta-suave">Pedidos</span><span className="text-tinta">{c.pedidos.length}</span></div>
            {ultima && <div className="mt-1 flex justify-between text-sm"><span className="text-tinta-suave">Última compra</span><span className="text-tinta">{new Date(ultima).toLocaleDateString("es-PY")}</span></div>}
          </div>
          <div className="recuadro p-5">
            <h3 className="mb-3 font-title text-sm font-bold uppercase tracking-widest text-acento">Notas internas</h3>
            <NotaInterna valorInicial={c.notas ?? ""} guardar={(nota) => guardarNotaCliente(id, nota)} />
          </div>
        </aside>

        <div className="recuadro overflow-hidden p-0">
          <div className="border-b border-black/10 px-4 py-3 font-title text-sm font-bold uppercase tracking-widest text-acento">Pedidos</div>
          <table className="w-full text-sm">
            <thead className="border-b border-black/10 bg-crema-suave text-left text-xs uppercase tracking-wide text-tinta-tenue">
              <tr><th className="px-4 py-3">Número</th><th className="px-4 py-3">Estado</th><th className="px-4 py-3">Total</th><th className="px-4 py-3">Fecha</th></tr>
            </thead>
            <tbody>
              {c.pedidos.length === 0 && <tr><td colSpan={4} className="px-4 py-8 text-center text-tinta-tenue">Sin pedidos.</td></tr>}
              {c.pedidos.map((p) => (
                <tr key={p.id} className="border-b border-black/5 last:border-0">
                  <td className="px-4 py-3"><Link href={`/admin/pedidos/ver/?id=${p.id}`} className="font-semibold text-acento hover:underline">{p.numero}</Link></td>
                  <td className="px-4 py-3"><EstadoBadge estado={p.estado} /></td>
                  <td className="px-4 py-3 font-semibold text-tinta">{formatGs(p.total)}</td>
                  <td className="px-4 py-3 text-tinta-suave">{new Date(p.creado_en).toLocaleDateString("es-PY")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ClienteVerPage() {
  return (
    <Suspense fallback={<p className="py-10 text-center text-tinta-tenue">Cargando…</p>}>
      <ClienteDetalleInterior />
    </Suspense>
  );
}
