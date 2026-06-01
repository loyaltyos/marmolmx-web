import { NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

type ContactRequest = {
  full_name?: unknown;
  email?: unknown;
  phone?: unknown;
  project_type?: unknown;
  message?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[\d\s()-]{7,20}$/;

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error:
            "Supabase no está configurado. Agrega NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY.",
          code: "SUPABASE_NOT_CONFIGURED",
        },
        { status: 503 },
      );
    }

    const validation = validateContactRequest(
      (await request.json()) as ContactRequest,
    );

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const supabase = createSupabaseServerClient();
    const { error } = await supabase.from("contact_requests").insert({
      full_name: validation.data.fullName,
      email: validation.data.email,
      phone: validation.data.phone || null,
      project_type: validation.data.projectType || null,
      message: validation.data.message,
      source: "website",
      status: "new",
    });

    if (error) {
      throw new Error("No fue posible guardar la solicitud de contacto.");
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Contact request failed:", error);
    }

    return NextResponse.json(
      { error: "No fue posible enviar la solicitud." },
      { status: 500 },
    );
  }
}

function validateContactRequest(body: ContactRequest) {
  const fullName =
    typeof body.full_name === "string" ? body.full_name.trim() : "";
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const projectType =
    typeof body.project_type === "string" ? body.project_type.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (fullName.length < 3) {
    return { ok: false as const, error: "Ingresa tu nombre completo." };
  }

  if (!emailPattern.test(email)) {
    return { ok: false as const, error: "Ingresa un correo válido." };
  }

  if (phone && !phonePattern.test(phone)) {
    return { ok: false as const, error: "Ingresa un teléfono válido." };
  }

  if (message.length < 10) {
    return {
      ok: false as const,
      error: "Cuéntanos un poco más sobre tu proyecto.",
    };
  }

  return {
    ok: true as const,
    data: { fullName, email, phone, projectType, message },
  };
}
