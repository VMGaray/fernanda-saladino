"use client";
import { Fragment, useEffect, useState, useCallback } from "react";
import { supabase } from "../../lib/supabase";
import ProductForm from "./ProductForm";

// ── Types ──────────────────────────────────────────────────────────────────

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  stock: number;
  featured: boolean;
  image_url: string;
  images?: string[];
  slug?: string;
}

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  total: number;
  status: string;
  items: OrderItem[];
  user_id?: string;
}

type Tab = "productos" | "pedidos" | "estadisticas";

// ── Helpers ────────────────────────────────────────────────────────────────

const STATUS: Record<string, { label: string; color: string }> = {
  pendiente:  { label: "Pendiente",  color: "rgba(192,192,192,0.6)" },
  confirmado: { label: "Confirmado", color: "#D4AF37" },
  enviado:    { label: "Enviado",    color: "#4A9EBF" },
  entregado:  { label: "Entregado",  color: "#5A9E6F" },
};

const labelStyle: React.CSSProperties = {
  fontSize: "8.5px",
  letterSpacing: "0.28em",
  textTransform: "uppercase",
  color: "rgba(192,192,192,0.45)",
  fontWeight: 300,
};

const thStyle: React.CSSProperties = {
  fontSize: "8px",
  letterSpacing: "0.25em",
  textTransform: "uppercase",
  color: "rgba(192,192,192,0.4)",
  fontWeight: 300,
  padding: "10px 12px",
  textAlign: "left",
  borderBottom: "1px solid rgba(245,245,247,0.06)",
};

const tdStyle: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "0.06em",
  color: "rgba(245,245,247,0.7)",
  fontWeight: 300,
  padding: "12px",
  borderBottom: "1px solid rgba(245,245,247,0.04)",
  verticalAlign: "middle",
};

// ── Main component ─────────────────────────────────────────────────────────

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>("productos");

  return (
    <div style={{ minHeight: "100vh", background: "#121212", color: "#F5F5F7", padding: "40px" }}>

      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ width: 30, height: 1, background: "#D4AF37", marginBottom: "16px" }} />
        <h1 style={{ fontSize: "11px", letterSpacing: "0.5em", textTransform: "uppercase", fontWeight: 300, margin: 0 }}>
          Panel de Administración
        </h1>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid rgba(245,245,247,0.08)", marginBottom: "40px" }}>
        {(["productos", "pedidos", "estadisticas"] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: "transparent",
              border: "none",
              borderBottom: tab === t ? "1px solid #D4AF37" : "1px solid transparent",
              marginBottom: "-1px",
              padding: "0 0 12px",
              marginRight: "40px",
              cursor: "pointer",
              fontSize: "9px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              fontWeight: 300,
              color: tab === t ? "#D4AF37" : "rgba(245,245,247,0.35)",
              transition: "color 0.2s",
            }}
          >
            {t === "estadisticas" ? "Estadísticas" : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "productos"   && <TabProductos />}
      {tab === "pedidos"     && <TabPedidos />}
      {tab === "estadisticas" && <TabEstadisticas />}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// TAB PRODUCTOS
// ══════════════════════════════════════════════════════════════════════════

