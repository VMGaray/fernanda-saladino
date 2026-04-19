"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import { useScrollHeader } from "../hooks/useScrollHeader";
import AuthModal from "./AuthModal";
import { useFavorites } from "../context/FavoritesContext";

const carterasSub = [
  "Bolsos", "Bandoleras", "Shoulder Bags", "Tote Bags", "Mini Bags",
  "Riñoneras", "Mochilas", "De Mano", "Sobres", "Bolso de Viaje",
];
const accesoriosSub = [
  "Cinturones", "Fajas", "Yerberas", "Portadocumentos", "Porta Anteojos",
];

export default function Header() {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();
  const headerVisible = useScrollHeader();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { favorites } = useFavorites();
  const hasFavorites = favorites.length > 0;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&display=swap');
      `}</style>

      <header
        className="bg-brand-black sticky top-0 z-[100]"
        style={{
          borderBottom: "1px solid rgba(245,245,247,0.06)",
          transform: headerVisible ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.35s ease",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "20px 40px 0", gap: "32px" }}>

          {/* ── LOGO ── */}
          <Link href="/" className="group flex flex-col items-start gap-0 no-underline w-fit">
            <span
              className="text-brand-light leading-none"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "52px",
                fontWeight: 600,
                letterSpacing: "0.04em",
              }}
            >
              FS
            </span>
            <div
              className="w-[60px] transition-all duration-300 group-hover:opacity-60"
              style={{ height: "1px", background: "rgba(245,245,247,0.2)", margin: "4px 0" }}
            />
            <span
              className="text-brand-light w-full text-start"
              style={{
                fontSize: "9.5px",
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                fontWeight: 300,
              }}
            >
              Fernanda Saladino
            </span>
            <span
              className="w-full text-start"
              style={{
                fontSize: "7px",
                letterSpacing: "0.28em",
                textTransform: "uppercase",
                color: "rgba(192,192,192,0.4)",
                marginTop: "2px",
              }}
            >
              Hand Made · Cuero Argentino
            </span>
          </Link>

          {/* ── NAV ── */}
          <nav>
            <ul className="flex items-center gap-12 list-none">

              {/* Carteras */}
              <li className="relative group">
                <button
                  className="flex items-center gap-1 bg-transparent border-none cursor-pointer transition-colors duration-200"
                  style={{
                    color: "rgba(245,245,247,0.6)",
                    fontSize: "10.5px",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontFamily: "inherit",
                    padding: "0",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,245,247,0.6)")}
                >
                  Carteras
                  <svg style={{ width: 7, height: 7, opacity: 0.4 }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div
                  className="absolute hidden group-hover:block z-50"
                  style={{
                    top: "calc(100% + 2px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "190px",
                    background: "#181818",
                    border: "1px solid rgba(245,245,247,0.08)",
                    padding: "12px 0 8px",
                  }}
                >
                  <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", width: 30, height: 1, background: "#D4AF37" }} />
                  {carterasSub.map(sub => (
                    <Link
                      key={sub}
                      href={`/categoria/${sub.toLowerCase().replace(/ /g, "-")}`}
                      className="block transition-all duration-150 hover:pl-[22px]"
                      style={{
                        padding: "7px 18px",
                        color: "rgba(245,245,247,0.55)",
                        fontSize: "9.5px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,245,247,0.55)")}
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </li>

              {/* Accesorios */}
              <li className="relative group">
                <button
                  className="flex items-center gap-1 bg-transparent border-none cursor-pointer transition-colors duration-200"
                  style={{
                    color: "rgba(245,245,247,0.6)",
                    fontSize: "10.5px",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    fontFamily: "inherit",
                    padding: "0",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,245,247,0.6)")}
                >
                  Accesorios
                  <svg style={{ width: 7, height: 7, opacity: 0.4 }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div
                  className="absolute hidden group-hover:block z-50"
                  style={{
                    top: "calc(100% + 2px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    width: "190px",
                    background: "#181818",
                    border: "1px solid rgba(245,245,247,0.08)",
                    padding: "12px 0 8px",
                  }}
                >
                  <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", width: 30, height: 1, background: "#D4AF37" }} />
                  {accesoriosSub.map(sub => (
                    <Link
                      key={sub}
                      href={`/categoria/${sub.toLowerCase().replace(/ /g, "-")}`}
                      className="block transition-all duration-150"
                      style={{
                        padding: "7px 18px",
                        color: "rgba(245,245,247,0.55)",
                        fontSize: "9.5px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        textDecoration: "none",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,245,247,0.55)")}
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              </li>

              {/* Gift Card */}
              <li>
                <Link
                  href="/gift-card"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "rgba(245,245,247,0.6)",
                    fontSize: "10.5px",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,245,247,0.6)")}
                >
                  Gift Card
                </Link>
              </li>

              {/* Mayoristas */}
              <li>
                <a
                  href="https://wa.me/5491151818438?text=Hola Fernanda, quiero consultar por ventas mayoristas."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    color: "rgba(212,175,55,0.8)",
                    fontSize: "9.5px",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    textDecoration: "none",
                    border: "1px solid rgba(212,175,55,0.25)",
                    padding: "5px 12px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.6)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.color = "rgba(212,175,55,0.8)";
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.25)";
                  }}
                >
                  Ventas Mayoristas
                </a>
              </li>

            </ul>
          </nav>

          {/* ── ÍCONOS DERECHA ── */}
          <div className="flex items-center justify-end gap-8 pb-5">

            {/* Mi cuenta */}
            <div className="relative">
              <button
                onClick={() => isLoggedIn ? setUserMenuOpen(v => !v) : setAuthOpen(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  color: isLoggedIn ? "#D4AF37" : "rgba(245,245,247,0.5)",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
                onMouseLeave={e => (e.currentTarget.style.color = isLoggedIn ? "#D4AF37" : "rgba(245,245,247,0.5)")}
                title="Mi cuenta"
              >
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>

              {userMenuOpen && isLoggedIn && (
                <>
                  {/* overlay para cerrar al clickear afuera */}
                  <div
                    style={{ position: "fixed", inset: 0, zIndex: 40 }}
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: "calc(100% + 2px)",
                      right: 0,
                      width: "190px",
                      background: "#181818",
                      border: "1px solid rgba(245,245,247,0.08)",
                      padding: "8px 0",
                      zIndex: 50,
                    }}
                  >
                    <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", width: 30, height: 1, background: "#D4AF37" }} />
                    {[
                      { label: "Mi Perfil", href: "/perfil" },
                      { label: "Mis Pedidos", href: "/perfil#pedidos" },
                    ].map(({ label, href }) => (
                      <Link
                        key={label}
                        href={href}
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: "block",
                          padding: "7px 18px",
                          color: "rgba(245,245,247,0.55)",
                          fontSize: "9.5px",
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                          textDecoration: "none",
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,245,247,0.55)")}
                      >
                        {label}
                      </Link>
                    ))}
                    <div style={{ height: "1px", background: "rgba(245,245,247,0.06)", margin: "6px 18px" }} />
                    <button
                      onClick={async () => {
                        await supabase.auth.signOut();
                        setUserMenuOpen(false);
                      }}
                      style={{
                        display: "block",
                        width: "100%",
                        textAlign: "left",
                        padding: "7px 18px",
                        background: "transparent",
                        border: "none",
                        color: "rgba(192,192,192,0.45)",
                        fontSize: "9.5px",
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        cursor: "pointer",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(192,192,192,0.45)")}
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Favoritos — dorado si tiene favoritos */}
            <Link
              href="/favoritos"
              className="relative"
              style={{
                color: hasFavorites ? "#D4AF37" : "rgba(245,245,247,0.5)",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
              onMouseLeave={e => (e.currentTarget.style.color = hasFavorites ? "#D4AF37" : "rgba(245,245,247,0.5)")}
              title="Favoritos"
            >
              <svg
                width="22"
                height="22"
                fill={hasFavorites ? "#D4AF37" : "none"}
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {/* Carrito — dorado si tiene productos */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("toggleCart"))}
              className="relative bg-transparent border-none cursor-pointer p-0"
              style={{
                color: totalItems > 0 ? "#D4AF37" : "rgba(245,245,247,0.5)",
                transition: "color 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
              onMouseLeave={e => (e.currentTarget.style.color = totalItems > 0 ? "#D4AF37" : "rgba(245,245,247,0.5)")}
              title="Carrito"
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span
                  className="absolute flex items-center justify-center"
                  style={{
                    top: -5,
                    right: -5,
                    background: "#D4AF37",
                    color: "#121212",
                    width: 15,
                    height: 15,
                    borderRadius: "50%",
                    fontSize: "8px",
                    fontWeight: 700,
                  }}
                >
                  {totalItems}
                </span>
              )}
            </button>

          </div>

        </div>

        {/* Línea separadora */}
        <div style={{ height: "1px", background: "rgba(245,245,247,0.06)", margin: "0 40px" }} />

        {/* ── MOBILE ── */}
        <div
          className="lg:hidden flex items-center justify-between px-5 py-4"
          style={{ display: "none" }}
        >
          <Link href="/" className="flex flex-col items-start gap-0 no-underline">
            <span
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "36px",
                fontWeight: 600,
                color: "#F5F5F7",
                lineHeight: 1,
                letterSpacing: "0.04em",
              }}
            >
              FS
            </span>
            <div style={{ height: "1px", background: "rgba(245,245,247,0.2)", margin: "3px 0", width: "60px" }} />
            <span style={{ fontSize: "7.5px", letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(245,245,247,0.7)", fontWeight: 300 }}>
              Fernanda Saladino
            </span>
          </Link>
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("toggleCart"))}
            className="relative bg-transparent border-none cursor-pointer"
            style={{ color: totalItems > 0 ? "#D4AF37" : "rgba(245,245,247,0.6)" }}
          >
            <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span
                className="absolute flex items-center justify-center"
                style={{ top: -4, right: -4, background: "#D4AF37", color: "#121212", width: 14, height: 14, borderRadius: "50%", fontSize: "7px", fontWeight: 700 }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>

      </header>

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}