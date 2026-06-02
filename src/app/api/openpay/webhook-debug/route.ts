import { type NextRequest, NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const expectedToken = process.env.OPENPAY_WEBHOOK_DEBUG_TOKEN;
  const receivedToken = request.nextUrl.searchParams.get("token");

  if (!expectedToken) {
    return NextResponse.json(
      { error: "Webhook debug temporal no configurado." },
      { status: 503 },
    );
  }

  if (receivedToken !== expectedToken) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase no está configurado." },
      { status: 503 },
    );
  }

  const supabase = createSupabaseServerClient();
  const { data, error } = await supabase
    .from("openpay_webhook_logs")
    .select("payload, created_at")
    .eq("event_type", "verification")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "No fue posible consultar el código de verificación." },
      { status: 500 },
    );
  }

  const verificationCode = getVerificationCode(data?.payload);

  return NextResponse.json(
    {
      status: "ok",
      verification_code: verificationCode,
      received_at: data?.created_at ?? null,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}

function getVerificationCode(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const value = record.verification_code ?? record.challenge;
  return typeof value === "string" ? value : null;
}
