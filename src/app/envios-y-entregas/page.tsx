import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "Envíos y entregas",
  description: "Información sobre envíos, entregas e instalaciones de MarmolMX.",
  alternates: {
    canonical: `${SITE_URL}/envios-y-entregas`,
  },
};

export default function Page() {
  return (
    <LegalPage
      eyebrow="Logística"
      title="Envíos y entregas"
      description="La entrega de maquinaria, materiales y proyectos de MarmolMX se coordina según ubicación, peso, volumen, maniobras, condiciones de acceso y alcance contratado."
      sections={[
        {
          title: "Cobertura",
          paragraphs: [
            "Atendemos solicitudes en México. La disponibilidad, costo logístico y tiempos de entrega se confirman individualmente según ubicación, características del producto, volumen, peso, maquinaria requerida y condiciones de cada orden.",
            "Los costos de entrega, maniobra e instalación se cotizan de acuerdo con la zona de entrega, dimensiones del producto, peso, accesibilidad del domicilio y alcance del proyecto.",
            "El costo de envío no siempre está incluido en el precio del producto. Cada entrega se cotiza de forma previa y transparente cuando requiere flete, maniobra, embalaje, traslado especializado o coordinación foránea.",
            "Cuando una orden sea pagada con tarjeta, la transacción se procesa mediante Openpay; la programación de entrega se confirma conforme al estatus de pago, disponibilidad y validación logística.",
          ],
        },
        {
          title: "Costos de envío orientativos",
          paragraphs: [
            "La siguiente tabla es informativa. La cotización final se confirma antes de programar la entrega y puede variar por dimensiones, peso, accesos, horario, maniobra, instalación o distancia.",
          ],
          rows: [
            {
              label: "Álvaro Obregón y zonas cercanas CDMX",
              value: "cotización según producto y medidas.",
            },
            {
              label: "CDMX y Área Metropolitana",
              value: "cotización según distancia, peso y maniobra.",
            },
            {
              label: "Envíos foráneos",
              value: "cotización previa por proyecto.",
            },
          ],
        },
        {
          title: "Tiempos estimados",
          items: [
            "Los materiales disponibles se programan conforme a inventario y ruta de entrega.",
            "La maquinaria, piezas de gran formato y productos fabricados a medida requieren validación de medidas, maniobras y tiempo de producción o preparación.",
            "La fecha final se confirma por los canales de contacto proporcionados en la orden.",
          ],
        },
        {
          title: "Recepción del pedido",
          items: [
            "El cliente debe asegurar acceso adecuado y presencia de una persona autorizada.",
            "Se recomienda revisar materiales y cantidades al momento de la entrega.",
            "Las condiciones especiales de maniobra, descarga o instalación deben informarse previamente.",
            "En proyectos de construcción o remodelación, el cliente debe confirmar que el área esté disponible y en condiciones seguras para recibir materiales, maquinaria o personal técnico.",
          ],
        },
        {
          title: "Instalación",
          paragraphs: [
            "Cuando la orden incluya instalación, MarmolMX coordinará fecha, requisitos de obra y condiciones de acceso antes de iniciar los trabajos.",
            "Para dudas logísticas puedes comunicarte al +52 55 7332 8442, info@marmolmx.com.mx o ventas@marmolmx.com.mx.",
          ],
        },
      ]}
    />
  );
}
