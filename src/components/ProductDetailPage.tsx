"use client";

import {
  ArrowLeft,
  CheckCircle2,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { createProductWhatsAppUrl } from "@/lib/whatsapp";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "./CartProvider";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { ProductCard } from "./ProductCard";

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

export function ProductDetailPage({
  product,
  relatedProducts,
}: {
  product: Product;
  relatedProducts: Product[];
}) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, cartCount, addToCart, increase, decrease, remove } = useCart();

  const addAndOpenCart = (selectedProduct: Product) => {
    addToCart(selectedProduct);
    setIsCartOpen(true);
  };

  return (
    <>
      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      <main className="bg-[#F5F2EC] pt-20">
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
          <Link
            href="/#productos"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0F2A3D] transition hover:text-[#C66A2E]"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al catálogo
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="overflow-hidden border border-[#1F2933]/10 bg-white shadow-sm">
              <div className="aspect-[4/3] overflow-hidden bg-[#0F2A3D]">
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="grid grid-cols-3 gap-px bg-[#1F2933]/10">
                {product.applications.slice(0, 3).map((application) => (
                  <div
                    key={application}
                    className="bg-white px-3 py-4 text-center text-xs font-semibold uppercase tracking-[0.1em] text-[#5f656b]"
                  >
                    {application}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C66A2E]">
                {product.category}
              </p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-[#1F2933] sm:text-5xl">
                {product.name}
              </h1>
              <p className="mt-5 text-lg leading-8 text-[#5f656b]">
                {product.longDescription}
              </p>
              <div className="mt-7 border-y border-[#1F2933]/10 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#5f656b]">
                  Precio estimado
                </p>
                <p className="mt-2 text-3xl font-semibold text-[#0F2A3D]">
                  {mxn.format(product.price)}{" "}
                  <span className="text-sm font-medium text-[#A7A29A]">MXN</span>
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => addAndOpenCart(product)}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-[#C66A2E] px-5 font-semibold text-white transition hover:bg-[#a95524]"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Agregar al carrito
                </button>
                <a
                  href={createProductWhatsAppUrl(product)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded bg-[#25D366] px-5 font-semibold text-[#0F2A3D] transition hover:bg-[#1fbd59]"
                >
                  <MessageCircle className="h-5 w-5" />
                  Solicitar por WhatsApp
                </a>
              </div>
              <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-[#5f656b]">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#C66A2E]" />
                La cotización final se confirma según medidas, instalación y
                alcance del proyecto.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
            <ProductList
              title="Especificaciones"
              icon={<PackageCheck className="h-5 w-5" />}
              items={product.specifications}
            />
            <ProductList
              title="Aplicaciones recomendadas"
              icon={<ShieldCheck className="h-5 w-5" />}
              items={product.applications}
            />
            <ProductList
              title="Beneficios"
              icon={<CheckCircle2 className="h-5 w-5" />}
              items={product.benefits}
            />
          </div>
        </section>

        <section className="py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C66A2E]">
              Explora más
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-[#1F2933] sm:text-4xl">
              Productos relacionados
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onAddToCart={addAndOpenCart}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <CartDrawer
        isOpen={isCartOpen}
        items={items}
        onClose={() => setIsCartOpen(false)}
        onIncrease={increase}
        onDecrease={decrease}
        onRemove={remove}
      />
    </>
  );
}

function ProductList({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: string[];
}) {
  return (
    <div>
      <div className="flex items-center gap-3 text-[#C66A2E]">
        {icon}
        <h2 className="text-xl font-semibold text-[#1F2933]">{title}</h2>
      </div>
      <ul className="mt-5 grid gap-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-sm leading-6 text-[#5f656b]">
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#C66A2E]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
