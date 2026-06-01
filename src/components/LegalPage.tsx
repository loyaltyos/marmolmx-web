import { ArrowLeft, FileText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  BUSINESS_LOCATION,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SALES_EMAIL,
  SERVICE_AREA,
} from "@/config/site";
import { Footer } from "./Footer";

export type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
};

export function LegalPage({
  eyebrow,
  title,
  description,
  sections,
}: {
  eyebrow: string;
  title: string;
  description: string;
  sections: LegalSection[];
}) {
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
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </Link>
        </div>
      </header>

      <main>
        <section className="bg-[#0F2A3D] px-4 pb-16 pt-12 text-white sm:px-6 sm:pb-20 sm:pt-16">
          <div className="mx-auto max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C66A2E]">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/75">
              {description}
            </p>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto grid max-w-4xl gap-6">
            <div className="flex items-center gap-3 border border-[#1F2933]/10 bg-white p-5 text-sm leading-6 text-[#5f656b] shadow-sm">
              <FileText className="h-5 w-5 shrink-0 text-[#C66A2E]" />
              <p>
                Información aplicable a solicitudes y compras realizadas con
                MarmolMX, con ubicación principal en {BUSINESS_LOCATION} y
                atención en {SERVICE_AREA}. Última actualización: mayo de 2026.
              </p>
            </div>

            {sections.map((section) => (
              <article
                key={section.title}
                className="border border-[#1F2933]/10 bg-white p-6 shadow-sm sm:p-8"
              >
                <h2 className="text-2xl font-semibold text-[#1F2933]">
                  {section.title}
                </h2>
                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-4 leading-7 text-[#5f656b]"
                  >
                    {paragraph}
                  </p>
                ))}
                {section.items && (
                  <ul className="mt-4 grid gap-3">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="border-l-2 border-[#C66A2E] pl-4 leading-7 text-[#5f656b]"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}

            <div className="border border-[#C66A2E]/25 bg-[#fffaf5] p-6">
              <h2 className="text-xl font-semibold text-[#1F2933]">
                Contacto del comercio
              </h2>
              <p className="mt-3 leading-7 text-[#5f656b]">
                Para dudas sobre estas políticas, comunícate con MarmolMX al{" "}
                {CONTACT_PHONE}, escribe a{" "}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="font-semibold text-[#0F2A3D] hover:text-[#C66A2E]"
                >
                  {CONTACT_EMAIL}
                </a>{" "}
                o solicita una cotización en{" "}
                <a
                  href={`mailto:${SALES_EMAIL}`}
                  className="font-semibold text-[#0F2A3D] hover:text-[#C66A2E]"
                >
                  {SALES_EMAIL}
                </a>
                .
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
