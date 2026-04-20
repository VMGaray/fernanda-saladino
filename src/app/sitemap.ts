import { supabase } from "../lib/supabase";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { data: products } = await supabase
    .from("products")
    .select("slug, created_at");

  const productUrls = (products || []).map(p => ({
    url: `https://fernandasaladino.com/producto/${p.slug}`,
    lastModified: new Date(p.created_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: "https://fernandasaladino.com", lastModified: new Date(), changeFrequency: "daily" as const, priority: 1 },
    { url: "https://fernandasaladino.com/catalogo", lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    ...productUrls,
  ];
}
