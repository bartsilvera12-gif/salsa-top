"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Tags } from "lucide-react";
import { getSupabase } from "@/lib/supabase/browser";
import { useSesion } from "@/lib/sesion";

type Conteos = {
  productos: number;
  productosActivos: number;
  categorias: number;
};

const VACIO: Conteos = { productos: 0, productosActivos: 0, categorias: 0 };

async function obtenerConteos(): Promise<Conteos> {
  try {
    const supabase = getSupabase();
    const [productos, productosActivos, categorias] = await Promise.all([
      supabase.from("productos").select("*", { count: "exact", head: true }),
      supabase.from("productos").select("*", { count: "exact", head: true }).eq("activo", true),
      supabase.from("categorias").select("*", { count: "exact", head: true }),
    ]);

    return {
      productos: productos.count ?? 0,
      productosActivos: productosActivos.count ?? 0,
      categorias: categorias.count ?? 0,
    };
  } catch {
    return VACIO;
  }
}

export default function DashboardPage() {
  const { perfil } = useSesion();
  const [c, setC] = useState<Conteos>(VACIO);

  useEffect(() => {
    obtenerConteos().then(setC);
  }, []);

  const tarjetas = [
    { label: "Productos", valor: c.productos, sub: `${c.productosActivos} activos`, icono: Package, href: "/admin/productos" },
    { label: "Categorías", valor: c.categorias, sub: "en catálogo", icono: Tags, href: "/admin/categorias" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow">Panel de administración</p>
        <h2 className="font-title text-3xl font-extrabold uppercase text-tinta">
          Hola, {perfil?.nombre} 👋
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
    </div>
  );
}
