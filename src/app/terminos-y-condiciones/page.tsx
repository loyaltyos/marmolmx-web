import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de compra y contratación de MarmolMX.",
};

export default function Page() {
  return (
    <LegalPage
      eyebrow="Información legal"
      title="Términos y condiciones"
      description="Conoce las condiciones generales aplicables a cotizaciones, compras de materiales y contratación de servicios con MarmolMX."
      sections={[
        {
          title: "Identidad del comercio",
          paragraphs: [
            "MarmolMX ofrece proyectos, construcción, remodelación, suministro e instalación de materiales y acabados premium. Las solicitudes realizadas en este sitio están sujetas a validación de alcance, disponibilidad y cobertura.",
          ],
        },
        {
          title: "Precios y cotizaciones",
          items: [
            "Los precios publicados se muestran en pesos mexicanos e incluyen únicamente los conceptos indicados en cada producto.",
            "La cotización final puede variar según medidas, selección de material, instalación, traslados y condiciones particulares de la obra.",
            "Una orden se considera confirmada cuando el pago es aprobado y MarmolMX valida disponibilidad y alcance.",
          ],
        },
        {
          title: "Pagos",
          paragraphs: [
            "Los pagos con tarjeta son procesados por OpenPay. MarmolMX no almacena números de tarjeta, códigos CVV ni datos bancarios sensibles.",
          ],
        },
        {
          title: "Responsabilidad del cliente",
          items: [
            "Proporcionar datos de contacto y entrega correctos.",
            "Revisar medidas, especificaciones y condiciones de la cotización antes de autorizar el proyecto.",
            "Facilitar acceso seguro al sitio cuando el servicio incluya instalación o ejecución de obra.",
          ],
        },
      ]}
    />
  );
}
