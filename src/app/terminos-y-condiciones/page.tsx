import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { SITE_URL } from "@/config/site";

export const metadata: Metadata = {
  title: "Términos y condiciones",
  description: "Términos y condiciones de compra y contratación de MarmolMX.",
  alternates: {
    canonical: `${SITE_URL}/terminos-y-condiciones`,
  },
};

export default function Page() {
  return (
    <LegalPage
      eyebrow="Información legal"
      title="Términos y condiciones"
      description="Condiciones aplicables a compras de maquinaria, materiales, proyectos de construcción y remodelaciones contratadas con MarmolMX."
      sections={[
        {
          title: "Identidad del comercio",
          paragraphs: [
            "MarmolMX ofrece venta de maquinaria, materiales, proyectos de construcción, remodelaciones, suministro e instalación de acabados premium. La dirección fiscal del comercio se ubica en Álvaro Obregón, Ciudad de México.",
            "Para atención comercial puedes comunicarte al +52 55 7332 8442 o escribir a info@marmolmx.com.mx y ventas@marmolmx.com.mx.",
          ],
        },
        {
          title: "Productos, servicios y cotizaciones",
          items: [
            "Los precios publicados se muestran en pesos mexicanos y corresponden únicamente a los conceptos indicados en cada producto o servicio.",
            "La cotización final puede variar por medidas, selección de material, maquinaria requerida, instalación, traslados, maniobras y condiciones particulares de obra.",
            "Las órdenes de maquinaria, materiales, construcción o remodelación quedan sujetas a disponibilidad, validación técnica, cobertura y confirmación de alcance.",
            "Una orden se considera confirmada cuando el pago es aprobado y MarmolMX valida disponibilidad, especificaciones y condiciones de entrega o ejecución.",
          ],
        },
        {
          title: "Pasarela de pagos",
          paragraphs: [
            "Las transacciones serán efectuadas mediante la pasarela de Openpay.",
            "Los pagos con tarjeta son procesados por Openpay mediante tokenización y controles antifraude. MarmolMX no almacena números de tarjeta, códigos CVV ni datos bancarios sensibles.",
          ],
        },
        {
          title: "Ejecución de proyectos",
          items: [
            "Los proyectos de construcción y remodelación requieren levantamiento, revisión de medidas, autorización de presupuesto y calendario de trabajo.",
            "Los cambios solicitados por el cliente después de autorizar una cotización pueden generar ajustes de precio, materiales, maquinaria, tiempos de entrega o programa de obra.",
            "Las condiciones del inmueble, accesos, permisos, instalaciones existentes y seguridad del sitio pueden modificar el alcance o tiempos previstos.",
          ],
        },
        {
          title: "Responsabilidad del cliente",
          items: [
            "Proporcionar datos de contacto y entrega correctos.",
            "Revisar medidas, especificaciones, fichas técnicas, alcances y condiciones de la cotización antes de autorizar la compra o proyecto.",
            "Facilitar acceso seguro al sitio cuando el servicio incluya instalación o ejecución de obra.",
            "Informar restricciones de acceso, horarios, elevadores, permisos vecinales o cualquier condición que afecte entrega, maniobra o instalación.",
          ],
        },
      ]}
    />
  );
}
