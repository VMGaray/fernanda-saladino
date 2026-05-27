"use client";
import Link from "next/link";
import Tilt from "react-parallax-tilt";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  slug?: string;
  featured?: boolean;
  stock?: number;
}

export default function ProductCard3D({ product }: { product: Product }) {
  return (
    <Tilt
      glareEnable={true}
      glareMaxOpacity={0.12}
      glareColor="#ffffff"
      glarePosition="all"
      tiltMaxAngleX={6}
      tiltMaxAngleY={6}
      perspective={1200}
      transitionSpeed={2000}
      className="block"
    >
      <Link
        href={`/producto/${product.slug || product.id}`}
        className="group cursor-pointer block bg-brand-dark/30 p-3 border border-brand-accent/5 transition-all duration-500 hover:border-brand-accent/20 hover:shadow-[0_30px_60px_rgba(212,175,55,0.03)]"
      >
        {/* Contenedor de Imagen */}
        <div className="aspect-[3/4] md:aspect-[4/5] overflow-hidden mb-4 relative bg-brand-dark border border-transparent group-hover:border-brand-accent/15 transition-all duration-500">
          <img
            src={product.image_url}
            alt={product.name}
            className="object-cover w-full h-full transition-transform duration-1000 ease-out group-hover:scale-103"
          />
          
          {/* Badge Destacado */}
          {product.featured && (
            <span
              className="absolute top-3 left-3 text-[8px] tracking-[0.3em] uppercase"
              style={{
                background: "#121212",
                color: "#D4AF37",
                border: "1px solid rgba(212,175,55,0.4)",
                padding: "3px 8px",
              }}
            >
              Destacado
            </span>
          )}

          {/* Badge Sin Stock */}
          {product.stock === 0 && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(18,18,18,0.7)" }}
            >
              <span className="text-[9px] tracking-[0.4em] uppercase text-brand-silver/60">
                Sin stock
              </span>
            </div>
          )}
        </div>

        {/* Info del Producto */}
        <div className="text-center space-y-1 py-2">
          <h3
            className="text-[11px] uppercase transition-colors duration-300 group-hover:text-brand-accent"
            style={{ letterSpacing: "0.25em" }}
          >
            {product.name}
          </h3>
          <p className="text-brand-accent text-xs font-light tracking-widest">
            ${Number(product.price).toLocaleString("es-AR")}
          </p>
        </div>
      </Link>
    </Tilt>
  );
}