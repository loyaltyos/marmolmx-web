import { services } from "@/data/services";

export function Services() {
  return (
    <section id="servicios" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C66A2E]">
            Servicios
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-normal text-[#1F2933] sm:text-5xl">
            Soluciones para construir, renovar y elevar cada espacio.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="group border border-[#1F2933]/10 bg-[#F5F2EC] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#C66A2E]/50 hover:bg-white hover:shadow-xl hover:shadow-[#1F2933]/10"
              >
                <div className="grid h-12 w-12 place-items-center rounded bg-[#0F2A3D] text-white transition group-hover:bg-[#C66A2E]">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-[#1F2933]">
                  {service.title}
                </h3>
                <p className="mt-4 leading-7 text-[#5f656b]">
                  {service.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
