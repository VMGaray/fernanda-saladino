import type { Metadata } from "next";
import { supabase } from "../../../lib/supabase";
import ProductDetail from "../../../components/ProductDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { data: product } = await supabase
    .from("products")
    .select("name, description, image_url, category, price")
    .eq("slug", slug)
    .single();

  if (!product) return { title: "Producto no encontrado" };

  return {
    title: product.name,
    description: product.description || `${product.name} - Cuero artesanal argentino. $${Number(product.price).toLocaleString("es-AR")}`,
    openGraph: {
      title: `${product.name} | Fernanda Saladino`,
      description: product.description || `${product.name} - Cuero artesanal argentino`,
      images: product.image_url ? [{ url: product.image_url, width: 800, height: 600, alt: product.name }] : [],
    },
  };
}

export default function ProductDetailPage({ params }: PageProps) {
  return <ProductDetail params={params} />;
}
