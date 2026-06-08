import "server-only";

export const GENERIC_PAYMENT_DECLINE_MESSAGE =
  "Tarjeta declinada. Intenta con otro método de pago o comunícate con tu banco.";

export type OpenPayCharge = {
  id?: string;
  status?: string;
  authorization?: string;
  description?: string;
  error_code?: number;
  category?: string;
  request_id?: string;
  payment_method?: {
    type?: string;
    url?: string;
  };
};

export function getOpenPayCredentials() {
  const merchantId = process.env.NEXT_PUBLIC_OPENPAY_MERCHANT_ID;
  const privateKey = process.env.OPENPAY_PRIVATE_KEY;

  if (!merchantId || !privateKey) {
    return null;
  }

  return { merchantId, privateKey };
}

export function getOpenPayApiOrigin() {
  return process.env.OPENPAY_SANDBOX === "false"
    ? "https://api.openpay.mx"
    : "https://sandbox-api.openpay.mx";
}

export function getOpenPayApiBaseUrl() {
  return `${getOpenPayApiOrigin()}/v1/`;
}

export function getOpenPayAuthHeader(privateKey: string) {
  return `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`;
}

export async function fetchOpenPayCharge(chargeId: string) {
  const credentials = getOpenPayCredentials();

  if (!credentials) {
    throw new Error("OpenPay no está configurado en el servidor.");
  }

  const response = await fetch(
    `${getOpenPayApiBaseUrl()}${encodeURIComponent(
      credentials.merchantId,
    )}/charges/${encodeURIComponent(chargeId)}`,
    {
      headers: {
        Authorization: getOpenPayAuthHeader(credentials.privateKey),
        "Content-Type": "application/json",
      },
      cache: "no-store",
    },
  );
  const result = (await response.json()) as OpenPayCharge;

  return { response, result };
}
