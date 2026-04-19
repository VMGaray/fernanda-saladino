import { supabase } from "../lib/supabase";
import Link from "next/link";

interface CategoryViewProps {
  slug: string;
}

export default async function CategoryView({ slug }: CategoryViewProps) {
  const safeSlug = slug || "";
  const categoryName = safeSlug.replace(/-/g, " ");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .ilike("category", categoryName)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-6 py-20">

      {/* Título */}
      <div className="text-center mb-16" style={{ borderBottom: "1px solid rgba(212,175,55,0.08)", paddingBottom: "40px" }}>
        <p className="text-[9px] tracking-[0.5em] uppercase text-brand-silver/40 mb-3">Colección</p>
        <h2
          className="font-light uppercase"
          style={{ fontSize: "clamp(22px, 4vw, 36px)", letterSpacing: "0.4em" }}
        >
          {categoryName}
        </h2>
      </div>

      {!products || products.length === 0 ? (
        <div className="py-32 text-center">
          <p className="text-brand-silver/40 tracking-[0.4em] uppercase text-[10px]">
            Próximamente nuevos ingresos en esta categoría
          </p>
        </div>
      ) : (
        <>
          {/* Contador */}
          <p className="text-[9px] tracking-[0.3em] uppercase text-brand-silver/40 mb-12 text-right">
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </p>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/producto/${product.slug || product.id}`}
                className="group cursor-pointer block"
              >
                {/* Imagen */}
                <div className="aspect-[4/5] overflow-hidden mb-5 relative bg-brand-dark border border-transparent group-hover:border-brand-accent/25 transition-all duration-500">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                  />
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

                {/* Info */}
                <div className="text-center space-y-1">
                  <h3
                    className="text-[11px] uppercase transition-colors duration-200 group-hover:text-brand-accent"
                    style={{ letterSpacing: "0.2em" }}
                  >
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
  );
}