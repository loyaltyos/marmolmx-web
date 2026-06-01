"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "./CartProvider";

export function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const orderNumber = searchParams.get("orderNumber");

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#F5F2EC] px-4 py-12">
      <section className="w-full max-w-xl border border-[#1F2933]/10 bg-white p-7 text-center shadow-xl shadow-[#1F2933]/10 sm:p-10">
        <CheckCircle2 className="mx-auto h-16 w-16 text-[#C66A2E]" />
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-[#C66A2E]">
          Transacción confirmada
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-[#1F2933]">
          Pago aprobado
        </h1>
        <p className="mt-4 leading-7 text-[#5f656b]">
          Recibimos tu pago correctamente. Nuestro equipo dará seguimiento a tu
          solicitud para confirmar detalles, medidas y entrega.
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
        <Link
          href="/"
          className="mt-7 inline-flex bg-[#C66A2E] px-6 py-3 font-semibold text-white transition hover:bg-[#a95524]"
        >
          Volver al inicio
        </Link>
      </section>
    </main>
  );
}
