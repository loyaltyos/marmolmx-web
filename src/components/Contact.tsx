"use client";

import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { useState, type FormEvent } from "react";
import {
  BUSINESS_LOCATION,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  SALES_EMAIL,
  WHATSAPP_NUMBER,
} from "@/config/site";

const initialForm = {
  fullName: "",
  phone: "",
  email: "",
  projectType: "Construcción integral",
  message: "",
};

export function Contact() {
  const [form, setForm] = useState(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.fullName,
          email: form.email,
          phone: form.phone,
          project_type: form.projectType,
          message: form.message,
        }),
      });

      if (!response.ok) {
        throw new Error("Contact request failed");
      }

      setForm(initialForm);
      setSuccess(
        "Solicitud enviada correctamente. Nuestro equipo se pondrá en contacto contigo.",
      );
    } catch {
      setError(
        "No pudimos enviar tu solicitud. Intenta nuevamente o contáctanos por WhatsApp.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="bg-[#0F2A3D] py-20 text-white sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C66A2E]">
            Contacto MarmolMX
          </p>
          <h2 className="mt-4 text-4xl font-semibold tracking-normal sm:text-5xl">
            Solicita una cotización para tu próximo proyecto.
          </h2>
          <p className="mt-5 text-lg leading-8 text-white/75">
            Cuéntanos qué necesitas construir, remodelar o suministrar. Nuestro
            equipo revisará el alcance y podrá orientarte con materiales,
            tiempos y una propuesta inicial.
          </p>

          <div className="mt-8 grid gap-4">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 w-fit items-center gap-3 rounded bg-[#25D366] px-5 py-3 font-semibold text-[#0F2A3D] transition hover:bg-white"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
            <p className="flex items-center gap-3 text-white/82">
              <Phone className="h-5 w-5 text-[#C66A2E]" />
              {CONTACT_PHONE}
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="flex items-center gap-3 text-white/82 transition hover:text-white"
            >
              <Mail className="h-5 w-5 text-[#C66A2E]" />
              {CONTACT_EMAIL}
            </a>
            <a
              href={`mailto:${SALES_EMAIL}`}
              className="flex items-center gap-3 text-white/82 transition hover:text-white"
            >
              <Mail className="h-5 w-5 text-[#C66A2E]" />
              {SALES_EMAIL}
            </a>
            <p className="flex items-center gap-3 text-white/82">
              <MapPin className="h-5 w-5 text-[#C66A2E]" />
              {BUSINESS_LOCATION}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 border border-white/12 bg-white p-5 text-[#1F2933] shadow-2xl shadow-black/20 sm:p-7"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-2 text-sm font-semibold">
              Nombre
              <input
                required
                value={form.fullName}
                onChange={(event) => updateField("fullName", event.target.value)}
                className="h-12 border border-[#1F2933]/12 bg-[#F5F2EC] px-4 outline-none transition focus:border-[#C66A2E]"
                placeholder="Nombre completo"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold">
              Teléfono
              <input
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                className="h-12 border border-[#1F2933]/12 bg-[#F5F2EC] px-4 outline-none transition focus:border-[#C66A2E]"
                placeholder="+52"
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm font-semibold">
            Correo
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => updateField("email", event.target.value)}
              className="h-12 border border-[#1F2933]/12 bg-[#F5F2EC] px-4 outline-none transition focus:border-[#C66A2E]"
              placeholder="correo@empresa.com"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Tipo de proyecto
            <select
              value={form.projectType}
              onChange={(event) =>
                updateField("projectType", event.target.value)
              }
              className="h-12 border border-[#1F2933]/12 bg-[#F5F2EC] px-4 outline-none transition focus:border-[#C66A2E]"
            >
              <option>Construcción integral</option>
              <option>Remodelación</option>
              <option>Acabados premium</option>
              <option>Suministro de materiales</option>
              <option>Proyecto personalizado</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            Mensaje
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(event) => updateField("message", event.target.value)}
              className="resize-none border border-[#1F2933]/12 bg-[#F5F2EC] px-4 py-3 outline-none transition focus:border-[#C66A2E]"
              placeholder="Describe medidas, ubicación, alcance o etapa del proyecto."
            />
          </label>
          {success && (
            <p className="rounded bg-emerald-50 p-3 text-sm leading-6 text-emerald-800">
              {success}
            </p>
          )}
          {error && (
            <p className="rounded bg-red-50 p-3 text-sm leading-6 text-red-700">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-12 bg-[#C66A2E] font-semibold text-white transition hover:bg-[#a95524] disabled:cursor-wait disabled:bg-[#A7A29A]"
          >
            {isSubmitting ? "Enviando solicitud..." : "Enviar Solicitud"}
          </button>
        </form>
      </div>
    </section>
  );
}
