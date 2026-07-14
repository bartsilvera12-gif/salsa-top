"use client";

import { useState } from "react";

export function NotaInterna({
  valorInicial,
  guardar,
  placeholder = "Notas internas (no visibles para el cliente)…",
}: {
  valorInicial: string;
  guardar: (nota: string) => Promise<{ ok: true } | { error: string }>;
  placeholder?: string;
}) {
  const [valor, setValor] = useState(valorInicial);
  const [estado, setEstado] = useState<"idle" | "guardando" | "ok">("idle");

  async function onGuardar() {
    setEstado("guardando");
    await guardar(valor);
    setEstado("ok");
    setTimeout(() => setEstado("idle"), 1500);
  }

  return (
    <div>
      <textarea
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        placeholder={placeholder}
        className="min-h-24 w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm outline-none focus:border-fuego-naranja focus:ring-2 focus:ring-fuego-naranja/25"
      />
      <button type="button" onClick={onGuardar} disabled={estado === "guardando"} className="btn-contorno mt-2 px-4 py-2 text-sm disabled:opacity-60">
        {estado === "guardando" ? "Guardando…" : estado === "ok" ? "Guardado ✓" : "Guardar nota"}
      </button>
    </div>
  );
}
