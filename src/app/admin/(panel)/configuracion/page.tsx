"use client";

import { useEffect, useState } from "react";
import { configuracionRepo, type Configuracion } from "@/lib/repositorios/configuracion";
import { ConfiguracionForm } from "@/components/admin/configuracion-form";

export default function ConfiguracionPage() {
  const [config, setConfig] = useState<Configuracion | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    configuracionRepo.obtener().then((c) => {
      setConfig(c);
      setCargando(false);
    });
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <p className="mb-5 text-sm text-tinta-tenue">
        Estos datos alimentan la web pública (marca, contacto, redes, envíos).
      </p>
      {cargando ? (
        <p className="py-10 text-center text-tinta-tenue">Cargando…</p>
      ) : (
        <ConfiguracionForm config={config} />
      )}
    </div>
  );
}
