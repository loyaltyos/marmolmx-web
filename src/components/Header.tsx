"use client";

import { Menu, ShoppingCart, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Inicio", href: "#inicio" },
  { label: "Quiénes Somos", href: "#quienes-somos" },
  { label: "Servicios", href: "#servicios" },
  { label: "Productos", href: "#productos" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Contacto", href: "#contacto" },
];

type HeaderProps = {
  cartCount: number;
  onCartClick: () => void;
};

export function Header({ cartCount, onCartClick }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        hasScrolled
          ? "border-b border-white/10 bg-[#0F2A3D]/95 shadow-xl shadow-black/10 backdrop-blur"
          : "bg-[#0F2A3D]/55 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a
          href="#inicio"
          className="flex h-14 w-[116px] shrink-0 items-center justify-center rounded bg-white px-1.5 py-1 shadow-sm sm:w-[144px]"
          aria-label="MarmolMX inicio"
        >
          <Image
            src="/images/logo-marmolmx.png"
            alt="MarmolMX - Proyectos, Construcciones y Remodelaciones"
            width={1280}
            height={678}
            priority
            className="h-full w-full object-contain"
          />
        </a>

        <nav className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-white/80 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={onCartClick}
            className="relative grid h-11 w-11 place-items-center rounded border border-white/20 text-white transition hover:border-white/40 hover:bg-white/10"
            aria-label="Abrir carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-[#C66A2E] px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          <a
            href="#contacto"
            className="rounded bg-[#C66A2E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#a95524]"
          >
            Cotizar Proyecto
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={onCartClick}
            className="relative grid h-11 w-11 place-items-center rounded border border-white/20 text-white"
            aria-label="Abrir carrito"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-[#C66A2E] px-1 text-xs font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setIsMenuOpen((value) => !value)}
            className="grid h-11 w-11 place-items-center rounded border border-white/20 text-white"
            aria-label="Abrir menú"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#0F2A3D] px-4 py-5 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="rounded px-3 py-3 text-sm font-medium text-white/85 transition hover:bg-white/10 hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contacto"
              onClick={() => setIsMenuOpen(false)}
              className="mt-2 rounded bg-[#C66A2E] px-4 py-3 text-center text-sm font-semibold text-white"
            >
              Cotizar Proyecto
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
