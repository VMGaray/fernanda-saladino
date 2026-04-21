"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { supabase } from "../lib/supabase";
import { useScrollHeader } from "../hooks/useScrollHeader";
import AuthModal from "./AuthModal";
import SearchModal from "./SearchModal";
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
  const [isAdmin, setIsAdmin] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [accesoriosOpen, setAccesoriosOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { favorites } = useFavorites();
  const hasFavorites = favorites.length > 0;

  useEffect(() => {
    const fetchRole = async (userId: string) => {
      const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
      setIsAdmin(data?.role === "admin");
    };

    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user);
      if (data.user) fetchRole(data.user.id);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
      if (session?.user) fetchRole(session.user.id);
      else setIsAdmin(false);
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
        {/* DESKTOP — lg en adelante */}
        <div className="hidden lg:block">
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", alignItems: "center", padding: "20px 40px 0", gap: "32px" }}>

            {/* ── LOGO ── */}
            <Link href="/" className="group flex flex-col items-start gap-0 no-underline w-fit">
              <span
                className="text-brand-light leading-none"
                style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "52px", fontWeight: 600, letterSpacing: "0.04em" }}
              >
                FS
              </span>
              <div
                className="w-[60px] transition-all duration-300 group-hover:opacity-60"
                style={{ height: "1px", background: "rgba(245,245,247,0.2)", margin: "4px 0" }}
              />
              <span
                className="text-brand-light w-full text-start"
                style={{ fontSize: "9.5px", letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 300 }}
              >
                Fernanda Saladino
              </span>
              <span
                className="w-full text-start"
                style={{ fontSize: "7px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(192,192,192,0.4)", marginTop: "2px" }}
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
                    style={{ color: "rgba(245,245,247,0.6)", fontSize: "10.5px", letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: "inherit", padding: "0" }}
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
                    style={{ top: "calc(100% + 2px)", left: "50%", transform: "translateX(-50%)", width: "190px", background: "#181818", border: "1px solid rgba(245,245,247,0.08)", padding: "12px 0 8px" }}
                  >
                    <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", width: 30, height: 1, background: "#D4AF37" }} />
                    {carterasSub.map(sub => (
                      <Link
                        key={sub}
                        href={`/categoria/${sub.toLowerCase().replace(/ /g, "-")}`}
                        className="block transition-all duration-150 hover:pl-[22px]"
                        style={{ padding: "7px 18px", color: "rgba(245,245,247,0.55)", fontSize: "9.5px", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}
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
                    style={{ color: "rgba(245,245,247,0.6)", fontSize: "10.5px", letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: "inherit", padding: "0" }}
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
                    style={{ top: "calc(100% + 2px)", left: "50%", transform: "translateX(-50%)", width: "190px", background: "#181818", border: "1px solid rgba(245,245,247,0.08)", padding: "12px 0 8px" }}
                  >
                    <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", width: 30, height: 1, background: "#D4AF37" }} />
                    {accesoriosSub.map(sub => (
                      <Link
                        key={sub}
                        href={`/categoria/${sub.toLowerCase().replace(/ /g, "-")}`}
                        className="block transition-all duration-150"
                        style={{ padding: "7px 18px", color: "rgba(245,245,247,0.55)", fontSize: "9.5px", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none" }}
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
                    style={{ display: "flex", alignItems: "center", color: "rgba(245,245,247,0.6)", fontSize: "10.5px", letterSpacing: "0.28em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.2s" }}
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
                    style={{ display: "flex", alignItems: "center", color: "rgba(212,175,55,0.8)", fontSize: "9.5px", letterSpacing: "0.25em", textTransform: "uppercase", textDecoration: "none", border: "1px solid rgba(212,175,55,0.25)", padding: "5px 12px", transition: "all 0.2s" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#D4AF37"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.6)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "rgba(212,175,55,0.8)"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(212,175,55,0.25)"; }}
                  >
                    Ventas Mayoristas
                  </a>
                </li>

              </ul>
            </nav>

            {/* ── ÍCONOS DERECHA ── */}
            <div className="flex items-center justify-end gap-8 pb-5">

              {/* Búsqueda */}
              <button
                onClick={() => setSearchOpen(true)}
                style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, color: "rgba(245,245,247,0.5)", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,245,247,0.5)")}
                title="Buscar"
              >
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
                </svg>
              </button>

              {/* Panel Admin */}
              {isAdmin && (
                <Link
                  href="/admin"
                  title="Panel Admin"
                  style={{ color: "#D4AF37", transition: "opacity 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </Link>
              )}

              {/* Mi cuenta */}
              <div className="relative">
                <button
                  onClick={() => isLoggedIn ? setUserMenuOpen(v => !v) : setAuthOpen(true)}
                  style={{ background: "transparent", border: "none", cursor: "pointer", padding: 0, color: isLoggedIn ? "#D4AF37" : "rgba(245,245,247,0.5)", transition: "color 0.2s" }}
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
                    <div style={{ position: "fixed", inset: 0, zIndex: 40 }} onClick={() => setUserMenuOpen(false)} />
                    <div style={{ position: "absolute", top: "calc(100% + 2px)", right: 0, width: "190px", background: "#181818", border: "1px solid rgba(245,245,247,0.08)", padding: "8px 0", zIndex: 50 }}>
                      <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", width: 30, height: 1, background: "#D4AF37" }} />
                      {[
                        { label: "Mi Perfil", href: "/perfil" },
                        { label: "Mis Pedidos", href: "/perfil#pedidos" },
                      ].map(({ label, href }) => (
                        <Link
                          key={label}
                          href={href}
                          onClick={() => setUserMenuOpen(false)}
                          style={{ display: "block", padding: "7px 18px", color: "rgba(245,245,247,0.55)", fontSize: "9.5px", letterSpacing: "0.18em", textTransform: "uppercase", textDecoration: "none", transition: "color 0.15s" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
                          onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,245,247,0.55)")}
                        >
                          {label}
                        </Link>
                      ))}
                      <div style={{ height: "1px", background: "rgba(245,245,247,0.06)", margin: "6px 18px" }} />
                      <button
                        onClick={async () => { await supabase.auth.signOut(); setUserMenuOpen(false); }}
                        style={{ display: "block", width: "100%", textAlign: "left", padding: "7px 18px", background: "transparent", border: "none", color: "rgba(192,192,192,0.45)", fontSize: "9.5px", letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", transition: "color 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
                        onMouseLeave={e => (e.currentTarget.style.color = "rgba(192,192,192,0.45)")}
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Favoritos */}
              <Link
                href="/favoritos"
                className="relative"
                style={{ color: hasFavorites ? "#D4AF37" : "rgba(245,245,247,0.5)", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
                onMouseLeave={e => (e.currentTarget.style.color = hasFavorites ? "#D4AF37" : "rgba(245,245,247,0.5)")}
                title="Favoritos"
              >
                <svg width="22" height="22" fill={hasFavorites ? "#D4AF37" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Link>

              {/* Carrito */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent("toggleCart"))}
                className="relative bg-transparent border-none cursor-pointer p-0"
                style={{ color: totalItems > 0 ? "#D4AF37" : "rgba(245,245,247,0.5)", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#F5F5F7")}
                onMouseLeave={e => (e.currentTarget.style.color = totalItems > 0 ? "#D4AF37" : "rgba(245,245,247,0.5)")}
                title="Carrito"
              >
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute flex items-center justify-center" style={{ top: -5, right: -5, background: "#D4AF37", color: "#121212", width: 15, height: 15, borderRadius: "50%", fontSize: "8px", fontWeight: 700 }}>
                    {totalItems}
                  </span>
                )}
              </button>

            </div>

          </div>

          <div style={{ height: "1px", background: "rgba(245,245,247,0.06)", margin: "0 40px" }} />
        </div>

        {/* MOBILE — debajo de lg */}
        <div className="lg:hidden flex items-center justify-between px-5 py-4">
          <Link href="/" className="no-underline">
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "36px", fontWeight: 600, color: "#F5F5F7", lineHeight: 1, letterSpacing: "0.04em" }}>
              FS
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {/* Búsqueda mobile */}
            <button
              onClick={() => setSearchOpen(true)}
              className="bg-transparent border-none cursor-pointer p-0"
              style={{ color: "rgba(245,245,247,0.6)" }}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
              </svg>
            </button>

            {/* Cuenta mobile */}
            {isLoggedIn ? (
              <Link href="/perfil" style={{ color: "#D4AF37", display: "flex" }}>
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            ) : (
              <button
                onClick={() => setAuthOpen(true)}
                className="bg-transparent border-none cursor-pointer p-0"
                style={{ color: "rgba(245,245,247,0.5)", display: "flex" }}
              >
                <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </button>
            )}

            {/* Carrito mobile */}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("toggleCart"))}
              className="relative bg-transparent border-none cursor-pointer p-0"
              style={{ color: totalItems > 0 ? "#D4AF37" : "rgba(245,245,247,0.6)" }}
            >
              <svg width="22" height="22" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute flex items-center justify-center" style={{ top: -4, right: -4, background: "#D4AF37", color: "#121212", width: 14, height: 14, borderRadius: "50%", fontSize: "7px", fontWeight: 700 }}>
                  {totalItems}
                </span>
              )}
            </button>

            {/* Hamburguesa */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="bg-transparent border-none cursor-pointer p-0"
              style={{ color: "rgba(245,245,247,0.7)" }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

      </header>

      {/* DRAWER MOBILE — fullscreen overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden flex flex-col" style={{ background: "#121212" }}>

          {/* Header del drawer */}
          <div className="flex items-center justify-between px-5 py-4 flex-shrink-0" style={{ borderBottom: "1px solid rgba(245,245,247,0.06)" }}>
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="no-underline">
              <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "36px", fontWeight: 600, color: "#F5F5F7", lineHeight: 1, letterSpacing: "0.04em" }}>
                FS
              </span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="bg-transparent border-none cursor-pointer p-0"
              style={{ color: "rgba(245,245,247,0.6)" }}
            >
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Links de navegación */}
          <nav className="flex-1 overflow-y-auto px-6 py-2" style={{ overscrollBehavior: "contain" }}>

            {/* Carteras — expandible */}
            <div>
              <button
                onClick={() => setCartOpen(v => !v)}
                className="flex items-center justify-between w-full bg-transparent border-none cursor-pointer"
                style={{ padding: "16px 0", borderBottom: "1px solid rgba(245,245,247,0.06)" }}
              >
                <span style={{ color: "rgba(245,245,247,0.8)", fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 300 }}>
                  Carteras
                </span>
                <svg
                  width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  style={{ color: "rgba(245,245,247,0.4)", transition: "transform 0.25s", transform: cartOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {cartOpen && (
                <div style={{ paddingLeft: "16px" }}>
                  {carterasSub.map(sub => (
                    <Link
                      key={sub}
                      href={`/categoria/${sub.toLowerCase().replace(/ /g, "-")}`}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ display: "block", padding: "11px 0", color: "rgba(245,245,247,0.5)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", borderBottom: "1px solid rgba(245,245,247,0.04)" }}
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Accesorios — expandible */}
            <div>
              <button
                onClick={() => setAccesoriosOpen(v => !v)}
                className="flex items-center justify-between w-full bg-transparent border-none cursor-pointer"
                style={{ padding: "16px 0", borderBottom: "1px solid rgba(245,245,247,0.06)" }}
              >
                <span style={{ color: "rgba(245,245,247,0.8)", fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 300 }}>
                  Accesorios
                </span>
                <svg
                  width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  style={{ color: "rgba(245,245,247,0.4)", transition: "transform 0.25s", transform: accesoriosOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {accesoriosOpen && (
                <div style={{ paddingLeft: "16px" }}>
                  {accesoriosSub.map(sub => (
                    <Link
                      key={sub}
                      href={`/categoria/${sub.toLowerCase().replace(/ /g, "-")}`}
                      onClick={() => setMobileMenuOpen(false)}
                      style={{ display: "block", padding: "11px 0", color: "rgba(245,245,247,0.5)", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", textDecoration: "none", borderBottom: "1px solid rgba(245,245,247,0.04)" }}
                    >
                      {sub}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Gift Card */}
            <Link
              href="/gift-card"
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: "block", padding: "16px 0", color: "rgba(245,245,247,0.8)", fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase", textDecoration: "none", borderBottom: "1px solid rgba(245,245,247,0.06)", fontWeight: 300 }}
            >
              Gift Card
            </Link>

            {/* Ventas Mayoristas */}
            <a
              href="https://wa.me/5491151818438?text=Hola Fernanda, quiero consultar por ventas mayoristas."
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              style={{ display: "block", padding: "16px 0", color: "rgba(212,175,55,0.8)", fontSize: "11px", letterSpacing: "0.28em", textTransform: "uppercase", textDecoration: "none", borderBottom: "1px solid rgba(245,245,247,0.06)", fontWeight: 300 }}
            >
              Ventas Mayoristas
            </a>

            {/* Separador */}
            <div style={{ height: "1px", background: "rgba(212,175,55,0.2)", margin: "24px 0" }} />

            {isLoggedIn ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    style={{ display: "block", padding: "12px 0", color: "#D4AF37", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none" }}
                  >
                    Panel Admin
                  </Link>
                )}
                <Link
                  href="/perfil"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ display: "block", padding: "12px 0", color: "rgba(245,245,247,0.7)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none" }}
                >
                  Mi Perfil
                </Link>
                <Link
                  href="/favoritos"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ display: "block", padding: "12px 0", color: "rgba(245,245,247,0.7)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", textDecoration: "none" }}
                >
                  Favoritos
                </Link>
                <button
                  onClick={async () => { await supabase.auth.signOut(); setMobileMenuOpen(false); }}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "12px 0", background: "none", border: "none", cursor: "pointer", color: "rgba(245,245,247,0.4)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase" }}
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <button
                onClick={() => { setMobileMenuOpen(false); setAuthOpen(true); }}
                style={{ display: "block", padding: "12px 0", background: "none", border: "none", cursor: "pointer", color: "rgba(245,245,247,0.7)", fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase" }}
              >
                Ingresar / Registrarse
              </button>
            )}

          </nav>
        </div>
      )}

      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
