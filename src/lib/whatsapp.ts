/** Construye un enlace de WhatsApp (wa.me) con mensaje opcional. */
export function waLink(numero: string | null | undefined, mensaje?: string): string {
  const n = (numero ?? "595993605100").replace(/\D/g, "");
  const base = `https://wa.me/${n}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}
