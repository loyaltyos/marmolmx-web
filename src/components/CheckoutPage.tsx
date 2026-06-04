"use client";

import {
  ArrowLeft,
  BadgeCheck,
  CreditCard,
  LockKeyhole,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";
import Image from "next/image";
import Script from "next/script";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useCart } from "./CartProvider";

const GENERIC_PAYMENT_DECLINE_MESSAGE =
  "Tarjeta declinada. Intenta con otro método de pago o comunícate con tu banco.";

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

type CheckoutForm = {
  fullName: string;
  phone: string;
  email: string;
  deliveryZone: string;
  notes: string;
  holderName: string;
  cardNumber: string;
  expirationMonth: string;
  expirationYear: string;
  cvv2: string;
};

const initialForm: CheckoutForm = {
  fullName: "",
  phone: "",
  email: "",
  deliveryZone: "",
  notes: "",
  holderName: "",
  cardNumber: "",
  expirationMonth: "",
  expirationYear: "",
  cvv2: "",
};

type CardBrand = "visa" | "mastercard" | "amex" | "unknown";

export function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, isHydrated } = useCart();
  const [form, setForm] = useState(initialForm);
  const [deviceSessionId, setDeviceSessionId] = useState("");
  const [isOpenPayReady, setIsOpenPayReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRedirecting3ds, setIsRedirecting3ds] = useState(false);
  const [error, setError] = useState("");
  const [paymentErrors, setPaymentErrors] = useState<Record<string, string>>({});
  const cardBrand = detectCardBrand(form.cardNumber);
  const formattedCardNumber = formatCardNumber(form.cardNumber, cardBrand);
  const cvvMaxLength = cardBrand === "amex" ? 4 : 3;
  const isOpenPaySandbox =
    process.env.NEXT_PUBLIC_OPENPAY_SANDBOX !== "false";

  const configureOpenPay = useCallback(() => {
    const openPay = window.OpenPay;
    const merchantId = process.env.NEXT_PUBLIC_OPENPAY_MERCHANT_ID;
    const publicKey = process.env.NEXT_PUBLIC_OPENPAY_PUBLIC_KEY;

    if (!openPay || !merchantId || !publicKey) {
      setIsOpenPayReady(false);
      return;
    }

    openPay.setId(merchantId);
    openPay.setApiKey(publicKey);
    openPay.setSandboxMode(
      process.env.NEXT_PUBLIC_OPENPAY_SANDBOX !== "false",
    );

    const paymentForm = document.getElementById("payment-form");
    const existingSessionId = (
      document.getElementById("device_session_id") as HTMLInputElement | null
    )?.value;
    const sessionId =
      deviceSessionId ||
      existingSessionId ||
      (paymentForm
        ? openPay.deviceData?.setup("payment-form", "device_session_id")
        : "");

    if (!sessionId) {
      setIsOpenPayReady(false);
      return;
    }

    if (sessionId !== deviceSessionId) {
      setDeviceSessionId(sessionId);
    }

    setIsOpenPayReady(true);
  }, [deviceSessionId]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      if (isHydrated && items.length) {
        configureOpenPay();
      }
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [configureOpenPay, isHydrated, items.length]);

  const updateField = (field: keyof CheckoutForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const updateCardNumber = (value: string) => {
    const rawDigits = onlyDigits(value);
    const nextBrand = detectCardBrand(rawDigits);
    const digits = rawDigits.slice(0, nextBrand === "amex" ? 15 : 16);
    setForm((current) => ({
      ...current,
      cardNumber: digits,
      cvv2: current.cvv2.slice(0, nextBrand === "amex" ? 4 : 3),
    }));
    setPaymentErrors((current) => ({ ...current, cardNumber: "" }));
  };

  const updateExpirationMonth = (value: string) => {
    const digits = onlyDigits(value).slice(0, 2);
    setForm((current) => ({ ...current, expirationMonth: digits }));
    setPaymentErrors((current) => ({
      ...current,
      expirationMonth:
        digits && !isValidExpirationMonth(digits)
          ? "Ingresa un mes entre 01 y 12."
          : "",
    }));
  };

  const updateExpirationYear = (value: string) => {
    const digits = onlyDigits(value).slice(0, 2);
    setForm((current) => ({ ...current, expirationYear: digits }));
    setPaymentErrors((current) => ({
      ...current,
      expirationYear:
        digits && digits.length !== 2
          ? "Usa 2 dígitos."
          : "",
    }));
  };

  const updateCvv = (value: string) => {
    const digits = onlyDigits(value).slice(0, cvvMaxLength);
    setForm((current) => ({ ...current, cvv2: digits }));
    setPaymentErrors((current) => ({ ...current, cvv2: "" }));
  };

  const tokenizeCard = () =>
    new Promise<string>((resolve, reject) => {
      if (!window.OpenPay) {
        reject(new Error(GENERIC_PAYMENT_DECLINE_MESSAGE));
        return;
      }

      window.OpenPay.token.create(
        {
          card_number: form.cardNumber,
          holder_name: form.holderName,
          expiration_month: form.expirationMonth,
          expiration_year: form.expirationYear,
          cvv2: form.cvv2,
        },
        (response) => resolve(response.data.id),
        () => reject(new Error(GENERIC_PAYMENT_DECLINE_MESSAGE)),
      );
    });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!items.length) {
      setError("Tu carrito está vacío. Agrega productos antes de pagar.");
      return;
    }

    if (!isOpenPayReady) {
      setError(
        "Openpay no está disponible o la protección antifraude no pudo inicializarse. Recarga la página e intenta nuevamente.",
      );
      return;
    }

    const validationErrors = validatePaymentFields(form, cardBrand);
    setPaymentErrors(validationErrors);

    if (Object.keys(validationErrors).length) {
      setError("Revisa los datos de la tarjeta antes de continuar.");
      return;
    }

    if (!deviceSessionId) {
      setError(
        "No fue posible iniciar la protección antifraude de Openpay. Recarga la página e intenta nuevamente.",
      );
      return;
    }

    setIsSubmitting(true);
    let redirectingTo3ds = false;

    try {
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            full_name: form.fullName,
            phone_number: form.phone,
            email: form.email,
            delivery_zone: form.deliveryZone,
            notes: form.notes,
          },
          items: items.map((item) => ({
            product_id: item.product.id,
            quantity: item.quantity,
          })),
        }),
      });
      const order = (await orderResponse.json()) as {
        order_id?: string;
        order_number?: string;
        total?: number;
        error?: string;
      };

      if (!orderResponse.ok || !order.order_id || !order.order_number) {
        throw new Error(order.error ?? "No fue posible crear la orden.");
      }

      const tokenId = await tokenizeCard();
      const response = await fetch("/api/openpay/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token_id: tokenId,
          device_session_id: deviceSessionId,
          order_id: order.order_id,
        }),
      });
      const result = (await response.json()) as {
        success?: boolean;
        transaction_id?: string;
        order_number?: string;
        requires_redirect?: boolean;
        redirect_url?: string;
        error?: string;
      };

      if (result.requires_redirect && result.redirect_url) {
        redirectingTo3ds = true;
        setIsRedirecting3ds(true);
        window.location.href = result.redirect_url;
        return;
      }

      if (!response.ok || !result.success) {
        throw new Error(result.error ?? GENERIC_PAYMENT_DECLINE_MESSAGE);
      }

      router.push(
        `/checkout/success?orderNumber=${encodeURIComponent(
          result.order_number ?? order.order_number,
        )}`,
      );
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : GENERIC_PAYMENT_DECLINE_MESSAGE,
      );
    } finally {
      if (!redirectingTo3ds) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2EC]">
      <Script
        src="https://resources.openpay.mx/lib/openpay-js/1.2.38/openpay.v1.min.js"
        strategy="afterInteractive"
        onReady={configureOpenPay}
      />
      <Script
        src="https://resources.openpay.mx/lib/openpay-data-js/1.2.38/openpay-data.v1.min.js"
        strategy="afterInteractive"
        onReady={configureOpenPay}
      />

      <header className="border-b border-white/10 bg-[#0F2A3D]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex h-14 w-[116px] items-center justify-center rounded bg-white px-1.5 py-1 shadow-sm sm:w-[144px]"
          >
            <Image
              src="/images/logo-marmolmx.png"
              alt="MarmolMX - Proyectos, Construcciones y Remodelaciones"
              width={1280}
              height={678}
              priority
              className="h-full w-full object-contain"
            />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white/80 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Volver al catálogo</span>
            <span className="sm:hidden">Volver</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C66A2E]">
            Pago seguro
          </p>
          <h1 className="mt-3 text-4xl font-semibold text-[#1F2933] sm:text-5xl">
            Finaliza tu solicitud
          </h1>
          <p className="mt-4 leading-7 text-[#5f656b]">
            Completa tus datos y procesa el pago en el entorno seguro de
            Openpay{isOpenPaySandbox ? " Sandbox" : ""}.
          </p>
        </div>

        {!isHydrated ? (
          <div className="border border-[#1F2933]/10 bg-white p-8 text-[#5f656b]">
            Cargando tu pedido...
          </div>
        ) : items.length === 0 ? (
          <div className="border border-[#1F2933]/10 bg-white p-8">
            <PackageCheck className="h-10 w-10 text-[#C66A2E]" />
            <h2 className="mt-4 text-2xl font-semibold text-[#1F2933]">
              Tu carrito está vacío
            </h2>
            <p className="mt-2 text-[#5f656b]">
              Agrega productos desde el catálogo para continuar.
            </p>
            <Link
              href="/#productos"
              className="mt-6 inline-flex bg-[#C66A2E] px-5 py-3 font-semibold text-white transition hover:bg-[#a95524]"
            >
              Ver productos
            </Link>
          </div>
        ) : (
          <form
            id="payment-form"
            onSubmit={handleSubmit}
            className="grid gap-6 lg:grid-cols-[1fr_380px]"
          >
            <div className="grid gap-6">
              <section className="border border-[#1F2933]/10 bg-white p-5 shadow-sm sm:p-7">
                <h2 className="text-2xl font-semibold text-[#1F2933]">
                  Datos del cliente
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <CheckoutInput
                    label="Nombre completo"
                    value={form.fullName}
                    onChange={(value) => updateField("fullName", value)}
                    autoComplete="name"
                  />
                  <CheckoutInput
                    label="Teléfono"
                    value={form.phone}
                    onChange={(value) => updateField("phone", value)}
                    autoComplete="tel"
                  />
                  <CheckoutInput
                    label="Correo"
                    type="email"
                    value={form.email}
                    onChange={(value) => updateField("email", value)}
                    autoComplete="email"
                  />
                  <CheckoutInput
                    label="Dirección / zona de entrega"
                    value={form.deliveryZone}
                    onChange={(value) => updateField("deliveryZone", value)}
                    autoComplete="street-address"
                  />
                </div>
                <label className="mt-4 grid gap-2 text-sm font-semibold text-[#1F2933]">
                  Notas del proyecto o medidas
                  <textarea
                    value={form.notes}
                    onChange={(event) => updateField("notes", event.target.value)}
                    rows={4}
                    className="resize-none border border-[#1F2933]/15 bg-[#F5F2EC] px-4 py-3 font-normal outline-none transition focus:border-[#C66A2E]"
                  />
                </label>
              </section>

              <section className="border border-[#1F2933]/10 bg-white p-5 shadow-sm sm:p-7">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-6 w-6 text-[#C66A2E]" />
                  <h2 className="text-2xl font-semibold text-[#1F2933]">
                    Datos de pago
                  </h2>
                </div>
                <p className="mt-3 text-sm leading-6 text-[#5f656b]">
                  Tus datos de tarjeta se tokenizan directamente con Openpay y
                  no son almacenados por MarmolMX.
                </p>
                <PaymentTrustMarks />
                <CardPreview
                  brand={cardBrand}
                  cardNumber={form.cardNumber}
                  holderName={form.holderName}
                  expirationMonth={form.expirationMonth}
                  expirationYear={form.expirationYear}
                />
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <CheckoutInput
                      label="Nombre del titular"
                      value={form.holderName}
                      onChange={(value) => updateField("holderName", value)}
                      autoComplete="cc-name"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <CardNumberInput
                      value={formattedCardNumber}
                      brand={cardBrand}
                      error={paymentErrors.cardNumber}
                      onChange={updateCardNumber}
                    />
                  </div>
                  <CheckoutInput
                    label="Mes expiración"
                    value={form.expirationMonth}
                    onChange={updateExpirationMonth}
                    autoComplete="cc-exp-month"
                    inputMode="numeric"
                    maxLength={2}
                    placeholder="MM"
                    error={paymentErrors.expirationMonth}
                  />
                  <CheckoutInput
                    label="Año expiración"
                    value={form.expirationYear}
                    onChange={updateExpirationYear}
                    autoComplete="cc-exp-year"
                    inputMode="numeric"
                    maxLength={2}
                    placeholder="AA"
                    error={paymentErrors.expirationYear}
                  />
                  <CheckoutInput
                    label={cardBrand === "amex" ? "CID" : "CVV"}
                    value={form.cvv2}
                    onChange={updateCvv}
                    autoComplete="cc-csc"
                    inputMode="numeric"
                    maxLength={cvvMaxLength}
                    placeholder={cardBrand === "amex" ? "CID" : "CVV"}
                    error={paymentErrors.cvv2}
                  />
                </div>
                <p className="mt-5 flex items-start gap-2 border-t border-[#1F2933]/10 pt-4 text-xs leading-5 text-[#5f656b]">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#C66A2E]" />
                  <span>
                    Pagos procesados de forma segura mediante Openpay.
                    <br />
                    Tus datos de tarjeta se tokenizan directamente con Openpay y
                    no son almacenados por MarmolMX.
                    <br />
                    Transacción protegida con sistema antifraude Openpay y 3D
                    Secure.
                  </span>
                </p>
              </section>
            </div>

            <aside className="h-fit border border-[#1F2933]/10 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
              <h2 className="text-2xl font-semibold text-[#1F2933]">
                Resumen del pedido
              </h2>
              <div className="mt-5 grid gap-4">
                {items.map((item) => (
                  <div
                    key={item.product.id}
                    className="flex gap-3 border-b border-[#1F2933]/10 pb-4"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-14 w-14 shrink-0 rounded object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#1F2933]">
                        {item.product.name}
                      </p>
                      <p className="mt-1 text-xs text-[#5f656b]">
                        {item.quantity} × {mxn.format(item.product.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between text-[#1F2933]">
                <span className="font-semibold">Total</span>
                <span className="text-2xl font-semibold">
                  {mxn.format(subtotal)}
                </span>
              </div>
              {error && (
                <p className="mt-4 rounded bg-red-50 p-3 text-sm leading-6 text-red-700">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  isRedirecting3ds ||
                  !isOpenPayReady ||
                  !deviceSessionId
                }
                className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 bg-[#C66A2E] px-4 font-semibold text-white transition hover:bg-[#a95524] disabled:cursor-wait disabled:bg-[#A7A29A]"
              >
                <LockKeyhole className="h-4 w-4" />
                {isRedirecting3ds
                  ? "Redirigiendo a autenticación bancaria segura..."
                  : isSubmitting
                  ? "Procesando pago seguro..."
                  : isOpenPayReady
                    ? "Pagar con Openpay"
                    : "Inicializando Openpay..."}
              </button>
              <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[#5f656b]">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#C66A2E]" />
                Transacción protegida con sistema antifraude Openpay.
              </p>
            </aside>
          </form>
        )}
      </main>
    </div>
  );
}

type CheckoutInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
  maxLength?: number;
  placeholder?: string;
  error?: string;
};

function CheckoutInput({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
  placeholder,
  error,
}: CheckoutInputProps) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#1F2933]">
      {label}
      <input
        required
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        placeholder={placeholder}
        className={`h-12 border bg-[#F5F2EC] px-4 font-normal outline-none transition ${
          error
            ? "border-red-500 focus:border-red-500"
            : "border-[#1F2933]/15 focus:border-[#C66A2E]"
        }`}
      />
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

function CardNumberInput({
  value,
  brand,
  error,
  onChange,
}: {
  value: string;
  brand: CardBrand;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="grid gap-2 text-sm font-semibold text-[#1F2933]">
      Número de tarjeta
      <div className="relative">
        <input
          required
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="cc-number"
          inputMode="numeric"
          placeholder="4242 4242 4242 4242"
          className={`h-12 w-full border bg-[#F5F2EC] px-4 pr-28 font-normal outline-none transition ${
            error
              ? "border-red-500 focus:border-red-500"
              : "border-[#1F2933]/15 focus:border-[#C66A2E]"
          }`}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <CardBrandBadge brand={brand} />
        </div>
      </div>
      {error && <span className="text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

function PaymentTrustMarks() {
  const paymentLogos = [
    {
      label: "Openpay",
      alt: "Openpay by BBVA",
      src: "/payment-logos/openpay-by-bbva.png",
      className: "h-8 w-32",
    },
    {
      label: "Visa",
      alt: "Visa",
      src: "/payment-logos/visa.svg",
      className: "h-8 w-20",
    },
    {
      label: "Mastercard",
      alt: "Mastercard",
      src: "/payment-logos/mastercard.svg",
      className: "h-8 w-24",
    },
    {
      label: "American Express",
      alt: "American Express",
      src: "/payment-logos/american-express.svg",
      className: "h-8 w-24",
    },
  ];
  const banks = [
    "BBVA",
    "Citibanamex",
    "Santander",
    "Banorte",
    "HSBC",
    "Scotiabank",
  ];

  return (
    <div className="mt-5 rounded-lg border border-[#1F2933]/10 bg-[#F5F2EC] p-4">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {paymentLogos.map((logo) => (
          <PaymentLogoTile key={logo.label} {...logo} />
        ))}
      </div>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#C66A2E]">
        Bancos participantes
      </p>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {banks.map((bank) => (
          <span
            key={bank}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#1F2933]/10 bg-white px-3 py-2 text-center text-xs font-bold text-[#5f656b] shadow-sm"
          >
            {bank}
          </span>
        ))}
      </div>
    </div>
  );
}

function PaymentLogoTile({
  label,
  alt,
  src,
  className,
}: {
  label: string;
  alt: string;
  src: string;
  className: string;
}) {
  const [hasImageError, setHasImageError] = useState(false);

  return (
    <span className="inline-flex min-h-16 items-center justify-center rounded-lg border border-[#1F2933]/10 bg-white px-3 py-2 shadow-sm">
      {hasImageError ? (
        <span className="text-center text-xs font-bold uppercase tracking-[0.08em] text-[#1F2933]">
          {label}
        </span>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={160}
          height={64}
          className={`${className} object-contain`}
          onError={() => setHasImageError(true)}
        />
      )}
    </span>
  );
}

function CardPreview({
  brand,
  cardNumber,
  holderName,
  expirationMonth,
  expirationYear,
}: {
  brand: CardBrand;
  cardNumber: string;
  holderName: string;
  expirationMonth: string;
  expirationYear: string;
}) {
  return (
    <div className="relative mt-6 aspect-[1.68/1] w-full max-w-md overflow-hidden rounded-xl bg-[#0F2A3D] p-5 text-white shadow-xl shadow-[#0F2A3D]/20 sm:p-6">
      <div className="absolute inset-x-0 bottom-0 h-1.5 bg-[#C66A2E]" />
      <div className="absolute -right-12 -top-20 h-44 w-44 rounded-full border border-white/10" />
      <div className="absolute -right-4 -top-12 h-44 w-44 rounded-full border border-white/10" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/65">
              MarmolMX Card
            </p>
            <BadgeCheck className="mt-3 h-7 w-7 text-[#C66A2E]" />
          </div>
          <CardBrandBadge brand={brand} variant="dark" />
        </div>
        <div>
          <p className="font-mono text-lg text-white sm:text-xl">
            {maskCardNumber(cardNumber, brand)}
          </p>
          <div className="mt-4 flex items-end justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/55">
                Titular
              </p>
              <p className="mt-1 truncate text-xs font-semibold uppercase sm:text-sm">
                {holderName || "NOMBRE DEL TITULAR"}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-[10px] uppercase tracking-[0.16em] text-white/55">
                Expira
              </p>
              <p className="mt-1 text-xs font-semibold sm:text-sm">
                {expirationMonth || "MM"}/{expirationYear || "AA"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CardBrandBadge({
  brand,
  variant = "light",
}: {
  brand: CardBrand;
  variant?: "light" | "dark";
}) {
  const labels: Record<CardBrand, string> = {
    visa: "VISA",
    mastercard: "MASTERCARD",
    amex: "AMEX",
    unknown: "TARJETA",
  };

  return (
    <span
      className={`inline-flex min-h-6 items-center rounded px-2 py-1 text-[10px] font-bold tracking-[0.08em] ${
        variant === "dark"
          ? "border border-white/20 bg-white/10 text-white"
          : "border border-[#1F2933]/10 bg-white text-[#0F2A3D]"
      }`}
    >
      {labels[brand]}
    </span>
  );
}

function onlyDigits(value: string) {
  return value.replace(/\D/g, "");
}

function detectCardBrand(cardNumber: string): CardBrand {
  if (/^4/.test(cardNumber)) {
    return "visa";
  }

  if (/^3[47]/.test(cardNumber)) {
    return "amex";
  }

  const firstSix = Number(cardNumber.slice(0, 6));
  if (/^5[1-5]/.test(cardNumber) || (firstSix >= 222100 && firstSix <= 272099)) {
    return "mastercard";
  }

  return "unknown";
}

function formatCardNumber(cardNumber: string, brand: CardBrand) {
  const groupSizes = brand === "amex" ? [4, 6, 5] : [4, 4, 4, 4];
  let offset = 0;

  return groupSizes
    .map((size) => {
      const group = cardNumber.slice(offset, offset + size);
      offset += size;
      return group;
    })
    .filter(Boolean)
    .join(" ");
}

function maskCardNumber(cardNumber: string, brand: CardBrand) {
  if (!cardNumber) {
    return "•••• •••• •••• ••••";
  }

  const visibleDigits = cardNumber.slice(-4).padStart(4, "•");
  return brand === "amex"
    ? `•••• •••••• •${visibleDigits}`
    : `•••• •••• •••• ${visibleDigits}`;
}

function isValidExpirationMonth(month: string) {
  const numericMonth = Number(month);
  return month.length === 2 && numericMonth >= 1 && numericMonth <= 12;
}

function validatePaymentFields(form: CheckoutForm, brand: CardBrand) {
  const errors: Record<string, string> = {};
  const cardLength = brand === "amex" ? 15 : 16;
  const cvvLength = brand === "amex" ? 4 : 3;

  if (brand === "unknown" || form.cardNumber.length !== cardLength) {
    errors.cardNumber = "Ingresa un número de tarjeta válido.";
  }

  if (!isValidExpirationMonth(form.expirationMonth)) {
    errors.expirationMonth = "Ingresa un mes entre 01 y 12.";
  }

  if (form.expirationYear.length !== 2) {
    errors.expirationYear = "Usa 2 dígitos.";
  }

  if (form.cvv2.length !== cvvLength) {
    errors.cvv2 =
      brand === "amex" ? "Ingresa el CID de 4 dígitos." : "Ingresa el CVV de 3 dígitos.";
  }

  return errors;
}
