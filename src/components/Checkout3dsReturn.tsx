"use client";

import { Loader2, ShieldCheck, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type VerificationState = "checking" | "pending" | "failed" | "missing";

export function Checkout3dsReturn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") || "";
  const [state, setState] = useState<VerificationState>("checking");
  const [error, setError] = useState("");

  const verifyPayment = useCallback(async () => {
    if (!orderNumber) {
      setState("missing");
      setError("No encontramos el número de orden para verificar el pago.");
      return;
    }

    setState("checking");
    setError("");

    try {
      const response = await fetch(
        `/api/openpay/verify-charge?orderNumber=${encodeURIComponent(
          orderNumber,
        )}`,
      );
      const result = (await response.json()) as {
        status?: string;
        error?: string;
        order_number?: string;
      };

      if (result.status === "completed") {
        router.replace(
          `/checkout/success?orderNumber=${encodeURIComponent(
            result.order_number || orderNumber,
          )}`,
        );
        return;
      }

      if (result.status === "charge_pending") {
        setState("pending");
        return;
      }

      setState("failed");
      setError(
        result.error ||
          "Tarjeta declinada. Intenta con otro método de pago o comunícate con tu banco.",
      );
    } catch {
      setState("failed");
      setError(
        "Tarjeta declinada. Intenta con otro método de pago o comunícate con tu banco.",
      );
    }
  }, [orderNumber, router]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void verifyPayment();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [verifyPayment]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#F5F2EC] px-4 py-12">
      <section className="w-full max-w-xl border border-[#1F2933]/10 bg-white p-7 text-center shadow-xl shadow-[#1F2933]/10 sm:p-10">
        <div className="mx-auto flex h-20 w-44 items-center justify-center rounded bg-white shadow-sm">
          <Image
            src="/images/logo-marmolmx.png"
            alt="MarmolMX - Proyectos, Construcciones y Remodelaciones"
            width={1280}
            height={678}
            priority
            className="h-full w-full object-contain"
          />
        </div>

        {state === "checking" ? (
          <Loader2 className="mx-auto mt-8 h-14 w-14 animate-spin text-[#C66A2E]" />
        ) : state === "pending" ? (
          <ShieldCheck className="mx-auto mt-8 h-14 w-14 text-[#C66A2E]" />
        ) : (
          <XCircle className="mx-auto mt-8 h-14 w-14 text-red-600" />
        )}

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-[#C66A2E]">
          3D Secure Openpay
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-[#1F2933]">
          Estamos verificando tu pago
        </h1>
        <p className="mt-4 leading-7 text-[#5f656b]">
          {state === "checking"
            ? "Consultando el estado real de tu transacción bancaria segura."
            : state === "pending"
              ? "Pago en validación. La autorización bancaria puede tardar unos momentos."
              : error}
        </p>

        {orderNumber && (
          <div className="mt-6 bg-[#F5F2EC] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5f656b]">
              Número de orden
            </p>
            <p className="mt-2 break-all font-semibold text-[#0F2A3D]">
              {orderNumber}
            </p>
          </div>
        )}

        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          {state === "pending" && (
            <button
              type="button"
              onClick={verifyPayment}
              className="inline-flex bg-[#C66A2E] px-6 py-3 font-semibold text-white transition hover:bg-[#a95524]"
            >
              Reintentar consulta
            </button>
          )}
          <Link
            href="/"
            className="inline-flex justify-center border border-[#1F2933]/15 px-6 py-3 font-semibold text-[#1F2933] transition hover:bg-[#F5F2EC]"
          >
            Volver al inicio
          </Link>
        </div>
      </section>
    </main>
  );
}
