"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

/** Tarjeta con resplandor de fuego que sigue al cursor. */
export function GlowCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${e.clientX - r.left}px`);
    el.style.setProperty("--gy", `${e.clientY - r.top}px`);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn("group/glow relative overflow-hidden", className)}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover/glow:opacity-100"
        style={{
          background:
            "radial-gradient(240px circle at var(--gx,50%) var(--gy,50%), rgba(255,130,0,.22), transparent 60%)",
        }}
      />
      {children}
    </div>
  );
}
