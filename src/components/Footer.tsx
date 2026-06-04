import Image from "next/image";
import {
  BUSINESS_LOCATION,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SALES_EMAIL,
} from "@/config/site";

const quickLinks = [
  ["Inicio", "#inicio"],
  ["Quiénes Somos", "#quienes-somos"],
  ["Productos", "#productos"],
  ["Proyectos", "#proyectos"],
  ["Contacto", "#contacto"],
];

const footerServices = [
  "Construcción Integral",
  "Remodelaciones",
  "Acabados Premium",
  "Proyectos Personalizados",
];

const legalLinks = [
  ["Términos y condiciones", "/terminos-y-condiciones"],
  ["Aviso de privacidad", "/aviso-de-privacidad"],
  ["Devoluciones y cancelaciones", "/politica-de-devoluciones"],
  ["Envíos y entregas", "/envios-y-entregas"],
];

export function Footer() {
  return (
    <footer className="bg-[#1F2933] text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div>
          <div className="flex h-24 w-52 items-center justify-center overflow-hidden rounded bg-white shadow-sm">
            <Image
              src="/images/logo-marmolmx.png"
              alt="MarmolMX - Proyectos, Construcciones y Remodelaciones"
              width={1280}
              height={678}
              className="h-auto w-full scale-[1.28] object-contain"
            />
          </div>
          <p className="mt-4 leading-7 text-white/70">
            Proyectos, construcciones y remodelaciones con enfoque profesional,
            materiales seleccionados y acabados premium.
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Enlaces rápidos</h3>
          <div className="mt-4 grid gap-3">
            {quickLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-white/70 transition hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Servicios</h3>
          <div className="mt-4 grid gap-3 text-white/70">
            {footerServices.map((service) => (
              <span key={service}>{service}</span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Contacto</h3>
          <div className="mt-4 grid gap-3 text-white/70">
            <span>{CONTACT_PHONE}</span>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="transition hover:text-white"
            >
              {CONTACT_EMAIL}
            </a>
            <a
              href={`mailto:${SALES_EMAIL}`}
              className="transition hover:text-white"
            >
              {SALES_EMAIL}
            </a>
            <span>{BUSINESS_LOCATION}</span>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Información legal</h3>
          <div className="mt-4 grid gap-3">
            {legalLinks.map(([label, href]) => (
              <a
                key={href}
                href={href}
                className="text-white/70 transition hover:text-white"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-6 text-center text-sm text-white/60">
        © {new Date().getFullYear()} MarmolMX - Avenida Santa Fe 596, PB 5, Lomas de Santa Fe, 01219, CDMX. Todos los derechos reservados.
      </div>
    </footer>
  );
}
