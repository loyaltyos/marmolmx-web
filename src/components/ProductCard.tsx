"use client";

import { Eye, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

type ProductCardProps = {
  product: Product;
  onAddToCart: (product: Product) => void;
};

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="group flex h-full flex-col overflow-hidden border border-[#1F2933]/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#1F2933]/10">
      <div className="relative aspect-[16/9] overflow-hidden bg-[#0F2A3D] sm:aspect-[4/3]">
        {!imageFailed ? (
          <img
            src={product.image}
            alt={product.name}
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="grid h-full place-items-center bg-gradient-to-br from-[#0F2A3D] via-[#1F2933] to-[#A7A29A] p-6 text-center text-white">
            <span className="text-sm font-semibold uppercase tracking-[0.2em]">
              {product.category}
            </span>
          </div>
        )}
        <span className="absolute left-3 top-3 bg-[#F5F2EC] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#1F2933] sm:left-4 sm:top-4 sm:px-3 sm:text-xs">
          {product.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-lg font-semibold text-[#1F2933] sm:text-xl">
          {product.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-6 text-[#5f656b] sm:mt-3">
          {product.description}
        </p>
        <div className="mt-4 flex items-center justify-between gap-4 sm:mt-5">
          <span className="text-lg font-semibold text-[#0F2A3D] sm:text-xl">
            {mxn.format(product.price)}
          </span>
          <span className="text-xs font-medium text-[#A7A29A]">MXN</span>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5">
          <Link
            href={`/productos/${product.slug}`}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 border border-[#1F2933]/15 px-2 text-xs font-semibold text-[#1F2933] transition hover:border-[#0F2A3D] hover:bg-[#F5F2EC] sm:min-h-11 sm:gap-2 sm:px-4 sm:text-sm"
          >
            <Eye className="h-4 w-4" />
            Ver detalle
          </Link>
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 bg-[#C66A2E] px-2 text-xs font-semibold text-white transition hover:bg-[#a95524] sm:min-h-11 sm:gap-2 sm:px-4 sm:text-sm"
          >
            <ShoppingCart className="h-4 w-4" />
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
