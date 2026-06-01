import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Aviso de privacidad",
  description: "Aviso de privacidad para clientes y usuarios de MarmolMX.",
};

export default function Page() {
  return (
    <LegalPage
      eyebrow="Protección de datos"
      title="Aviso de privacidad"
      description="MarmolMX trata los datos personales necesarios para atender solicitudes, gestionar órdenes y dar seguimiento a proyectos."
      sections={[
        {
          title: "Datos que recopilamos",
          items: [
            "Nombre, teléfono, correo electrónico y zona o dirección de entrega.",
            "Notas relacionadas con medidas, proyecto, instalación o servicio solicitado.",
            "Información de la orden y estatus de pago. No almacenamos números de tarjeta ni códigos CVV.",
          ],
        },
        {
          title: "Finalidades",
          items: [
            "Preparar cotizaciones y atender solicitudes de información.",
            "Gestionar órdenes, pagos, entregas e instalaciones.",
            "Contactar al cliente para seguimiento operativo y aclaraciones.",
          ],
        },
        {
          title: "Procesamiento de pagos",
          paragraphs: [
            "Los datos bancarios se tokenizan directamente con OpenPay. MarmolMX recibe únicamente referencias técnicas necesarias para asociar el resultado del pago con la orden.",
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