function TabProductos() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [formMode, setFormMode] = useState<"none" | "create" | "edit">("none");
  const [editTarget, setEditTarget] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts((data as Product[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
    await supabase.from("products").delete().eq("id", id);
    fetchProducts();
  };

  const handleToggleFeatured = async (product: Product) => {
    await supabase.from("products").update({ featured: !product.featured }).eq("id", product.id);
    fetchProducts();
  };

  const handleFormSuccess = () => {
    setFormMode("none");
    setEditTarget(null);
    fetchProducts();
  };

  if (formMode !== "none") {
    return (
      <div style={{ maxWidth: "600px" }}>
        <p style={{ ...labelStyle, marginBottom: "24px" }}>
          {formMode === "create" ? "Nuevo Producto" : `Editando: ${editTarget?.name}`}
        </p>
        <ProductForm
          initialData={formMode === "edit" ? editTarget ?? undefined : undefined}
          onSuccess={handleFormSuccess}
          onCancel={() => { setFormMode("none"); setEditTarget(null); }}
        />
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <p style={labelStyle}>{products.length} productos</p>
        <button
          onClick={() => setFormMode("create")}
          style={{
            padding: "9px 20px",
            background: "transparent",
            border: "1px solid rgba(212,175,55,0.4)",
            color: "#D4AF37",
            fontSize: "8.5px",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            fontWeight: 300,
            cursor: "pointer",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(212,175,55,0.08)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          + Nuevo Producto
        </button>
      </div>

      {loading ? (
        <p style={{ ...labelStyle, color: "rgba(245,245,247,0.2)" }}>Cargando...</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["img", "Nombre", "Categoría", "Precio", "Stock", "Destacado", "acciones"].map(h => (
                  <th key={h} style={thStyle}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,245,247,0.02)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <td style={{ ...tdStyle, width: 52 }}>
                    <img src={p.image_url} alt={p.name} style={{ width: 44, height: 44, objectFit: "cover", border: "1px solid rgba(212,175,55,0.15)" }} />
                  </td>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={{ ...tdStyle, fontSize: "9px", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(192,192,192,0.5)" }}>{p.category}</td>
                  <td style={{ ...tdStyle, color: "#D4AF37" }}>${Number(p.price).toLocaleString("es-AR")}</td>
                  <td style={{ ...tdStyle, color: p.stock > 0 ? "rgba(90,158,111,0.8)" : "rgba(192,57,43,0.7)" }}>{p.stock ?? "—"}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleToggleFeatured(p)}
                      style={{
                        width: 32,
                        height: 18,
                        background: p.featured ? "rgba(212,175,55,0.25)" : "rgba(245,245,247,0.06)",
                        border: `1px solid ${p.featured ? "#D4AF37" : "rgba(245,245,247,0.12)"}`,
                        cursor: "pointer",
                        position: "relative",
                        transition: "all 0.2s",
                      }}
                    >
                      <span style={{
                        position: "absolute",
                        top: 2,
                        left: p.featured ? 14 : 2,
                        width: 12,
                        height: 12,
                        background: p.featured ? "#D4AF37" : "rgba(245,245,247,0.25)",
                        transition: "left 0.2s",
                      }} />
                    </button>
                  </td>
                  <td style={{ ...tdStyle, whiteSpace: "nowrap" }}>
                    <button
                      onClick={() => { setEditTarget(p); setFormMode("edit"); }}
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(212,175,55,0.6)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", marginRight: "16px", fontWeight: 300 }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#D4AF37")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(212,175,55,0.6)")}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      style={{ background: "transparent", border: "none", cursor: "pointer", color: "rgba(192,57,43,0.5)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 300 }}
                      onMouseEnter={e => (e.currentTarget.style.color = "rgba(192,57,43,0.9)")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(192,57,43,0.5)")}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// TAB PEDIDOS
// ══════════════════════════════════════════════════════════════════════════

function TabPedidos() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
    setOrders((data as Order[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusChange = async (id: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", id);
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  if (loading) return <p style={{ ...labelStyle, color: "rgba(245,245,247,0.2)" }}>Cargando...</p>;

  if (orders.length === 0) return (
    <p style={{ fontSize: "10px", letterSpacing: "0.18em", color: "rgba(245,245,247,0.3)", fontWeight: 300 }}>
      Todavía no hay pedidos.
    </p>
  );

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            {["Fecha", "Cliente", "Teléfono", "Items", "Total", "Estado", ""].map(h => (
              <th key={h} style={thStyle}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map(order => {
            const status = STATUS[order.status] ?? { label: order.status, color: "rgba(192,192,192,0.5)" };
            const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];
            const date = new Date(order.created_at).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "2-digit" });
            const isOpen = expanded === order.id;

            return (
              <Fragment key={order.id}>
                <tr
                  style={{ cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,245,247,0.02)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  onClick={() => setExpanded(isOpen ? null : order.id)}
                >
                  <td style={{ ...tdStyle, color: "rgba(192,192,192,0.5)", fontSize: "10px" }}>{date}</td>
                  <td style={tdStyle}>{order.customer_name}</td>
                  <td style={{ ...tdStyle, color: "rgba(192,192,192,0.5)", fontSize: "10px" }}>{order.customer_phone}</td>
                  <td style={{ ...tdStyle, textAlign: "center" }}>{items.reduce((s, i) => s + i.quantity, 0)}</td>
                  <td style={{ ...tdStyle, color: "#D4AF37" }}>${Number(order.total).toLocaleString("es-AR")}</td>
                  <td style={tdStyle}>
                    <span style={{ color: status.color, fontSize: "8.5px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                      {status.label}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, color: "rgba(192,192,192,0.3)", fontSize: "10px" }}>
                    {isOpen ? "▲" : "▼"}
                  </td>
                </tr>

                {isOpen && (
                  <tr key={`${order.id}-detail`}>
                    <td colSpan={7} style={{ padding: "0 12px 16px", background: "rgba(245,245,247,0.015)" }}>
                      {/* Items */}
                      <div style={{ padding: "16px 0", borderBottom: "1px solid rgba(245,245,247,0.04)", marginBottom: "14px" }}>
                        {items.map((item, i) => (
                          <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0" }}>
                            <span style={{ fontSize: "10px", letterSpacing: "0.08em", color: "rgba(245,245,247,0.6)", fontWeight: 300 }}>
                              {item.name} <span style={{ color: "rgba(245,245,247,0.3)" }}>× {item.quantity}</span>
                            </span>
                            <span style={{ fontSize: "10px", color: "rgba(245,245,247,0.4)", fontWeight: 300 }}>
                              ${Number(item.price).toLocaleString("es-AR")}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Cambiar estado */}
                      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ ...labelStyle, marginBottom: 0 }}>Estado:</span>
                        <select
                          value={order.status}
                          onChange={e => { e.stopPropagation(); handleStatusChange(order.id, e.target.value); }}
                          onClick={e => e.stopPropagation()}
                          style={{
                            background: "#1A1A1A",
                            border: "1px solid rgba(212,175,55,0.25)",
                            color: status.color,
                            padding: "5px 10px",
                            fontSize: "8.5px",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            cursor: "pointer",
                            outline: "none",
                          }}
                        >
                          {Object.entries(STATUS).map(([val, { label }]) => (
                            <option key={val} value={val} style={{ background: "#1A1A1A", color: "#F5F5F7" }}>{label}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// TAB ESTADÍSTICAS
// ══════════════════════════════════════════════════════════════════════════

function TabEstadisticas() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("orders").select("*").then(({ data }) => {
      setOrders((data as Order[]) ?? []);
      setLoading(false);
    });
  }, []);

  if (loading) return <p style={{ ...labelStyle, color: "rgba(245,245,247,0.2)" }}>Cargando...</p>;

  const totalVentas = orders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const totalPedidos = orders.length;
  const pedidosPendientes = orders.filter(o => o.status === "pendiente").length;
  const pedidosEntregados = orders.filter(o => o.status === "entregado").length;

  // Productos más vendidos
  const productMap: Record<string, { name: string; qty: number }> = {};
  for (const order of orders) {
    const items: OrderItem[] = Array.isArray(order.items) ? order.items : [];
    for (const item of items) {
      if (!productMap[item.id]) productMap[item.id] = { name: item.name, qty: 0 };
      productMap[item.id].qty += item.quantity;
    }
  }
  const topProducts = Object.values(productMap).sort((a, b) => b.qty - a.qty).slice(0, 10);

  const cardStyle: React.CSSProperties = {
    border: "1px solid rgba(245,245,247,0.06)",
    padding: "24px 28px",
    flex: 1,
    minWidth: "180px",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

      {/* Cards */}
      <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
        {[
          { label: "Ventas totales", value: `$${totalVentas.toLocaleString("es-AR")}`, color: "#D4AF37" },
          { label: "Total pedidos",  value: totalPedidos,  color: "#F5F5F7" },
          { label: "Pendientes",     value: pedidosPendientes, color: "rgba(192,192,192,0.6)" },
          { label: "Entregados",     value: pedidosEntregados, color: "#5A9E6F" },
        ].map(card => (
          <div key={card.label} style={cardStyle}>
            <p style={{ ...labelStyle, marginBottom: "12px" }}>{card.label}</p>
            <p style={{ fontSize: "28px", fontWeight: 300, letterSpacing: "0.05em", color: card.color as string, margin: 0 }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Top productos */}
      <div>
        <p style={{ ...labelStyle, marginBottom: "20px" }}>Productos más vendidos</p>
        {topProducts.length === 0 ? (
          <p style={{ fontSize: "10px", letterSpacing: "0.15em", color: "rgba(245,245,247,0.25)", fontWeight: 300 }}>
            Sin datos todavía.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            {topProducts.map((p, i) => (
              <div
                key={p.name}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px 0",
                  borderBottom: "1px solid rgba(245,245,247,0.04)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <span style={{ fontSize: "8px", color: "rgba(212,175,55,0.4)", letterSpacing: "0.2em", width: "20px" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span style={{ fontSize: "11px", letterSpacing: "0.08em", color: "rgba(245,245,247,0.7)", fontWeight: 300 }}>
                    {p.name}
                  </span>
                </div>
                <span style={{ fontSize: "10px", color: "#D4AF37", letterSpacing: "0.1em", fontWeight: 300 }}>
                  {p.qty} {p.qty === 1 ? "unidad" : "unidades"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
