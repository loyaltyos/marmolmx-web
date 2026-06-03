import { after } from "next/server";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

type JsonRecord = Record<string, unknown>;

export async function POST(request: Request) {
  const rawPayload = await request.text();
  const payload = parsePayload(rawPayload);
  const verificationCode =
    getString(payload.verification_code) ||
    getString(payload.challenge) ||
    getString(payload.code);

  after(async () => {
    await processOpenPayWebhook(payload);
  });

  if (verificationCode) {
    return new Response(verificationCode, { status: 200 });
  }

  return new Response(null, { status: 200 });
}

async function processOpenPayWebhook(payload: JsonRecord) {
  const verificationCode =
    getString(payload.verification_code) ||
    getString(payload.challenge) ||
    getString(payload.code);
  const eventType =
    getString(payload.type) || (verificationCode ? "verification" : "unknown");
  const transaction = isRecord(payload.transaction)
    ? payload.transaction
    : null;
  const providerPaymentId = transaction
    ? getString(transaction.id)
    : null;

  console.info("OpenPay webhook received", payload);

  if (verificationCode) {
    console.info("OpenPay webhook verification code received:", verificationCode);
  }

  if (!isSupabaseConfigured()) {
    console.error("OpenPay webhook skipped: Supabase is not configured.");
    return;
  }

  const supabase = createSupabaseServerClient();
  const { error: logError } = await supabase
    .from("openpay_webhook_logs")
    .insert({
      event_type: eventType,
      provider_payment_id: providerPaymentId,
      payload,
    });

  if (logError) {
    console.error("OpenPay webhook log failed:", logError);
  }

  const paymentStatus =
    eventType === "charge.succeeded" || eventType === "charge.completed"
      ? "completed"
      : eventType === "charge.failed"
        ? "failed"
        : eventType === "charge.cancelled"
          ? "cancelled"
          : null;

  if (!paymentStatus || !providerPaymentId) {
    return;
  }

  const { data: payment, error: paymentLookupError } = await supabase
    .from("payments")
    .select("order_id")
    .eq("provider", "openpay")
    .eq("provider_payment_id", providerPaymentId)
    .maybeSingle();

  if (paymentLookupError) {
    console.error("OpenPay webhook payment lookup failed:", paymentLookupError);
    return;
  }

  if (!payment) {
    console.info(
      "OpenPay webhook did not match a stored payment:",
      providerPaymentId,
    );
    return;
  }

  const { error: paymentUpdateError } = await supabase
    .from("payments")
    .update({
      provider_status: paymentStatus,
      raw_response: payload,
    })
    .eq("provider", "openpay")
    .eq("provider_payment_id", providerPaymentId);

  if (paymentUpdateError) {
    console.error("OpenPay webhook payment update failed:", paymentUpdateError);
    return;
  }

  const { error: orderUpdateError } = await supabase
    .from("orders")
    .update({
      status: paymentStatus === "completed" ? "paid" : "payment_failed",
      updated_at: new Date().toISOString(),
    })
    .eq("id", payment.order_id);

  if (orderUpdateError) {
    console.error("OpenPay webhook order update failed:", orderUpdateError);
  }
}

function parsePayload(rawPayload: string): JsonRecord {
  try {
    const payload = JSON.parse(rawPayload) as unknown;
    return isRecord(payload) ? payload : { payload };
  } catch {
    return { raw_payload: rawPayload };
  }
}

function isRecord(value: unknown): value is JsonRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function getString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}
