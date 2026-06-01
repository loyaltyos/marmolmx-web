import { CheckCircle2 } from "lucide-react";

const values = [
  "Calidad en ejecución",
  "Cumplimiento y compromiso",
  "Soluciones a medida",
  "Materiales seleccionados",
];

export function About() {
  return (
    <section id="quienes-somos" className="bg-[#F5F2EC] py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C66A2E]">
            Quiénes somos
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-normal text-[#1F2933] sm:text-5xl">
            Obra profesional con criterio, precisión y permanencia.
          </h2>
        </div>
        <div>
          <p className="text-lg leading-8 text-[#4b5560]">
            MarmolMX es una empresa enfocada en proyectos, construcción y
            remodelación de espacios residenciales, comerciales e industriales.
            Combinamos experiencia en obra, materiales de calidad y acabados
            premium para entregar soluciones confiables, funcionales y
            duraderas.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {values.map((value) => (
              <div
                key={value}
                className="flex items-start gap-3 border border-[#1F2933]/10 bg-white p-5 shadow-sm"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#C66A2E]" />
                <span className="font-semibold text-[#1F2933]">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
