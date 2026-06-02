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
      description="Los materiales y soluciones de MarmolMX se coordinan según ubicación, volumen, condiciones de acceso y alcance contratado."
      sections={[
        {
          title: "Cobertura",
          paragraphs: [
            "Atendemos proyectos en México. La disponibilidad, costo logístico y tiempos de entrega se confirman individualmente según la ubicación y características de cada orden.",
          ],
        },
        {
          title: "Tiempos estimados",
          items: [
            "Los materiales disponibles se programan conforme a inventario y ruta de entrega.",
            "Los productos fabricados a medida requieren validación de medidas y tiempo de producción.",
            "La fecha final se confirma por los canales de contacto proporcionados en la orden.",
          ],
        },
        {
          title: "Recepción del pedido",
          items: [
            "El cliente debe asegurar acceso adecuado y presencia de una persona autorizada.",
            "Se recomienda revisar materiales y cantidades al momento de la entrega.",
            "Las condiciones especiales de maniobra, descarga o instalación deben informarse previamente.",
          ],
        },
        {
          title: "Instalación",
          paragraphs: [
            "Cuando la orden incluya instalación, MarmolMX coordinará fecha, requisitos de obra y condiciones de acceso antes de iniciar los trabajos.",
          ],
        },
      ]}
    />
  );
}
