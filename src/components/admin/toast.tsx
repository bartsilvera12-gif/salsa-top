"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

type Tipo = "exito" | "error";
type Toast = { id: number; tipo: Tipo; texto: string };

type ToastApi = { exito: (texto: string) => void; error: (texto: string) => void };

const ToastCtx = createContext<ToastApi | null>(null);

let contador = 0;

/** Provider de notificaciones (toasts). Montar una vez en el layout del panel. */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const mostrar = useCallback((tipo: Tipo, texto: string) => {
    const id = ++contador;
    setToasts((t) => [...t, { id, tipo, texto }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const api: ToastApi = {
    exito: (texto) => mostrar("exito", texto),
    error: (texto) => mostrar("error", texto),
  };

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium shadow-recuadro-fuerte ${
              t.tipo === "exito"
                ? "border border-petroleo/30 bg-white text-petroleo"
                : "border border-fuego-rojo/30 bg-white text-fuego-rojo"
            }`}
          >
            {t.tipo === "exito" ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            {t.texto}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast debe usarse dentro de ToastProvider");
  return ctx;
}
