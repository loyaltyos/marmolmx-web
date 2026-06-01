"use client";

import { useState } from "react";
import { About } from "./About";
import { CartDrawer } from "./CartDrawer";
import { useCart } from "./CartProvider";
import { Contact } from "./Contact";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { Hero } from "./Hero";
import { ProductCatalog } from "./ProductCatalog";
import { ProjectsGallery } from "./ProjectsGallery";
import { Services } from "./Services";
import type { Product } from "@/data/products";

export function HomePage() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { items, cartCount, addToCart, increase, decrease, remove } = useCart();

  const addAndOpenCart = (product: Product) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  return (
    <>
      <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
      <main>
        <Hero />
        <About />
        <Services />
        <ProductCatalog onAddToCart={addAndOpenCart} />
        <ProjectsGallery />
        <Contact />
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
