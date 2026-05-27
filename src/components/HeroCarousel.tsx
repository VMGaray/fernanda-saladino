"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function HeroCarousel() {
  const [slides, setSlides] = useState<string[]>([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Pedir las fotos a Supabase al cargar la página
  useEffect(() => {
    async function fetchSlides() {
      try {
        const { data, error } = await supabase
          .from("home_slides")
          .select("image_url")
          .order("id", { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setSlides(data.map((slide) => slide.image_url));
        }
      } catch (err) {
        console.error("Error cargando las imágenes del inicio:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchSlides();
  }, []);

  // 2. Controlar el cambio automático de imágenes
  useEffect(() => {
    if (slides.length <= 1) return; // Si no hay o hay una sola, no hace falta intervalo

    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides]);

  if (loading) {
    return (
      <section className="relative h-[60vh] w-full bg-brand-dark flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-accent/30 border-t-brand-accent rounded-full animate-spin"></div>
      </section>
    );
  }

  // Si no cargó fotos en la base de datos todavía, usa un fondo negro elegante temporal
  const activeSlides = slides.length > 0 ? slides : ["transparent"];

  return (
    <section className="relative h-[60vh] w-full bg-brand-dark overflow-hidden shadow-2xl">
      {/* Slides */}
      {activeSlides.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            index === current ? "opacity-50" : "opacity-0"
          }`}
        >
          {img !== "transparent" && (
            <img
              src={img}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      ))}

      {/* Contenido Fijo (Overlay) */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4 space-y-6">
        <h2
          className="font-extralight uppercase text-white drop-shadow-2xl"
          style={{ fontSize: "clamp(28px, 12vw, 120px)", letterSpacing: "clamp(0.05em, 2vw, 0.3em)" }}
        >
          NUEVA <span className="font-light italic text-brand-accent">COLECCIÓN</span>
        </h2>
        <p className="text-brand-silver text-[10px] md:text-xs tracking-[0.8em] uppercase drop-shadow-md">
          Ediciones Limitadas • 2026
        </p>
        
        {/* Indicadores Minimalistas (Puntitos) - Solo si hay más de un slide */}
        {slides.length > 1 && (
          <div className="absolute bottom-10 flex gap-4">
            {slides.map((_, i) => (
              <div
                key={i}
                className={`h-[2px] w-8 transition-all duration-500 ${
                  i === current ? "bg-brand-accent w-12" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}