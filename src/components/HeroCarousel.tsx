"use client";
import { useState, useEffect } from "react";

const slides = [
  "/home/slide1.jpg",
  "/home/slide2.jpg",
  "/home/slide3.jpg",
  "/home/slide4.jpg",
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[60vh] w-full bg-brand-dark overflow-hidden shadow-2xl">
      {/* Slides */}
      {slides.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
            index === current ? "opacity-50" : "opacity-0"
          }`}
        >
          <img
            src={img}
            alt={`Slide ${index}`}
            className="w-full h-full object-cover"
          />
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
        
        {/* Indicadores Minimalistas (Puntitos) */}
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
      </div>
    </section>
  );
}