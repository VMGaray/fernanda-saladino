"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  slug: string;
  category: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      setSearched(false);
      return;
    }
    setTimeout(() => inputRef.current?.focus(), 80);
  }, [isOpen]);

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const { data } = await supabase
        .from("products")
        .select("id, name, price, image_url, slug, category")
        .or(`name.ilike.%${trimmed}%,description.ilike.%${trimmed}%,category.ilike.%${trimmed}%`)
        .limit(8);
      setResults(data ?? []);
      setSearched(true);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  const handleSelect = (slug: string) => {
    router.push(`/producto/${slug}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-start justify-center pt-[12vh]"
      style={{ background: "rgba(0,0,0,0.8)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl mx-4 flex flex-col"
        style={{
          background: "#181818",
          maxHeight: "70vh",
          animation: "searchSlideIn 0.2s ease",
        }}
        onClick={e => e.stopPropagation()}
      >
        <style>{`
          @keyframes searchSlideIn {
            from { opacity: 0; transform: translateY(-12px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>

        {/* Input */}
        <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: "1px solid rgba(212,175,55,0.3)" }}>
          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: "rgba(212,175,55,0.6)", flexShrink: 0 }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar productos..."
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: "#F5F5F7",
              fontSize: "13px",
              letterSpacing: "0.05em",
              fontWeight: 300,
            }}
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(192,192,192,0.4)", padding: 0, lineHeight: 1 }}
            >
              <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Resultados */}
        <div className="overflow-y-auto">
          {loading && (
            <div className="px-5 py-8 text-center">
              <p style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(192,192,192,0.4)" }}>
                Buscando...
              </p>
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="px-5 py-10 text-center">
              <p style={{ fontSize: "10px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(192,192,192,0.4)" }}>
                No encontramos productos para tu búsqueda
              </p>
            </div>
          )}

          {!loading && results.length > 0 && results.map((product, i) => (
            <button
              key={product.id}
              onClick={() => handleSelect(product.slug || product.id)}
              className="w-full flex items-center gap-4 text-left transition-colors duration-150"
              style={{
                padding: "12px 20px",
                background: "transparent",
                border: "none",
                borderBottom: i < results.length - 1 ? "1px solid rgba(245,245,247,0.04)" : "none",
                cursor: "pointer",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(212,175,55,0.06)")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              {/* Thumbnail */}
              <div style={{ width: 44, height: 44, flexShrink: 0, background: "#121212", overflow: "hidden" }}>
                {product.image_url && (
                  <img src={product.image_url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p style={{ fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#F5F5F7", fontWeight: 300, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {product.name}
                </p>
                <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(192,192,192,0.45)", marginTop: "2px" }}>
                  {product.category}
                </p>
              </div>

              {/* Precio */}
              <p style={{ fontSize: "12px", letterSpacing: "0.05em", color: "#D4AF37", fontWeight: 300, flexShrink: 0 }}>
                ${Number(product.price).toLocaleString("es-AR")}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
