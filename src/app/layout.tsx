import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "../context/CartContext";
import { FavoritesProvider } from "../context/FavoritesContext";
import Cart from "../components/Cart";
import Header from "../components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Fernanda Saladino | Carteras y Accesorios en Cuero Argentino",
    template: "%s | Fernanda Saladino",
  },
  description: "Carteras, bolsos y accesorios artesanales en cuero argentino de primera calidad. Diseños exclusivos hechos a mano.",
  keywords: ["carteras de cuero", "bolsos artesanales", "cuero argentino", "accesorios de cuero", "handmade leather"],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Fernanda Saladino",
    title: "Fernanda Saladino | Carteras y Accesorios en Cuero Argentino",
    description: "Carteras, bolsos y accesorios artesanales en cuero argentino de primera calidad.",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <FavoritesProvider>
            <Header />
            {children}
            <Cart />
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
