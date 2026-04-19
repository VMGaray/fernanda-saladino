"use client";
import { useState } from "react";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Si no hay imágenes, mostrar solo la imagen principal
  const imageList = images && images.length > 0 ? images : [];

  return (
    <div className="space-y-4">
      {/* Imagen principal */}
      <div className="relative aspect-[4/5] bg-brand-dark overflow-hidden border border-brand-accent/10 shadow-2xl">
        <img
          src={imageList[selectedImage] || images[0]}
          alt={`${productName} - Imagen ${selectedImage + 1}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
        />

        {/* Badge "Hecho a mano" */}
        <div className="absolute top-6 left-6 bg-brand-accent/90 backdrop-blur-sm px-4 py-2">
          <p className="text-[8px] tracking-[0.4em] uppercase text-brand-black font-semibold">
            Hecho a Mano
          </p>
        </div>

        {/* Navegación entre imágenes (si hay más de una) */}
        {imageList.length > 1 && (
          <>
            <button
              onClick={() => setSelectedImage((prev) => (prev === 0 ? imageList.length - 1 : prev - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 transition-all backdrop-blur-sm"
              aria-label="Imagen anterior"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedImage((prev) => (prev === imageList.length - 1 ? 0 : prev + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 transition-all backdrop-blur-sm"
              aria-label="Imagen siguiente"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Miniaturas (thumbnails) */}
      {imageList.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {imageList.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-brand-accent"
                  : "border-brand-accent/20 hover:border-brand-accent/50"
              }`}
            >
              <img
                src={image}
                alt={`${productName} - Miniatura ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
