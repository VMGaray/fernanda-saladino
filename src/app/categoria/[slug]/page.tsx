import CategoryView from "../../../components/CategoryView";

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