"use client";
import Link from "next/link";

export default function Footer() {
  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&display=swap');`}</style>
    <footer style={{ background: "#0D0D0D", borderTop: "1px solid rgba(212,175,55,0.1)", padding: "48px 40px 32px" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

        {/* Fila principal — 3 columnas en desktop, 1 en mobile */}
        <div
          className="grid grid-cols-1 md:grid-cols-3"
          style={{ gap: "40px", marginBottom: "40px" }}
        >

          {/* Columna 1 — Marca */}
          <div>
            <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "36px", fontWeight: 600, color: "#F5F5F7", letterSpacing: "0.04em" }}>
              FS
            </span>
            <p style={{ fontSize: "8px", letterSpacing: "0.35em", textTransform: "uppercase", color: "rgba(192,192,192,0.4)", marginTop: "8px", marginBottom: 0 }}>
              Hand Made · Cuero Argentino
            </p>
          </div>

          {/* Columna 2 — Contacto */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.7)", margin: 0 }}>
              Contacto
            </p>
            <a
              href="https://wa.me/5491151818438?text=Hola Fernanda, quiero consultar sobre una compra."
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", letterSpacing: "0.1em", color: "rgba(245,245,247,0.5)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#D4AF37")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,245,247,0.5)")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              +54 9 11 5181-8438
            </a>
            <a
              href="https://www.instagram.com/fernanda.saladino"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "11px", letterSpacing: "0.1em", color: "rgba(245,245,247,0.5)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#D4AF37")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,245,247,0.5)")}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              @fernanda.saladino
            </a>
          </div>

          {/* Columna 3 — Links */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(212,175,55,0.7)", margin: "0 0 4px" }}>
              Tienda
            </p>
            {[
              { label: "Carteras", href: "/catalogo" },
              { label: "Accesorios", href: "/categoria/cinturones" },
              { label: "Gift Card", href: "/gift-card" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{ fontSize: "11px", letterSpacing: "0.15em", color: "rgba(245,245,247,0.5)", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#D4AF37")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(245,245,247,0.5)")}
              >
                {label}
              </Link>
            ))}
          </div>

        </div>

        {/* Línea separadora */}
        <div style={{ height: "1px", background: "rgba(212,175,55,0.08)", margin: "0 0 24px" }} />

        {/* Fila inferior */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(192,192,192,0.3)", margin: 0 }}>
            © 2026 Fernanda Saladino · Todos los derechos reservados
          </p>
          <a
            href="https://www.instagram.com/vmg.setup.ai/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(192,192,192,0.25)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "rgba(212,175,55,0.5)")}
            onMouseLeave={e => (e.currentTarget.style.color = "rgba(192,192,192,0.25)")}
          >
            Diseño y desarrollo · @vmg.setup.ai
          </a>
        </div>

      </div>
    </footer>
    </>
  );
}
