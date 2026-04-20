import type { Metadata } from "next";
import CategoryView from "../../../components/CategoryView";

interface GenerateMetadataProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: GenerateMetadataProps): Promise<Metadata> {
  const { slug } = await params;
  const categoryName = slug.replace(/-/g, " ");
  const title = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);
  return {
    title,
    description: `${categoryName} artesanales en cuero argentino de primera calidad. Diseños exclusivos hechos a mano por Fernanda Saladino.`,
  };
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const resolvedParams = await params;

  return (
    <main className="min-h-screen bg-brand-black text-brand-light">
      <CategoryView slug={resolvedParams.slug} />
    </main>
  );
}