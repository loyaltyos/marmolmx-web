import { NextResponse } from "next/server";
import {
  createSupabaseServerClient,
  isSupabaseConfigured,
} from "@/lib/supabase/server";
import {
  GENERIC_PAYMENT_DECLINE_MESSAGE,
  getOpenPayApiBaseUrl,
  getOpenPayAuthHeader,
  getOpenPayCredentials,
  type OpenPayCharge,
} from "@/lib/openpay/server";
import { SITE_URL } from "@/config/site";

type ChargeRequest = {
  order_id?: unknown;
  token_id?: unknown;
  device_session_id?: unknown;
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
    const validation = validateRequest(await request.json());

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase no está configurado en el servidor." },
        { status: 503 },
      );
    }

    const credentials = getOpenPayCredentials();

    if (!credentials) {
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

    const names = splitCustomerName(customer.full_name);
    const openPayResponse = await fetch(
      `${getOpenPayApiBaseUrl()}${encodeURIComponent(
        credentials.merchantId,
      )}/charges`,
      {
        method: "POST",
        headers: {
          Authorization: getOpenPayAuthHeader(credentials.privateKey),
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
          use_3d_secure: true,
          redirect_url: `${SITE_URL}/checkout/3ds-return?orderNumber=${encodeURIComponent(
            order.order_number,
          )}`,
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
    const openPayResult = (await openPayResponse.json()) as OpenPayCharge;

    if (!openPayResponse.ok) {
      console.error("OpenPay charge failed:", openPayResult);
      await persistFailedPayment(order.id, secureTotal, openPayResult);

      return NextResponse.json(
        { error: GENERIC_PAYMENT_DECLINE_MESSAGE },
        { status: openPayResponse.status },
      );
    }

    if (
      openPayResult.status === "charge_pending" &&
      openPayResult.payment_method?.type === "redirect" &&
      openPayResult.payment_method.url
    ) {
      await persistPending3dsPayment(order.id, secureTotal, openPayResult);

      return NextResponse.json({
        requires_redirect: true,
        redirect_url: openPayResult.payment_method.url,
        order_number: order.order_number,
      });
    }

    if (openPayResult.status !== "completed") {
      await persistPending3dsPayment(order.id, secureTotal, openPayResult);

      return NextResponse.json(
        {
          status: openPayResult.status || "charge_pending",
          order_number: order.order_number,
        },
        { status: 202 },
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
      { error: GENERIC_PAYMENT_DECLINE_MESSAGE },
      { status: 500 },
    );
  }
}

function validateRequest(body: unknown) {
  if (!isRecord(body)) {
    return { ok: false as const, error: "La solicitud de pago no es válida." };
  }

  const allowedFields = new Set([
    "order_id",
    "token_id",
    "device_session_id",
  ]);
  const unexpectedFields = Object.keys(body).filter(
    (field) => !allowedFields.has(field),
  );

  if (unexpectedFields.length) {
    return {
      ok: false as const,
      error: "La solicitud de pago contiene campos no permitidos.",
    };
  }

  const request = body as ChargeRequest;
  const orderId = typeof body.order_id === "string" ? body.order_id.trim() : "";
  const tokenId =
    typeof request.token_id === "string" ? request.token_id.trim() : "";
  const deviceSessionId =
    typeof request.device_session_id === "string"
      ? request.device_session_id.trim()
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

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
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
  result: OpenPayCharge,
) {
  const supabase = createSupabaseServerClient();
  const { error } = await supabase.rpc("record_openpay_payment", {
    p_order_id: orderId,
    p_provider_payment_id: result.id || null,
    p_provider_status: result.status || "completed",
    p_amount: amount,
    p_currency: "MXN",
    p_raw_response: result,
  });

  if (error) {
    throw new Error("No fue posible registrar el pago aprobado.");
  }
}

async function persistPending3dsPayment(
  orderId: string,
  amount: number,
  result: OpenPayCharge,
) {
  const supabase = createSupabaseServerClient();
  const { error: paymentError } = await supabase.from("payments").insert({
    order_id: orderId,
    provider: "openpay",
    provider_payment_id: result.id || null,
    provider_status: "charge_pending",
    amount,
    currency: "MXN",
    raw_response: result,
  });

  if (paymentError) {
    throw new Error("No fue posible guardar el pago pendiente de 3D Secure.");
  }

  const { error: orderError } = await supabase
    .from("orders")
    .update({ status: "pending_3ds", updated_at: new Date().toISOString() })
    .eq("id", orderId);

  if (orderError) {
    throw new Error("No fue posible actualizar la orden pendiente de 3D Secure.");
  }
}

async function persistFailedPayment(
  orderId: string,
  amount: number,
  result: OpenPayCharge,
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

function sanitizeOpenPayError(result: OpenPayCharge) {
  return {
    category: result.category,
    description: result.description,
    error_code: result.error_code,
    request_id: result.request_id,
  };
}
