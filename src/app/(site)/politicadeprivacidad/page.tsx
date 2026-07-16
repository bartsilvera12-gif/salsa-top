import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Reveal } from "@/components/public/reveal";
import { getConfiguracion } from "@/lib/datos";

// Página no listada: no se enlaza desde el menú y se pide a los buscadores que
// no la indexen. Se llega solo entrando a /politicadeprivacidad.
export const metadata: Metadata = {
  title: "Política de privacidad",
  description:
    "Cómo Salsa Top trata y protege los datos personales de quienes visitan el sitio o se comunican con la marca.",
  robots: { index: false, follow: false },
};

export const revalidate = 300;

const ACTUALIZADO = "16 de julio de 2026";

type Bloque = { titulo: string; parrafos: string[]; lista?: string[] };

function bloques(whatsapp: string): Bloque[] {
  return [
    {
      titulo: "1. Quiénes somos",
      parrafos: [
        "Salsa Top es una marca paraguaya dedicada a la elaboración y comercialización artesanal de salsas picantes, agridulces, untables y otros productos gastronómicos, con planta de elaboración en Santaní, Paraguay.",
        `Somos responsables del tratamiento de los datos personales que se recogen a través de este sitio web. Ante cualquier consulta sobre esta política podés escribirnos por WhatsApp al ${whatsapp}.`,
      ],
    },
    {
      titulo: "2. Qué datos recopilamos",
      parrafos: [
        "Este sitio es principalmente informativo: podés recorrerlo y conocer nuestros productos sin entregar ningún dato personal. Solo tratamos datos en estos casos:",
      ],
      lista: [
        "Datos que nos das al contactarnos: si nos escribís por WhatsApp o por nuestras redes sociales, recibimos tu número de teléfono, el nombre de tu perfil y el contenido de tu mensaje.",
        "Datos técnicos de navegación: dirección IP, tipo de dispositivo, navegador y páginas visitadas. Los genera automáticamente el servidor y se usan de forma agregada, para mantener el sitio funcionando y entender qué contenido resulta útil.",
        "Datos de acceso al panel administrativo: correo electrónico y credenciales, exclusivamente para el personal autorizado de Salsa Top. No es un área abierta al público.",
      ],
    },
    {
      titulo: "3. Qué NO recopilamos",
      parrafos: [
        "Este sitio no vende en línea ni procesa pagos: no pedimos ni almacenamos números de tarjeta, datos bancarios ni credenciales de medios de pago.",
        "Tampoco solicitamos documentos de identidad, ni recogemos datos sensibles (los que revelan salud, origen étnico, convicciones religiosas, opiniones políticas o afiliación sindical), conforme a la protección reforzada que les da la legislación paraguaya.",
      ],
    },
    {
      titulo: "4. Para qué usamos tus datos",
      parrafos: ["Tratamos los datos únicamente con estas finalidades:"],
      lista: [
        "Responder tus consultas, pedidos de información y solicitudes de distribución mayorista o minorista.",
        "Gestionar la relación comercial con comercios y puntos de venta.",
        "Mantener, asegurar y mejorar el funcionamiento del sitio.",
        "Cumplir con las obligaciones legales, contables y tributarias que nos correspondan.",
      ],
    },
    {
      titulo: "5. Base legal y consentimiento",
      parrafos: [
        "Tratamos tus datos con tu consentimiento, que se manifiesta cuando decidís contactarnos voluntariamente, y en el marco de la Ley N° 1682/2001, que reglamenta la información de carácter privado, y sus modificatorias (Leyes N° 1969/2002 y N° 6534/2020).",
        "También son aplicables el artículo 33 de la Constitución Nacional, que protege el derecho a la intimidad, la Ley N° 4868/2013 de Comercio Electrónico y la Ley N° 1334/1998 de Defensa del Consumidor y del Usuario.",
        "No publicamos ni difundimos datos personales sin autorización, ni los usamos para finalidades distintas de las informadas en esta política.",
      ],
    },
    {
      titulo: "6. Comunicaciones por WhatsApp",
      parrafos: [
        "Los botones de WhatsApp del sitio abren una conversación en la aplicación con un mensaje sugerido. Al enviarlo, la conversación queda alojada en la plataforma de WhatsApp y se rige además por las políticas de privacidad de esa empresa, ajenas a Salsa Top.",
        "Usamos esas conversaciones solo para atender tu consulta. No enviamos publicidad masiva ni cedemos tu número a terceros con fines comerciales.",
      ],
    },
    {
      titulo: "7. Cookies y tecnologías similares",
      parrafos: [
        "El sitio no utiliza cookies con fines publicitarios ni de seguimiento entre sitios. Solo se emplea almacenamiento técnico del navegador cuando es necesario para el funcionamiento, por ejemplo para mantener la sesión iniciada en el panel administrativo.",
        "Podés bloquear o eliminar el almacenamiento local desde la configuración de tu navegador; el sitio público seguirá funcionando con normalidad.",
      ],
    },
    {
      titulo: "8. Con quién compartimos los datos",
      parrafos: [
        "No vendemos, alquilamos ni comercializamos datos personales. Solo intervienen los proveedores necesarios para operar el sitio, que actúan siguiendo nuestras instrucciones:",
      ],
      lista: [
        "Proveedor de alojamiento web, que almacena el sitio y genera registros técnicos de acceso.",
        "Proveedor de base de datos y autenticación, donde se guarda el catálogo de productos y las cuentas del panel administrativo.",
        "Autoridades públicas, únicamente cuando exista una obligación legal o un requerimiento judicial válido.",
      ],
    },
    {
      titulo: "9. Conservación de los datos",
      parrafos: [
        "Conservamos los datos durante el tiempo necesario para cumplir la finalidad que motivó su recolección, y luego durante los plazos que exijan las obligaciones legales, comerciales y tributarias aplicables en Paraguay.",
        "Cuando dejan de ser necesarios, se eliminan o se anonimizan.",
      ],
    },
    {
      titulo: "10. Seguridad",
      parrafos: [
        "Aplicamos medidas técnicas y organizativas razonables para proteger los datos: conexión cifrada (HTTPS) en todo el sitio, control de acceso al panel administrativo y reglas de permisos a nivel de base de datos, de modo que cada usuario acceda solo a lo que le corresponde.",
        "Ningún sistema es completamente infalible, pero trabajamos para reducir los riesgos y revisar nuestras prácticas de forma continua.",
      ],
    },
    {
      titulo: "11. Tus derechos",
      parrafos: [
        "Podés solicitarnos en cualquier momento el acceso a tus datos personales, su actualización, rectificación o supresión, así como retirar el consentimiento que hubieras prestado.",
        "El artículo 135 de la Constitución Nacional reconoce además la garantía del hábeas data, que te permite acudir a la vía judicial para conocer los datos registrados sobre tu persona y pedir su actualización, rectificación o destrucción si fueran erróneos o afectaran ilegítimamente tus derechos.",
        `Para ejercer estos derechos, escribinos por WhatsApp al ${whatsapp} indicando tu solicitud. Podemos pedirte información adicional para verificar tu identidad antes de responder.`,
      ],
    },
    {
      titulo: "12. Menores de edad",
      parrafos: [
        "Nuestros productos y este sitio están dirigidos a personas mayores de edad. No recopilamos de forma consciente datos de menores. Si detectás que un menor nos proporcionó datos personales, escribinos y procederemos a eliminarlos.",
      ],
    },
    {
      titulo: "13. Enlaces a sitios de terceros",
      parrafos: [
        "El sitio incluye enlaces a plataformas externas, como WhatsApp y nuestras redes sociales. Una vez que salís de este sitio, la información que compartas se rige por las políticas de privacidad de esas plataformas, sobre las que no tenemos control.",
      ],
    },
    {
      titulo: "14. Cambios en esta política",
      parrafos: [
        "Podemos actualizar esta política para reflejar cambios en nuestras prácticas o en la normativa aplicable. La versión vigente es siempre la publicada en esta página, con su fecha de última actualización.",
      ],
    },
    {
      titulo: "15. Contacto",
      parrafos: [
        `Si tenés dudas sobre esta política o sobre el tratamiento de tus datos, escribinos por WhatsApp al ${whatsapp} y te respondemos a la brevedad.`,
      ],
    },
  ];
}

