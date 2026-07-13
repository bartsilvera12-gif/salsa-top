import { Hammer } from "lucide-react";

export function PlaceholderModulo({
  titulo,
  descripcion,
}: {
  titulo: string;
  descripcion?: string;
}) {
  return (
    <div className="recuadro flex flex-col items-center justify-center gap-4 px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-fuego-gradient text-[#1a0e00]">
        <Hammer size={26} />
      </span>
      <div>
        <h2 className="font-title text-2xl font-extrabold uppercase text-tinta">{titulo}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-tinta-tenue">
          {descripcion ?? "Este módulo se implementa en las próximas fases del panel."}
        </p>
      </div>
    </div>
  );
}
