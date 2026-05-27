import { supabase } from "../lib/supabase";
import ProductCard3D from "./ProductCard3D";

interface CategoryViewProps {
  slug: string;
}

export default async function CategoryView({ slug }: CategoryViewProps) {
  const safeSlug = slug || "";
  const categoryName = decodeURIComponent(safeSlug).replace(/-/g, " ");

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .ilike("category", categoryName)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-6 py-20">

      {/* Título de la Categoría */}
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
          {/* Contador de Items */}
          <p className="text-[9px] tracking-[0.3em] uppercase text-brand-silver/40 mb-12 text-right">
            {products.length} {products.length === 1 ? "producto" : "productos"}
          </p>

          {/* Grid de Productos con el efecto 3D implementado */}
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-12 md:gap-y-20">
            {products.map((product) => (
              <ProductCard3D key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}