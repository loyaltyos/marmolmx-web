import type { Metadata } from "next";
import {
  BadgeCheck,
  CreditCard,
  FileCheck2,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SALES_EMAIL,
} from "@/config/site";

export const metadata: Metadata = {
  title: "Revisión técnica OpenPay",
  description:
    "Información técnica de la integración de pagos con OpenPay en MarmolMX.",
};

const safeguards = [
  {
    icon: CreditCard,
    title: "Tokenización con OpenPay.js",
    description:
      "Los datos de tarjeta se envían directamente desde el navegador a OpenPay para generar un token de pago.",
  },
  {
    icon: ShieldCheck,
    title: "Protección antifraude",
    description:
      "El checkout genera device_session_id con OpenPay.deviceData.setup y bloquea el pago si la sesión antifraude no está disponible.",
  },
  {
    icon: LockKeyhole,
    title: "Datos bancarios protegidos",
    description:
      "MarmolMX no almacena números de tarjeta, códigos CVV ni fechas de expiración. La llave privada permanece exclusivamente en el servidor.",
  },
  {
    icon: FileCheck2,
    title: "Comunicación mínima al backend",
    description:
      "El backend recibe la referencia interna de la orden, token_id y device_session_id. No recibe datos bancarios capturados en el checkout.",
  },
];

const reviewLinks = [
  ["Productos", "/#productos"],
  ["Checkout", "/checkout"],
  ["Aviso de privacidad", "/aviso-de-privacidad"],
  ["Términos y condiciones", "/terminos-y-condiciones"],
  ["Política de devoluciones", "/politica-de-devoluciones"],
  ["Envíos y entregas", "/envios-y-entregas"],
  ["Contacto", "/#contacto"],
];

export default function Page() {
  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      <header className="border-b border-white/10 bg-[#0F2A3D]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex h-14 w-[116px] items-center justify-center rounded bg-white px-1.5 py-1 shadow-sm sm:w-[144px]"
          >
            <Image
              src="/images/logo-marmolmx.png"
              alt="MarmolMX - Proyectos, Construcciones y Remodelaciones"
              width={1280}
              height={678}
              priority
              className="h-full w-full object-contain"
            />
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-white/80 transition hover:text-white"
          >
            Volver al sitio
          </Link>
        </div>
      </header>

      <main>
        <section className="bg-[#0F2A3D] px-4 py-16 text-white sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C66A2E]">
              Revisión de producción
            </p>
            <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight sm:text-6xl">
              Integración técnica de pagos con OpenPay
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">
              MarmolMX utiliza OpenPay.js para procesar pagos con tarjeta
              mediante tokenización segura, protección antifraude y
              comunicación mínima con el backend.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold text-white/90">
              <BadgeCheck className="h-5 w-5 text-[#C66A2E]" />
              Sitio operado mediante HTTPS con SSL/TLS
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-18">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-4 sm:grid-cols-2">
              {safeguards.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="border border-[#1F2933]/10 bg-white p-6 shadow-sm"
                >
                  <Icon className="h-7 w-7 text-[#C66A2E]" />
                  <h2 className="mt-4 text-xl font-semibold text-[#1F2933]">
                    {title}
                  </h2>
                  <p className="mt-3 leading-7 text-[#5f656b]">
                    {description}
                  </p>
                </article>
              ))}
            </div>

            <section className="mt-8 border border-[#1F2933]/10 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="text-2xl font-semibold text-[#1F2933]">
                Elementos disponibles para revisión
              </h2>
              <p className="mt-3 max-w-3xl leading-7 text-[#5f656b]">
                El sitio presenta catálogo de productos, servicios,
                información comercial, checkout y políticas públicas para
                clientes.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {reviewLinks.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className="border border-[#1F2933]/10 px-4 py-3 text-sm font-semibold text-[#0F2A3D] transition hover:border-[#C66A2E] hover:text-[#C66A2E]"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </section>

            <section className="mt-8 bg-[#0F2A3D] p-6 text-white shadow-sm sm:p-8">
              <h2 className="text-2xl font-semibold">
                Contacto del comercio
              </h2>
              <div className="mt-4 grid gap-2 text-white/80">
                <p>{CONTACT_PHONE}</p>
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="w-fit transition hover:text-white"
                >
                  {CONTACT_EMAIL}
                </a>
                <a
                  href={`mailto:${SALES_EMAIL}`}
                  className="w-fit transition hover:text-white"
                >
                  {SALES_EMAIL}
                </a>
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
