"use client";

import { useState } from "react";
import { projects } from "@/data/projects";

export function ProjectsGallery() {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  return (
    <section id="proyectos" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C66A2E]">
            Portafolio
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-normal text-[#1F2933] sm:text-5xl">
            Proyectos realizados
          </h2>
          <p className="mt-5 text-lg leading-8 text-[#5f656b]">
            Una muestra de intervenciones residenciales y comerciales pensadas
            para comunicar solidez, cuidado en obra y acabados de alto nivel.
          </p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.name}
              className="group overflow-hidden border border-[#1F2933]/10 bg-[#F5F2EC] transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1F2933]/10"
            >
              <div className="aspect-[16/11] overflow-hidden bg-[#0F2A3D]">
                {!failedImages[project.name] ? (
                  <img
                    src={project.image}
                    alt={project.name}
                    onError={() =>
                      setFailedImages((current) => ({
                        ...current,
                        [project.name]: true,
                      }))
                    }
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center bg-gradient-to-br from-[#0F2A3D] to-[#A7A29A] p-6 text-center text-white">
                    <span className="font-semibold">{project.type}</span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#C66A2E]">
                  {project.type}
                </p>
                <h3 className="mt-3 text-2xl font-semibold text-[#1F2933]">
                  {project.name}
                </h3>
                <p className="mt-3 leading-7 text-[#5f656b]">
                  {project.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
