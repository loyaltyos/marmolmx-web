"use client";

import { MessageCircle, Minus, Plus, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { createCartWhatsAppUrl } from "@/lib/whatsapp";
import type { CartItem } from "./CartProvider";

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

type CartDrawerProps = {
  isOpen: boolean;
  items: CartItem[];
  onClose: () => void;
  onIncrease: (productId: number) => void;
  onDecrease: (productId: number) => void;
  onRemove: (productId: number) => void;
};

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onIncrease,
  onDecrease,
  onRemove,
}: CartDrawerProps) {
  const router = useRouter();
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return (
    <>
      <div
        className={`fixed inset-0 z-[70] bg-black/45 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed right-0 top-0 z-[80] flex h-dvh w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between gap-3 border-b border-[#1F2933]/10 px-4 py-4 sm:px-5 sm:py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#C66A2E]">
              Carrito
            </p>
            <h2 className="text-xl font-semibold text-[#1F2933] sm:text-2xl">
              Solicitud de productos
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center border border-[#1F2933]/10 text-[#1F2933] transition hover:bg-[#F5F2EC]"
            aria-label="Cerrar carrito"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5">
          {items.length === 0 ? (
            <div className="grid min-h-72 place-items-center border border-dashed border-[#1F2933]/20 bg-[#F5F2EC] p-6 text-center">
              <p className="text-[#5f656b]">
                Agrega productos para preparar una solicitud de cotización.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="border border-[#1F2933]/10 p-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-20 w-20 shrink-0 object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-[#1F2933]">
                        {item.product.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#A7A29A]">
                        {item.product.category}
                      </p>
                      <p className="mt-2 font-semibold text-[#0F2A3D]">
                        {mxn.format(item.product.price)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center border border-[#1F2933]/10">
                      <button
                        type="button"
                        onClick={() => onDecrease(item.product.id)}
                        className="grid h-10 w-10 place-items-center text-[#1F2933] transition hover:bg-[#F5F2EC]"
                        aria-label="Disminuir cantidad"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="grid h-10 min-w-11 place-items-center border-x border-[#1F2933]/10 text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onIncrease(item.product.id)}
                        className="grid h-10 w-10 place-items-center text-[#1F2933] transition hover:bg-[#F5F2EC]"
                        aria-label="Aumentar cantidad"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(item.product.id)}
                      className="grid h-10 w-10 place-items-center border border-[#1F2933]/10 text-[#9f3f24] transition hover:bg-[#F5F2EC]"
                      aria-label="Eliminar producto"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-[#1F2933]/10 p-4 sm:p-5">
          <div className="flex items-center justify-between text-[#1F2933]">
            <span className="font-semibold">Subtotal</span>
            <span className="text-2xl font-semibold">{mxn.format(subtotal)}</span>
          </div>
          <p className="mt-2 text-sm text-[#5f656b]">
            Total estimado en MXN. La cotización final puede variar por medidas,
            instalación y alcance de obra.
          </p>
          <button
            type="button"
            onClick={() => router.push("/checkout")}
            disabled={items.length === 0}
            className="mt-5 h-12 w-full bg-[#C66A2E] font-semibold text-white transition hover:bg-[#a95524] disabled:cursor-not-allowed disabled:bg-[#A7A29A]"
          >
            Continuar al checkout
          </button>
          {items.length > 0 && (
            <a
              href={createCartWhatsAppUrl(items)}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex h-12 w-full items-center justify-center gap-2 rounded bg-[#25D366] px-4 font-semibold text-[#0F2A3D] transition hover:bg-[#1fbd59]"
            >
              <MessageCircle className="h-5 w-5" />
              Solicitar por WhatsApp
            </a>
          )}
        </div>
      </aside>
    </>
  );
}
