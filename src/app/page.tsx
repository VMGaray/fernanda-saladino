import HeroCarousel from "../components/HeroCarousel";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-black text-brand-light">

      {/* SECCIÓN 1: Portada Fija Impactante 
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden border-b border-brand-accent/5">
        <div className="absolute inset-0 bg-[url('/hero-cartera.jpg')] bg-cover bg-center opacity-60"></div>
      </section>*/}

      {/* SECCIÓN 2: El Carrusel de Fotos */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4 md:px-20">
          <HeroCarousel />
        </div>
      </section>

      {/* SECCIÓN 3: Botón Explorar */}
      <section className="py-10 flex justify-center bg-brand-black">
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

      <footer className="py-10 text-center border-t border-brand-accent/5">
        <p className="text-[9px] tracking-[0.5em] text-brand-silver/50 uppercase">
          Fernanda Saladino • Hecho a Mano en Argentina
        </p>
      </footer>

    </main>
  );
}