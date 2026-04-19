import ProductDetail from "../../../components/ProductDetail";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  return <ProductDetail params={params} />;
}