"use client";

import { useEffect } from "react";

const SELECTOR = ".recuadro, .glow-fuego, .borde-fuego, .borde-fuego-blanco";

/**
 * Efecto spotlight de fuego en el borde de los recuadros.
 *
 * En vez de coordenadas globales + `background-attachment: fixed` (que se rompe
 * cuando un ancestro tiene `transform`, como los contenedores de animación
 * `Reveal`), publica coordenadas LOCALES por elemento: `--lx`/`--ly` = posición
 * del cursor relativa a cada recuadro, y `--xp` = proporción horizontal (para el
 * tono). Recorre también los recuadros ancestros (recuadros anidados) para que
 * todos muestren el resplandor en la posición correcta.
 *
 * En dispositivos táctiles (sin puntero) no se dispara y el efecto no se muestra.
 */
export function SpotlightTracker() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const xp = (e.clientX / window.innerWidth).toFixed(3);
      const target = e.target as Element | null;
      let el = target?.closest?.(SELECTOR) as HTMLElement | null;
      while (el) {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--lx", (e.clientX - r.left).toFixed(1));
        el.style.setProperty("--ly", (e.clientY - r.top).toFixed(1));
        el.style.setProperty("--xp", xp);
        el = el.parentElement?.closest(SELECTOR) as HTMLElement | null;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
