"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tags, ShoppingCart, Users, Image as ImageIcon,
  FileText, Sparkles, MessageSquareQuote, ChefHat, Ticket, Images, Settings,
  ShieldCheck, ScrollText, Menu, X, LogOut, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { cerrarSesion } from "@/app/admin/actions";
import type { ItemMenu } from "@/lib/permisos";
import { ROL_LABEL, type Rol } from "@/lib/permisos";

const ICONOS: Record<string, LucideIcon> = {
  LayoutDashboard, Package, Tags, ShoppingCart, Users, Image: ImageIcon,
  FileText, Sparkles, MessageSquareQuote, ChefHat, Ticket, Images, Settings,
  ShieldCheck, ScrollText,
};

type Props = {
  items: ItemMenu[];
  perfil: { nombre: string; apellido: string | null; email: string; rol: Rol };
  children: React.ReactNode;
};

export function AdminShell({ items, perfil, children }: Props) {
  const pathname = usePathname();
  const [abierto, setAbierto] = useState(false);

  const activo = items.find(
    (i) => pathname === i.href || (i.href !== "/admin" && pathname.startsWith(i.href)),
  );

  const nav = (
    <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-3 py-4">
      {items.map((i) => {
        const Icono = ICONOS[i.icono] ?? LayoutDashboard;
        const isActive = pathname === i.href || (i.href !== "/admin" && pathname.startsWith(i.href));
        return (
          <Link
            key={i.key}
            href={i.href}
            onClick={() => setAbierto(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition",
              isActive
                ? "bg-fuego-gradient text-[#1a0e00]"
                : "text-crema/80 hover:bg-white/10 hover:text-white",
            )}
          >
            <Icono size={18} strokeWidth={2.2} />
            {i.label}
          </Link>
        );
      })}
    </nav>
  );

  const sidebarInterior = (
    <>
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="inline-flex items-center rounded-xl bg-white px-3 py-2">
          <Image src="/logo-icono.png" alt="Salsa Top" width={28} height={28} />
        </span>
        <div className="leading-tight">
          <p className="font-title text-lg font-extrabold uppercase text-white">Salsa Top</p>
          <p className="text-[11px] uppercase tracking-widest text-fuego-amarillo">Panel</p>
        </div>
      </div>
      {nav}
      <div className="border-t border-white/10 px-4 py-4">
        <p className="truncate text-sm font-semibold text-white">
          {perfil.nombre} {perfil.apellido ?? ""}
        </p>
        <p className="truncate text-xs text-crema/60">{ROL_LABEL[perfil.rol]}</p>
        <form action={cerrarSesion} className="mt-3">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            <LogOut size={16} /> Cerrar sesión
          </button>
        </form>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-crema-suave lg:grid lg:grid-cols-[264px_1fr]">
      {/* Sidebar fijo (desktop) */}
      <aside className="sticky top-0 hidden h-screen flex-col bg-petroleo lg:flex">
        {sidebarInterior}
      </aside>

      {/* Sidebar móvil */}
      {abierto && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAbierto(false)} />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-petroleo">
            {sidebarInterior}
          </aside>
        </div>
      )}

      <div className="flex min-h-screen flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-black/10 bg-crema/90 px-4 py-3 backdrop-blur lg:px-8">
          <button
            type="button"
            onClick={() => setAbierto(true)}
            className="rounded-lg p-2 text-tinta hover:bg-black/5 lg:hidden"
            aria-label="Abrir menú"
          >
            <Menu size={22} />
          </button>
          <h1 className="font-title text-xl font-extrabold uppercase text-tinta">
            {activo?.label ?? "Panel"}
          </h1>
          <div className="ml-auto flex items-center gap-2">
            <span className="hidden text-sm font-medium text-tinta-tenue sm:inline">
              {perfil.email}
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-fuego-gradient text-sm font-extrabold text-[#1a0e00]">
              {perfil.nombre.charAt(0).toUpperCase()}
            </span>
          </div>
        </header>

        {abierto && (
          <button
            type="button"
            aria-label="Cerrar menú"
            onClick={() => setAbierto(false)}
            className="sr-only"
          >
            <X />
          </button>
        )}

        <main className="flex-1 px-4 py-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
