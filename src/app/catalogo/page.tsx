import type { Metadata } from "next";
import CatalogoView from "../../components/CatalogoView";

export const metadata: Metadata = {
  title: "Catálogo",
  description: "Explorá toda la colección de carteras, bolsos y accesorios artesanales en cuero argentino de Fernanda Saladino.",
};

export default function CatalogoPage() {
  return <CatalogoView />;
}
