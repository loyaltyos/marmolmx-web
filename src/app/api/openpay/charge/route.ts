import { NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";

type ChargeRequest = {
  order_id?: unknown;
  token_id?: unknown;
  device_session_id?: unknown;
};

type OpenPayResult = {
  id?: string;
  status?: string;
  authorization?: string;
  description?: string;
  error_code?: number;
  category?: string;
  request_id?: string;
};

type PersistedOrder = {
  id: string;
  order_number: string;
  customer_id: string;
  total: number | string;
  currency: string;
  status: string;
};

type PersistedCustomer = {
  full_name: string;
  phone: string;
  email: string;
};

type PersistedItem = {
  quantity: number;
  unit_price: number | string;
  line_total: number | string;
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let order: PersistedOrder | null = null;
  let secureTotal = 0;
  let chargeWasApproved = false;

  try {
    const validation = validateRequest((await request.json()) as ChargeRequest);

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase no está configurado en el servidor." },
        { status: 503 },
      );
    }

    const merchantId = process.env.NEXT_PUBLIC_OPENPAY_MERCHANT_ID;
    const privateKey = process.env.OPENPAY_PRIVATE_KEY;

    if (!merchantId || !privateKey) {
      return NextResponse.json(
        { error: "OpenPay no está configurado en el servidor." },
        { status: 503 },
      );
    }

    const supabase = createSupabaseServerClient();
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("id, order_number, customer_id, total, currency, status")
      .eq("id", validation.orderId)
      .single();

    if (orderError || !orderData) {
      return NextResponse.json(
        { error: "No encontramos la orden solicitada." },
        { status: 404 },
      );
    }

    order = orderData as PersistedOrder;

    if (order.status === "paid") {
      return NextResponse.json(
        { error: "La orden ya fue pagada." },
        { status: 409 },
      );
    }

    const [{ data: customerData, error: customerError }, { data: itemsData, error: itemsError }] =
      await Promise.all([
        supabase
          .from("customers")
          .select("full_name, phone, email")
          .eq("id", order.customer_id)
          .single(),
        supabase
          .from("order_items")
          .select("quantity, unit_price, line_total")
          .eq("order_id", order.id),
      ]);

    if (customerError || !customerData) {
      throw new Error("No fue posible recuperar el cliente de la orden.");
    }

    if (itemsError || !itemsData?.length) {
      throw new Error("La orden no contiene productos válidos.");
    }

    const customer = customerData as PersistedCustomer;
    const items = itemsData as PersistedItem[];
    secureTotal = calculateSecureTotal(items);

    if (secureTotal <= 0 || secureTotal !== Number(order.total)) {
      throw new Error("El total seguro de la orden no es válido.");
    }

    const apiOrigin =
      process.env.OPENPAY_SANDBOX === "false"
        ? "https://api.openpay.mx"
        : "https://sandbox-api.openpay.mx";
    const names = splitCustomerName(customer.full_name);
    const openPayResponse = await fetch(
      `${apiOrigin}/v1/${encodeURIComponent(merchantId)}/charges`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${privateKey}:`).toString(
            "base64",
          )}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "card",
          source_id: validation.tokenId,
          amount: secureTotal,
          currency: "MXN",
          description: `Orden MarmolMX ${order.order_number}`,
          order_id: order.order_number,
          device_session_id: validation.deviceSessionId,
          customer: {
            name: names.firstName,
            last_name: names.lastName,
            phone_number: customer.phone,
            email: customer.email,
          },
        }),
        cache: "no-store",
      },
    );
    const openPayResult = (await openPayResponse.json()) as OpenPayResult;

    if (!openPayResponse.ok) {
      await persistFailedPayment(order.id, secureTotal, openPayResult);

      return NextResponse.json(
        {
          error:
            "No pudimos procesar el pago. Verifica los datos o intenta con otra tarjeta.",
          error_code: openPayResult.error_code,
        },
        { status: openPayResponse.status },
      );
    }

    chargeWasApproved = true;
    await persistApprovedPayment(order.id, secureTotal, openPayResult);

    return NextResponse.json({
      success: true,
      transaction_id: openPayResult.id,
      order_number: order.order_number,
      status: openPayResult.status,
      authorization: openPayResult.authorization,
    });
  } catch (error) {
    if (order && !chargeWasApproved) {
      await persistFailedPayment(order.id, secureTotal || Number(order.total), {
        category: "internal",
        description:
          error instanceof Error
            ? error.message
            : "No fue posible procesar el pago.",
      });
    }

    return NextResponse.json(
      {
        error:
          "No pudimos procesar el pago. Verifica los datos o intenta con otra tarjeta.",
      },
      { status: 500 },
    );
  }
}

function validateRequest(body: ChargeRequest) {
  const orderId = typeof body.order_id === "string" ? body.order_id.trim() : "";
  const tokenId = typeof body.token_id === "string" ? body.token_id.trim() : "";
  const deviceSessionId =
    typeof body.device_session_id === "string"
      ? body.device_session_id.trim()
      : "";

  if (!uuidPattern.test(orderId)) {
    return { ok: false as const, error: "La orden no es válida." };
  }

  if (!tokenId) {
    return { ok: false as const, error: "Falta el token de pago." };
  }

  if (!deviceSessionId) {
    return { ok: false as const, error: "Falta la sesión antifraude." };
  }

  return { ok: true as const, orderId, tokenId, deviceSessionId };
}

function calculateSecureTotal(items: PersistedItem[]) {
  return items.reduce(
    (total, item) => total + Number(item.unit_price) * Number(item.quantity),
    0,
  );
}

function splitCustomerName(fullName: string) {
  const [firstName, ...lastNameParts] = fullName.trim().split(/\s+/);
  return {
    firstName,
    lastName: lastNameParts.join(" ") || firstName,
  };
}

async function persistApprovedPayment(
  orderId: string,
  amount: number,
  result: OpenPayResult,
) {
  const supabase = createSupabaseServerClient();
  const { error: paymentError } = await supabase.from("payments").insert({
    order_id: orderId,
    provider: "openpay",
    provider_payment_id: result.id || null,
    provider_status: result.status || "completed",
    amount,
    currency: "MXN",
    raw_response: result,
  });

  if (paymentError) {
    throw new Error("No fue posible guardar el pago aprobado.");
  }

  const { error: orderError } = await supabase
    .from("orders")
    .update({ status: "paid", updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (orderError) {
    throw new Error("No fue posible actualizar la orden pagada.");
  }
}

async function persistFailedPayment(
  orderId: string,
  amount: number,
  result: OpenPayResult,
) {
  try {
    const supabase = createSupabaseServerClient();
    await supabase.from("payments").insert({
      order_id: orderId,
      provider: "openpay",
      provider_payment_id: result.id || null,
      provider_status: "failed",
      amount,
      currency: "MXN",
      raw_response: sanitizeOpenPayError(result),
    });
    await supabase
      .from("orders")
      .update({
        status: "payment_failed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);
  } catch {
    // The client still receives a safe payment failure response.
  }
}

function sanitizeOpenPayError(result: OpenPayResult) {
  return {
    category: result.category,
    description: result.description,
    error_code: result.error_code,
    request_id: result.request_id,
  };
}
