import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "Devoluciones y cancelaciones",
  description: "Política de devoluciones y cancelaciones de MarmolMX.",
  alternates: {
    canonical: `${SITE_URL}/politica-de-devoluciones`,
  },
};

export default function Page() {
  return (
    <LegalPage
      eyebrow="Compras y proyectos"
      title="Devoluciones y cancelaciones"
      description="Consulta las condiciones aplicables a cancelaciones, devoluciones y reportes relacionados con maquinaria, materiales, construcción, remodelaciones y servicios contratados."
      sections={[
        {
          title: "Contacto para solicitudes",
          paragraphs: [
            "Toda solicitud debe enviarse con número de orden, evidencia y datos de contacto al +52 55 7332 8442, info@marmolmx.com.mx o ventas@marmolmx.com.mx. La dirección fiscal del comercio se ubica en Álvaro Obregón, Ciudad de México.",
          ],
        },
        {
          title: "Materiales y productos estándar",
          paragraphs: [
            "Las solicitudes de devolución de materiales estándar deben reportarse dentro de los primeros 5 días naturales posteriores a la entrega. El producto debe conservarse sin uso, sin instalación, sin transformación y en condiciones aptas para revisión.",
          ],
        },
        {
          title: "Maquinaria y equipos",
          paragraphs: [
            "La devolución o cancelación de maquinaria y equipos se revisa caso por caso, considerando disponibilidad, traslado, maniobra, uso, empaque, condiciones del fabricante y gastos logísticos incurridos.",
          ],
        },
        {
          title: "Productos personalizados",
          paragraphs: [
            "Las piezas fabricadas a medida, cortes especiales, materiales transformados o productos solicitados expresamente para un proyecto no admiten devolución una vez iniciada su fabricación, salvo defecto comprobable.",
          ],
        },
        {
          title: "Daños o incidencias",
          items: [
            "Reporta cualquier incidencia con fotografías y número de orden.",
            "MarmolMX revisará el caso y confirmará si corresponde reemplazo, ajuste o devolución.",
            "Los tiempos de resolución dependen del tipo de material y alcance del proyecto.",
          ],
        },
        {
          title: "Cancelaciones de proyectos",
          paragraphs: [
            "Las cancelaciones de construcción, remodelación, instalación o suministro se revisan según el avance de compra, fabricación, traslado, logística, contratación de personal, preparación de maquinaria o ejecución de obra. Los conceptos ya ejecutados o comprometidos pueden no ser reembolsables.",
            "Cuando el pago haya sido procesado por Openpay y proceda un reembolso, MarmolMX gestionará la devolución conforme a los tiempos operativos de la pasarela de pagos y de la institución bancaria emisora.",
          ],
        },
      ]}
    />
  );
}
