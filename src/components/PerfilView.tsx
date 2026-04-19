"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

interface Order {
  id: string;
  created_at: string;
  status: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
}

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  pendiente:  { label: "Pendiente",  color: "rgba(192,192,192,0.5)" },
  confirmado: { label: "Confirmado", color: "#D4AF37" },
  enviado:    { label: "Enviado",    color: "#4A9EBF" },
  entregado:  { label: "Entregado",  color: "#5A9E6F" },
};

export default function PerfilView() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) {
        router.push("/");
        return;
      }
      setEmail(session.user.email ?? "");
      setName(session.user.user_metadata?.full_name ?? "");
      setLoadingUser(false);

      supabase
        .from("orders")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })
        .then(({ data: rows }) => {
          setOrders((rows as Order[]) ?? []);
          setLoadingOrders(false);
        })
        .catch(() => setLoadingOrders(false));
    });
  }, [router]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const sectionTitle = (text: string) => (
    <div style={{ marginBottom: "28px" }}>
      <p style={{ fontSize: "9px", letterSpacing: "0.38em", textTransform: "uppercase", color: "rgba(192,192,192,0.4)", fontWeight: 300, margin: 0 }}>
        {text}
      </p>
      <div style={{ height: "1px", background: "rgba(212,175,55,0.2)", marginTop: "10px" }} />
    </div>
  );

  if (loadingUser) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "9px", letterSpacing: "0.3em", textTransform: "uppercase", color: "rgba(245,245,247,0.3)", fontWeight: 300 }}>
          Cargando...
        </p>
      </div>
    );
  }

  return (
    <main style={{ maxWidth: "720px", margin: "0 auto", padding: "72px 40px" }}>

      {/* Encabezado */}
      <div style={{ marginBottom: "64px" }}>
        <div style={{ width: 30, height: 1, background: "#D4AF37", marginBottom: "20px" }} />
        <h1 style={{ fontSize: "11px", letterSpacing: "0.4em", textTransform: "uppercase", fontWeight: 300, color: "#F5F5F7", margin: 0 }}>
          Mi Cuenta
        </h1>
      </div>

      {/* ── DATOS ── */}
      <section style={{ marginBottom: "64px" }}>
        {sectionTitle("Datos")}

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {name && (
            <div>
              <p style={{ fontSize: "8.5px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(192,192,192,0.4)", fontWeight: 300, margin: "0 0 6px" }}>
                Nombre
              </p>
              <p style={{ fontSize: "13px", letterSpacing: "0.1em", color: "#F5F5F7", fontWeight: 300, margin: 0 }}>
                {name}
              </p>
            </div>
          )}
          <div>
            <p style={{ fontSize: "8.5px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(192,192,192,0.4)", fontWeight: 300, margin: "0 0 6px" }}>
              Email
            </p>
            <p style={{ fontSize: "13px", letterSpacing: "0.1em", color: "#F5F5F7", fontWeight: 300, margin: 0 }}>
              {email}
            </p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          style={{
            marginTop: "36px",
            padding: "11px 28px",
            background: "transparent",
            border: "1px solid rgba(192,192,192,0.2)",
            color: "rgba(192,192,192,0.5)",
            fontSize: "9px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 300,
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,175,55,0.4)";
            (e.currentTarget as HTMLButtonElement).style.color = "#D4AF37";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(192,192,192,0.2)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(192,192,192,0.5)";
          }}
        >
          Cerrar Sesión
        </button>
      </section>

      {/* ── PEDIDOS ── */}
      <section id="pedidos">
        {sectionTitle("Historial de Pedidos")}

        {loadingOrders ? (
          <p style={{ fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(245,245,247,0.25)", fontWeight: 300 }}>
            Cargando pedidos...
          </p>
        ) : orders.length === 0 ? (
          <p style={{ fontSize: "10px", letterSpacing: "0.18em", color: "rgba(245,245,247,0.3)", fontWeight: 300 }}>
            Todavía no realizaste ningún pedido.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {orders.map(order => {
              const status = STATUS_STYLES[order.status] ?? { label: order.status, color: "rgba(192,192,192,0.5)" };
              const date = new Date(order.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
              const items: Order["items"] = Array.isArray(order.items) ? order.items : [];

              return (
                <div
                  key={order.id}
                  style={{
                    border: "1px solid rgba(245,245,247,0.06)",
                    padding: "20px 24px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                    <p style={{ fontSize: "8.5px", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(245,245,247,0.35)", fontWeight: 300, margin: 0 }}>
                      {date}
                    </p>
                    <span style={{
                      fontSize: "8px",
                      letterSpacing: "0.22em",
                      textTransform: "uppercase",
                      fontWeight: 300,
                      color: status.color,
                      border: `1px solid ${status.color}`,
                      padding: "3px 10px",
                    }}>
                      {status.label}
                    </span>
                  </div>

                  {items.length > 0 && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "14px" }}>
                      {items.map((item, i) => (
                        <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                          <p style={{ fontSize: "10px", letterSpacing: "0.1em", color: "rgba(245,245,247,0.6)", fontWeight: 300, margin: 0 }}>
                            {item.name} <span style={{ color: "rgba(245,245,247,0.3)" }}>× {item.quantity}</span>
                          </p>
                          <p style={{ fontSize: "10px", letterSpacing: "0.08em", color: "rgba(245,245,247,0.5)", fontWeight: 300, margin: 0 }}>
                            ${item.price.toLocaleString("es-AR")}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {order.total != null && (
                    <div style={{ display: "flex", justifyContent: "flex-end", borderTop: "1px solid rgba(245,245,247,0.06)", paddingTop: "12px" }}>
                      <p style={{ fontSize: "10px", letterSpacing: "0.15em", textTransform: "uppercase", color: "#D4AF37", fontWeight: 300, margin: 0 }}>
                        Total · ${order.total.toLocaleString("es-AR")}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

    </main>
  );
}
