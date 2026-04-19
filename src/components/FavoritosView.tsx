"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useFavorites } from "../context/FavoritesContext";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  featured: boolean;
  stock: number;
  slug: string;
}

export default function FavoritosView() {
  const { favorites } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) {
      setLoading(false);
      return;
    }
    supabase
      .from("products")
      .select("*")
      .in("id", favorites)
      .then(({ data }) => {
        setProducts((data as Product[]) ?? []);
        setLoading(false);
      });
  }, [favorites]);

  return (
    <main className="min-h-screen bg-brand-black text-brand-light">
      <div className="container mx-auto px-6 py-20">

        {/* Título */}
        <div className="text-center mb-16" style={{ borderBottom: "1px solid rgba(212,175,55,0.08)", paddingBottom: "40px" }}>
          <p className="text-[9px] tracking-[0.5em] uppercase text-brand-silver/40 mb-3">Mi Lista</p>
          <h2 className="font-light uppercase" style={{ fontSize: "clamp(22px, 4vw, 36px)", letterSpacing: "0.4em" }}>
            Favoritos
          </h2>
        </div>

        {loading ? (
          <div className="py-32 text-center">
            <p className="text-brand-silver/40 tracking-[0.4em] uppercase text-[10px] animate-pulse">
              Cargando...
            </p>
          </div>
        ) : favorites.length === 0 || products.length === 0 ? (
          <div className="py-32 text-center space-y-8">
            <p className="text-brand-silver/40 tracking-[0.3em] uppercase text-[10px]">
              Todavía no agregaste productos a tus favoritos.
            </p>
            <Link
              href="/categoria/carteras"
              style={{
                display: "inline-block",
                padding: "12px 32px",
                border: "1px solid rgba(212,175,55,0.35)",
                color: "#D4AF37",
                fontSize: "9px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 300,
                textDecoration: "none",
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = "rgba(212,175,55,0.08)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#D4AF37";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.35)";
              }}
            >
              Ver Carteras
            </Link>
          </div>
        ) : (
          <>
            <p className="text-[9px] tracking-[0.3em] uppercase text-brand-silver/40 mb-12 text-right">
              {products.length} {products.length === 1 ? "producto" : "productos"}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {products.map(product => (
                <Link
                  key={product.id}
                  href={`/producto/${product.slug || product.id}`}
                  className="group cursor-pointer block"
                >
                  <div className="aspect-[4/5] overflow-hidden mb-5 relative bg-brand-dark border border-transparent group-hover:border-brand-accent/25 transition-all duration-500">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                    {product.featured && (
                      <span
                        className="absolute top-3 left-3 text-[8px] tracking-[0.3em] uppercase"
                        style={{ background: "#121212", color: "#D4AF37", border: "1px solid rgba(212,175,55,0.4)", padding: "3px 8px" }}
                      >
                        Destacado
                      </span>
                    )}
                    {product.stock === 0 && (
                      <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(18,18,18,0.7)" }}>
                        <span className="text-[9px] tracking-[0.4em] uppercase text-brand-silver/60">Sin stock</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="text-[11px] uppercase transition-colors duration-200 group-hover:text-brand-accent" style={{ letterSpacing: "0.2em" }}>
                      {product.name}
                    </h3>
                    <p className="text-brand-accent text-xs tracking-widest">
                      ${Number(product.price).toLocaleString("es-AR")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
