"use client";
import { use, useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import ProductImageGallery from "./ProductImageGallery";

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image_url: string;
  images: string[] | null;
  stock: number;
  featured: boolean;
  slug: string;
}
// Interfaz más ligera para productos relacionados
interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
  slug: string;
  category: string;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetail({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [addedToCart, setAddedToCart] = useState(false);
  const [related, setRelated] = useState<RelatedProduct[]>([]);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("slug", slug)
        .single();

      setProduct(data);
      setLoading(false);
    }
    fetchProduct();
  }, [slug]);

  useEffect(() => {
  if (!product) return;

  async function fetchRelated() {
    const { data } = await supabase
      .from("products")
      .select("id, name, price, image_url, slug, category")
      .eq("category", product!.category)
      .neq("id", product!.id)
      .limit(4);

    setRelated((data ?? []).map(p => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image_url: p.image_url,
      slug: p.slug,
      category: p.category,
    })));
  }

  fetchRelated();
}, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      category: product.category,
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-brand-black text-brand-light flex items-center justify-center">
        <p className="text-brand-silver tracking-[0.4em] uppercase text-xs animate-pulse">
          Cargando...
        </p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-brand-black text-brand-light flex flex-col items-center justify-center gap-8 px-6 text-center">
        <h2
          className="text-2xl tracking-[0.3em] uppercase text-brand-silver"
          style={{ wordBreak: "break-word", hyphens: "auto" }}
        >
          Producto no encontrado
        </h2>
        <Link
          href="/"
          className="text-brand-accent hover:underline tracking-widest text-xs"
        >
          Volver al inicio
        </Link>
      </main>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hola Fernanda! Me interesa el producto:\n\n📦 ${product.name}\n💰 $${Number(product.price).toLocaleString("es-AR")}\n\n¿Está disponible?`
  );
  const whatsappLink = `https://wa.me/5491151818438?text=${whatsappMessage}`;

  const productImages = product.images?.length ? product.images : [product.image_url];

  return (
    <main className="min-h-screen bg-brand-black text-brand-light">
      <div className="container mx-auto px-6 py-12 md:py-20">

        {/* Breadcrumb */}
        <div className="mb-10 text-[9px] tracking-[0.3em] uppercase text-brand-silver/50 flex items-center gap-2">
          <Link href="/" className="hover:text-brand-accent transition-colors">Inicio</Link>
          <span>/</span>
          <Link
            href={`/categoria/${product.category.toLowerCase().replace(/ /g, "-")}`}
            className="hover:text-brand-accent transition-colors"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-brand-light/70">{product.name}</span>
        </div>

        {/* Grid principal */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-24">

          {/* IZQUIERDA: Galería */}
          <div>
            <ProductImageGallery
              images={productImages}
              productName={product.name}
            />
          </div>

          {/* DERECHA: Info */}
          <div className="flex flex-col justify-center space-y-8">

            {/* Nombre y categoría */}
            <div style={{ borderBottom: "1px solid rgba(212,175,55,0.1)", paddingBottom: "24px" }}>
              {/* Botón favorito */}
              <button
                onClick={() => toggleFavorite(product.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  marginBottom: "16px",
                  color: isFavorite(product.id) ? "#D4AF37" : "rgba(192,192,192,0.4)",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = isFavorite(product.id) ? "#F5F5F7" : "#D4AF37")}
                onMouseLeave={e => (e.currentTarget.style.color = isFavorite(product.id) ? "#D4AF37" : "rgba(192,192,192,0.4)")}
              >
                <svg width="16" height="16" fill={isFavorite(product.id) ? "#D4AF37" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.4} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span style={{ fontSize: "8.5px", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 300 }}>
                  {isFavorite(product.id) ? "En favoritos" : "Agregar a favoritos"}
                </span>
              </button>

              {product.featured && (
                <span
                  className="inline-block mb-4 text-[8px] tracking-[0.4em] uppercase"
                  style={{
                    color: "#D4AF37",
                    border: "1px solid rgba(212,175,55,0.3)",
                    padding: "3px 10px",
                  }}
                >
                  Destacado
                </span>
              )}
              <h1
                className="font-light uppercase mb-3"
                style={{ fontSize: "clamp(24px, 4vw, 36px)", letterSpacing: "0.25em" }}
              >
                {product.name}
              </h1>
              <p className="text-[10px] tracking-[0.4em] uppercase text-brand-silver/60">
                {product.category}
              </p>
            </div>

            {/* Precio */}
            <div>
              <p className="text-[10px] tracking-[0.3em] uppercase text-brand-silver/60 mb-2">Precio</p>
              <p
                className="font-light text-brand-accent"
                style={{ fontSize: "clamp(32px, 5vw, 48px)", letterSpacing: "0.05em" }}
              >
                ${Number(product.price).toLocaleString("es-AR")}
              </p>
            </div>

            {/* Descripción */}
            <div style={{ borderTop: "1px solid rgba(212,175,55,0.08)", paddingTop: "24px" }}>
              <p className="text-sm leading-relaxed text-brand-light/70" style={{ letterSpacing: "0.05em" }}>
                {product.description ||
                  "Producto artesanal confeccionado en cuero argentino de primera calidad. Cada pieza es única y elaborada con técnicas tradicionales de marroquinería."}
              </p>
            </div>

            {/* Características fijas */}
            <div className="space-y-2" style={{ borderTop: "1px solid rgba(212,175,55,0.08)", paddingTop: "20px" }}>
              {["100% Cuero Argentino", "Confección Artesanal", "Diseño Exclusivo", "Edición Limitada"].map(feat => (
                <div key={feat} className="flex items-center gap-3">
                  <span style={{ color: "#D4AF37", fontSize: "10px" }}>—</span>
                  <p className="text-xs tracking-wider text-brand-silver/70">{feat}</p>
                </div>
              ))}
            </div>

            {/* Stock */}
            {product.stock !== null && (
              <p className="text-[9px] tracking-[0.3em] uppercase"
                style={{ color: product.stock > 0 ? "rgba(74,222,128,0.7)" : "rgba(248,113,113,0.7)" }}
              >
                {product.stock > 0 ? `${product.stock} disponible${product.stock > 1 ? "s" : ""}` : "Sin stock"}
              </p>
            )}

            {/* Botones */}
            <div className="space-y-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="block w-full py-4 tracking-[0.3em] uppercase text-xs font-bold transition-all"
                style={{
                  background: addedToCart ? "#16a34a" : product.stock === 0 ? "rgba(245,245,247,0.1)" : "#D4AF37",
                  color: addedToCart || product.stock === 0 ? "#F5F5F7" : "#121212",
                  cursor: product.stock === 0 ? "not-allowed" : "pointer",
                }}
              >
                {addedToCart ? "✓ Agregado al Carrito" : product.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
              </button>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-4 tracking-[0.3em] uppercase text-xs transition-all"
                style={{
                  border: "1px solid rgba(212,175,55,0.35)",
                  color: "#D4AF37",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#D4AF37";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#121212";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37";
                }}
              >
                Consultar Disponibilidad
              </a>

              <Link
                href={`/categoria/${product.category.toLowerCase().replace(/ /g, "-")}`}
                className="block w-full text-center py-3 tracking-[0.2em] uppercase text-[10px] transition-all"
                style={{ border: "1px solid rgba(192,192,192,0.15)", color: "rgba(192,192,192,0.5)" }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.4)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(192,192,192,0.15)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "rgba(192,192,192,0.5)";
                }}
              >
                Ver más en {product.category}
              </Link>
            </div>

            {/* Info envío */}
            <div
              className="pt-6"
              style={{ borderTop: "1px solid rgba(212,175,55,0.08)" }}
            >
              <p className="text-[9px] tracking-[0.25em] uppercase leading-6 text-brand-silver/40">
                Envíos a todo el país · Embalaje de regalo incluido · Atención por WhatsApp
              </p>
            </div>

          </div>
        </div>

        {/* Productos relacionados */}
        {related.length > 0 && (
          <div className="mt-32" style={{ borderTop: "1px solid rgba(212,175,55,0.08)", paddingTop: "80px" }}>
            <h3
              className="font-light uppercase text-center mb-12"
              style={{ fontSize: "22px", letterSpacing: "0.4em" }}
            >
              También te puede{" "}
              <span style={{ color: "#D4AF37" }}>interesar</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {related.map((item) => (
                <Link
                  key={item.id}
                  href={`/producto/${item.slug || item.id}`}
                  className="group cursor-pointer block"
                >
                  <div className="aspect-[4/5] overflow-hidden mb-3 relative bg-brand-dark border border-transparent group-hover:border-brand-accent/25 transition-all duration-500">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="text-center space-y-1">
                    <h4
                      className="text-[11px] uppercase transition-colors duration-200 group-hover:text-brand-accent"
                      style={{ letterSpacing: "0.2em" }}
                    >
                      {item.name}
                    </h4>
                    <p className="text-brand-accent text-xs tracking-widest">
                      ${Number(item.price).toLocaleString("es-AR")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}