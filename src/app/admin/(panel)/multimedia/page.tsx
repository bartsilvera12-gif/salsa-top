"use client";

import { archivosRepo } from "@/lib/repositorios/archivos";
import { useListado } from "@/components/admin/lista-ui";
import { MultimediaManager } from "@/components/admin/multimedia-manager";

export default function MultimediaPage() {
  const { datos, recargar } = useListado(() => archivosRepo.listar(), []);
  const archivos = datos ?? [];

  return (
    <div className="space-y-5">
      <p className="text-sm text-tinta-tenue">Biblioteca de imágenes reutilizables. Copiá la URL para usarla donde quieras.</p>
      <MultimediaManager archivos={archivos} recargar={recargar} />
    </div>
  );
}
