"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { productCategories, products, type Product } from "@/data/products";
import { ProductCard } from "./ProductCard";

type ProductCatalogProps = {
  onAddToCart: (product: Product) => void;
};

export function ProductCatalog({ onAddToCart }: ProductCatalogProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Todos");

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesCategory =
        category === "Todos" || product.category === category;
      const matchesSearch = product.name.toLowerCase().includes(normalizedSearch);
      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <section id="productos" className="bg-[#F5F2EC] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C66A2E]">
              Catálogo
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-normal text-[#1F2933] sm:text-5xl">
              Productos destacados
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[#5f656b]">
              Materiales y soluciones para proyectos de construcción,
              remodelación y acabados premium, listos para evolucionar hacia
              maquinaria, insumos industriales o productos de alto valor.
            </p>
          </div>

          <div className="grid gap-3 sm:gap-4">
            <label className="relative block">
              <span className="sr-only">Buscar producto</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#A7A29A]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar por nombre"
                className="h-13 w-full border border-[#1F2933]/12 bg-white py-3 pl-12 pr-4 text-[#1F2933] outline-none transition placeholder:text-[#A7A29A] focus:border-[#C66A2E]"
              />
            </label>
            <div className="scrollbar-hidden flex snap-x gap-2 overflow-x-auto pb-1">
              {productCategories.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  className={`h-10 shrink-0 snap-start rounded-full border px-4 text-sm font-semibold transition ${
                    category === item
                      ? "border-[#0F2A3D] bg-[#0F2A3D] text-white"
                      : "border-[#1F2933]/12 bg-white text-[#1F2933] hover:border-[#C66A2E]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="mt-10 border border-[#1F2933]/10 bg-white p-8 text-center text-[#5f656b]">
            No encontramos productos con esos criterios.
          </div>
        )}
      </div>
    </section>
  );
}
