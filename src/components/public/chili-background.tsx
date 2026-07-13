"use client";

import { useEffect, useRef } from "react";

/**
 * Fondo fijo de chiles con parallax al hacer scroll (réplica del sitio original).
 */
export function ChiliBackground() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const y = window.scrollY || window.pageYOffset || 0;
        el.style.backgroundPosition = `center ${Math.round(y * -0.4)}px`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-crema bg-[url('/fondo-beneficios.jpg')] bg-[length:100%_auto] bg-repeat-y"
      style={{ backgroundPosition: "center 0px", willChange: "background-position" }}
    />
  );
}