export default async function PoliticaDePrivacidadPage() {
  const config = await getConfiguracion();
  const whatsapp = config.telefono ?? "0993 605100";

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex justify-end">
          <Link href="/" className="btn-fuego">
            <ArrowLeft size={18} /> Volver al inicio
          </Link>
        </div>

        <Reveal className="mb-12 text-center">
          <p className="eyebrow">Salsa Top</p>
          <h1 className="mt-3 font-title text-4xl font-extrabold uppercase text-tinta sm:text-5xl">
            Política de privacidad
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-tinta-suave">
            Cómo tratamos y protegemos los datos personales de quienes visitan nuestro sitio o se
            comunican con la marca.
          </p>
          <p className="mt-3 text-sm text-tinta-tenue">Última actualización: {ACTUALIZADO}</p>
        </Reveal>

        <div className="flex flex-col gap-6">
          {bloques(whatsapp).map((b) => (
            <Reveal key={b.titulo}>
              <div className="recuadro p-8 sm:p-10">
                <h2 className="font-title text-2xl font-extrabold uppercase text-tinta sm:text-3xl">
                  {b.titulo}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-relaxed text-tinta-suave">
                  {b.parrafos.map((parrafo, i) => (
                    <p key={i}>{parrafo}</p>
                  ))}
                  {b.lista && (
                    <ul className="mt-2 space-y-2.5 pl-1">
                      {b.lista.map((item, i) => (
                        <li key={i} className="flex gap-3">
                          <span aria-hidden className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-fuego-naranja" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link href="/" className="btn-fuego">
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
