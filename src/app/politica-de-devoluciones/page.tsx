import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Política de devoluciones",
  description: "Política de devoluciones y cancelaciones de MarmolMX.",
};

export default function Page() {
  return (
    <LegalPage
      eyebrow="Compras y proyectos"
      title="Política de devoluciones"
      description="Consulta las condiciones aplicables a cancelaciones, devoluciones y reportes relacionados con materiales o servicios contratados."
      sections={[
        {
          title: "Materiales estándar",
          paragraphs: [
            "Las solicitudes de devolución de materiales estándar deben reportarse dentro de los primeros 5 días naturales posteriores a la entrega. El producto debe conservarse sin uso, sin instalación y en condiciones aptas para revisión.",
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
          title: "Cancelaciones",
          paragraphs: [
            "Las cancelaciones se revisan según el avance de compra, fabricación, traslado o ejecución. Los conceptos ya ejecutados o comprometidos pueden no ser reembolsables.",
          ],
        },
      ]}
    />
  );
}
