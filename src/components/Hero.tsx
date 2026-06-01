import { ArrowRight, BadgeCheck } from "lucide-react";

const stats = [
  "+10 años de experiencia",
  "Proyectos residenciales y comerciales",
  "Acabados premium",
  "Atención personalizada",
];

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[760px] overflow-hidden bg-[#0F2A3D] pt-28 text-white"
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1800&q=85')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0F2A3D]/95 via-[#0F2A3D]/78 to-[#1F2933]/35" />
      <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#F5F2EC] to-transparent" />

      <div className="relative mx-auto grid min-h-[680px] max-w-7xl content-center px-4 pb-28 pt-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="mb-5 inline-flex items-center gap-2 border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white/90 backdrop-blur">
            <BadgeCheck className="h-4 w-4 text-[#C66A2E]" />
            Proyectos, construcciones y remodelaciones
          </p>
          <h1 className="max-w-4xl text-5xl font-semibold leading-[1.04] tracking-normal text-white sm:text-6xl lg:text-7xl">
            Construimos espacios que perduran
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/84 sm:text-xl">
            Proyectos, construcciones y remodelaciones ejecutadas con calidad
            profesional, materiales premium y atención personalizada.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="#productos"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-[#C66A2E] px-6 py-3 font-semibold text-white transition hover:bg-[#a95524]"
            >
              Ver Productos
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="#contacto"
              className="inline-flex min-h-12 items-center justify-center rounded border border-white/35 px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-[#0F2A3D]"
            >
              Solicitar Cotización
            </a>
          </div>
        </div>

        <div className="mt-14 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat}
              className="border border-white/16 bg-white/10 p-4 text-sm font-medium text-white shadow-lg shadow-black/10 backdrop-blur"
            >
              {stat}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
