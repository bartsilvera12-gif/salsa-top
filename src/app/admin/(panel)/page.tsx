import Link from "next/link";
import { Package, PackageCheck, Tags, ShoppingCart, Clock } from "lucide-react";
import { requirePerfil } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

type Conteos = {
  productos: number;
  productosActivos: number;
  categorias: number;
  pedidosPendientes: number;
  pedidosHoy: number;
  clientes: number;
  mensajesNuevos: number;
};

async function obtenerConteos(): Promise<Conteos> {
  const vacio: Conteos = {
    productos: 0, productosActivos: 0, categorias: 0,
    pedidosPendientes: 0, pedidosHoy: 0, clientes: 0, mensajesNuevos: 0,
  };
  try {
    const supabase = await createClient();
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const iso = hoy.toISOString();

    const [
      productos, productosActivos, categorias,
      pedidosPendientes, pedidosHoy, clientes, mensajesNuevos,
    ] = await Promise.all([
      supabase.from("productos").select("*", { count: "exact", head: true }),
      supabase.from("productos").select("*", { count: "exact", head: true }).eq("activo", true),
      supabase.from("categorias").select("*", { count: "exact", head: true }),
      supabase.from("pedidos").select("*", { count: "exact", head: true }).eq("estado", "pendiente"),
      supabase.from("pedidos").select("*", { count: "exact", head: true }).gte("creado_en", iso),
      supabase.from("clientes").select("*", { count: "exact", head: true }),
      supabase.from("mensajes_contacto").select("*", { count: "exact", head: true }).eq("estado", "nuevo"),
    ]);

    return {
      productos: productos.count ?? 0,
      productosActivos: productosActivos.count ?? 0,
      categorias: categorias.count ?? 0,
      pedidosPendientes: pedidosPendientes.count ?? 0,
      pedidosHoy: pedidosHoy.count ?? 0,
      clientes: clientes.count ?? 0,
      mensajesNuevos: mensajesNuevos.count ?? 0,
    };
  } catch {
    return vacio;
  }
}

export default async function DashboardPage() {
  const perfil = await requirePerfil();
  const c = await obtenerConteos();

  const tarjetas = [
    { label: "Productos", valor: c.productos, sub: `${c.productosActivos} activos`, icono: Package, href: "/admin/productos" },
    { label: "Categorías", valor: c.categorias, sub: "en catálogo", icono: Tags, href: "/admin/categorias" },
    { label: "Pedidos pendientes", valor: c.pedidosPendientes, sub: "por confirmar", icono: ShoppingCart, href: "/admin/pedidos" },
    { label: "Pedidos de hoy", valor: c.pedidosHoy, sub: "recibidos hoy", icono: Clock, href: "/admin/pedidos" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Panel de administración</p>
        <h2 className="font-title text-3xl font-extrabold uppercase text-tinta">
          Hola, {perfil.nombre} 👋
        </h2>
        <p className="text-sm text-tinta-tenue">Resumen de tu tienda Salsa Top.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tarjetas.map((t) => {
          const Icono = t.icono;
          return (
            <Link key={t.label} href={t.href} className="recuadro group p-5 transition hover:shadow-recuadro-fuerte">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-tinta-tenue">{t.label}</p>
                  <p className="mt-1 font-title text-4xl font-extrabold text-tinta">{t.valor}</p>
                  <p className="mt-0.5 text-xs text-tinta-tenue">{t.sub}</p>
                </div>
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-fuego-gradient text-[#1a0e00]">
                  <Icono size={22} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="recuadro flex items-center gap-3 p-5">
        <PackageCheck className="text-acento" />
        <p className="text-sm text-tinta-suave">
          Los módulos de gestión (productos, pedidos, contenido, etc.) se van habilitando por fases.
          El catálogo inicial ya está cargado en la base.
        </p>
      </div>
    </div>
  );
}
