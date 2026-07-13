const CLASES: Record<string, string> = {
  pendiente: "bg-fuego-amarillo/30 text-acento",
  confirmado: "bg-petroleo/10 text-petroleo",
  preparando: "bg-fuego-naranja/15 text-fuego-naranja",
  listo: "bg-fuego-naranja/15 text-fuego-naranja",
  enviado: "bg-petroleo/10 text-petroleo",
  entregado: "bg-petroleo/15 text-petroleo",
  cancelado: "bg-fuego-rojo/10 text-fuego-rojo",
  pagado: "bg-petroleo/15 text-petroleo",
  rechazado: "bg-fuego-rojo/10 text-fuego-rojo",
  reembolsado: "bg-black/10 text-tinta-tenue",
};

export function EstadoBadge({ estado }: { estado: string }) {
  const cls = CLASES[estado] ?? "bg-black/10 text-tinta-tenue";
  return (
    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${cls}`}>
      {estado}
    </span>
  );
}
