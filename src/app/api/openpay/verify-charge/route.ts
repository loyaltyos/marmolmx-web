import { NextResponse, type NextRequest } from "next/server";
import {
  GENERIC_PAYMENT_DECLINE_MESSAGE,
  fetchOpenPayCharge,
} from "@/lib/openpay/server";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

type PersistedPayment = {
  id: string;
  provider_payment_id: string | null;
};

export async function GET(request: NextRequest) {
  try {
    const orderNumber = request.nextUrl.searchParams
      .get("orderNumber")
      ?.trim();

    if (!orderNumber) {
      return NextResponse.json(
        { status: "error", error: "Falta el número de orden." },
        { status: 400 },
      );
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { status: "error", error: "Supabase no está configurado." },
        { status: 503 },
      );
    }

    const supabase = createSupabaseServerClient();
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, order_number, status")
      .eq("order_number", orderNumber)
      .single();

    if (orderError || !order) {
      return NextResponse.json(
        { status: "error", error: "No encontramos la orden." },
        { status: 404 },
      );
    }

    const { data: payment, error: paymentError } = await supabase
      .from("payments")
      .select("id, provider_payment_id")
      .eq("order_id", order.id)
      .eq("provider", "openpay")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (paymentError || !payment?.provider_payment_id) {
      return NextResponse.json(
        { status: "error", error: "No encontramos el cargo de Openpay." },
        { status: 404 },
      );
    }

    const persistedPayment = payment as PersistedPayment;
    const providerPaymentId = persistedPayment.provider_payment_id;

    if (!providerPaymentId) {
      return NextResponse.json(
        { status: "error", error: "No encontramos el cargo de Openpay." },
        { status: 404 },
      );
    }

    const { response, result } = await fetchOpenPayCharge(providerPaymentId);

    if (!response.ok) {
      console.error("OpenPay charge verification failed:", result);
      return NextResponse.json(
        { status: "error", error: GENERIC_PAYMENT_DECLINE_MESSAGE },
        { status: response.status },
      );
    }

    if (result.status === "completed") {
      await syncPaymentStatus(order.id, persistedPayment.id, "completed", "paid", result);
      return NextResponse.json({
        status: "completed",
        order_number: order.order_number,
      });
    }

    if (result.status === "failed" || result.status === "cancelled") {
      await syncPaymentStatus(
        order.id,
        persistedPayment.id,
        result.status,
        "payment_failed",
        result,
      );
      return NextResponse.json({
        status: result.status,
        order_number: order.order_number,
        error: GENERIC_PAYMENT_DECLINE_MESSAGE,
      });
    }

    if (result.status === "charge_pending") {
      await syncPaymentStatus(
        order.id,
        persistedPayment.id,
        "charge_pending",
        "pending_3ds",
        result,
      );
      return NextResponse.json({
        status: "charge_pending",
        order_number: order.order_number,
      });
    }

    return NextResponse.json({
      status: result.status || "unknown",
      order_number: order.order_number,
    });
  } catch (error) {
    console.error("3D Secure verification failed:", error);
    return NextResponse.json(
      { status: "error", error: GENERIC_PAYMENT_DECLINE_MESSAGE },
      { status: 500 },
    );
  }
}

async function syncPaymentStatus(
  orderId: string,
  paymentId: string,
  providerStatus: string,
  orderStatus: string,
  rawResponse: unknown,
) {
  const supabase = createSupabaseServerClient();
  await supabase
    .from("payments")
    .update({ provider_status: providerStatus, raw_response: rawResponse })
    .eq("id", paymentId);
  await supabase
    .from("orders")
    .update({ status: orderStatus, updated_at: new Date().toISOString() })
    .eq("id", orderId);
}
