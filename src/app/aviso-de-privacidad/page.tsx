import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Aviso de privacidad para clientes y usuarios de MarmolMX.",
  alternates: {
    canonical: `${SITE_URL}/aviso-de-privacidad`,
  },
};

export default function Page() {
  return (
    <LegalPage
      eyebrow="Protección de datos"
      title="Aviso de privacidad"
      description="MarmolMX trata los datos personales necesarios para atender solicitudes, gestionar órdenes, coordinar entregas y dar seguimiento a proyectos."
      sections={[
        {
          title: "Responsable y contacto",
          paragraphs: [
            "MarmolMX, con dirección fiscal en Álvaro Obregón, Ciudad de México, es responsable del tratamiento de los datos personales recabados a través de este sitio.",
            "Puedes contactarnos al +52 55 7332 8442, en info@marmolmx.com.mx o en ventas@marmolmx.com.mx para dudas sobre este aviso o sobre el uso de tus datos.",
          ],
        },
        {
          title: "Datos que recopilamos",
          items: [
            "Nombre, teléfono, correo electrónico y zona o dirección de entrega.",
            "Notas relacionadas con medidas, maquinaria, materiales, proyecto de construcción, remodelación, instalación o servicio solicitado.",
            "Información de la orden, cotización, estatus de pago, entrega, instalación y seguimiento operativo.",
            "No almacenamos números de tarjeta, códigos CVV ni fechas de expiración.",
          ],
        },
        {
          title: "Finalidades",
          items: [
            "Preparar cotizaciones de maquinaria, materiales, construcción, remodelación, instalación y acabados.",
            "Gestionar órdenes, pagos, facturación, entregas, maniobras, instalaciones y seguimiento de proyecto.",
            "Contactar al cliente para seguimiento operativo y aclaraciones.",
            "Validar disponibilidad, cobertura, tiempos de entrega, condiciones de obra y requisitos técnicos.",
          ],
        },
        {
          title: "Procesamiento de pagos",
          paragraphs: [
            "Los datos bancarios se tokenizan directamente con Openpay. MarmolMX recibe únicamente referencias técnicas necesarias para asociar el resultado del pago con la orden.",
            "Openpay actúa como pasarela de pagos y puede tratar información técnica antifraude, incluyendo device_session_id, de acuerdo con sus propios controles de seguridad.",
          ],
        },
        {
          title: "Transferencias y conservación",
          paragraphs: [
            "Los datos pueden compartirse con proveedores logísticos, instaladores, personal técnico, entidades de pago, autoridades competentes o aliados necesarios para cumplir la relación comercial.",
            "Conservamos la información durante el tiempo necesario para atender la compra, proyecto, obligaciones fiscales, aclaraciones, garantías y requerimientos legales aplicables.",
          ],
        },
        {
          title: "Derechos del titular",
          paragraphs: [
            "Puedes solicitar acceso, rectificación, cancelación u oposición respecto de tus datos personales mediante los canales de contacto publicados en este sitio.",
          ],
        },
      ]}
    />
  );
}
