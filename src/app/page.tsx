export const dynamic = 'force-dynamic';

import Header from "../components/Header";
import HeroCarousel from "../components/HeroCarousel";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-light">
      <Header />

      {/* Sección 1: Portada con Carrusel Dinámico */}
      <HeroCarousel />

      {/* Sección 2: Botón de Explorar */}
      <section className="py-32 flex justify-center bg-brand-black">
        <Link
          href="/catalogo"
          className="group relative px-16 py-5 overflow-hidden border border-brand-accent/30 transition-all duration-700 hover:border-brand-accent"
        >
          <span className="absolute inset-0 bg-brand-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out"></span>
          <span className="relative z-10 text-[11px] tracking-[0.6em] uppercase text-brand-accent group-hover:text-brand-black transition-colors duration-500">
            Explorar Catálogo
          </span>
        </Link>
      </section>
    </main>
  );
}
