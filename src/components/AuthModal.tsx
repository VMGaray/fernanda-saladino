"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type View = "login" | "register";

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const router = useRouter();
  const [view, setView] = useState<View>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [registered, setRegistered] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
    setError("");
    setRegistered(false);
  };

  const switchView = (v: View) => {
    resetForm();
    setView(v);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      setError("Email o contraseña incorrectos.");
      return;
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();
    resetForm();
    if (profile?.role === "admin") {
      router.push("/admin");
    } else {
      onClose();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    });
    setLoading(false);
    if (error) {
      console.error("Error registro completo:", error);
      setError(error.message);
      return;
    }
    if (data.session) {
      onClose();
      resetForm();
    } else {
      setRegistered(true);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(192,192,192,0.4)",
    padding: "10px 0",
    color: "#F5F5F7",
    fontSize: "11px",
    letterSpacing: "0.12em",
    fontWeight: 300,
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "9px",
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "rgba(192,192,192,0.6)",
    marginBottom: "4px",
    fontWeight: 300,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.75)",
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#121212",
          border: "1px solid rgba(212,175,55,0.3)",
          width: "100%",
          maxWidth: "420px",
          padding: "48px 40px",
          position: "relative",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Cerrar */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 20,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "rgba(245,245,247,0.4)",
            fontSize: "18px",
            lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Línea dorada top */}
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 40, height: 1, background: "#D4AF37" }} />

        {/* Toggle */}
        <div style={{ display: "flex", gap: 0, marginBottom: "36px", borderBottom: "1px solid rgba(245,245,247,0.08)" }}>
          {(["login", "register"] as View[]).map(v => (
            <button
              key={v}
              onClick={() => switchView(v)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                borderBottom: view === v ? "1px solid #D4AF37" : "1px solid transparent",
                marginBottom: "-1px",
                padding: "0 0 12px",
                cursor: "pointer",
                fontSize: "9px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 300,
                color: view === v ? "#D4AF37" : "rgba(245,245,247,0.35)",
                transition: "color 0.2s",
              }}
            >
              {v === "login" ? "Ingresar" : "Registrarse"}
            </button>
          ))}
        </div>

        {/* Login */}
        {view === "login" && (
          <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                autoComplete="email"
              />
            </div>
            <div>
              <label style={labelStyle}>Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#c0392b", margin: 0, fontWeight: 300 }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "8px",
                padding: "13px",
                background: "transparent",
                border: "1px solid rgba(212,175,55,0.5)",
                color: "#D4AF37",
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 300,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(212,175,55,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#D4AF37";
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,175,55,0.5)";
              }}
            >
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </form>
        )}

        {/* Register */}
        {view === "register" && registered && (
          <div style={{ textAlign: "center", padding: "24px 0" }}>
            <div style={{ width: 40, height: 1, background: "#D4AF37", margin: "0 auto 24px" }} />
            <p style={{ fontSize: "10px", letterSpacing: "0.22em", textTransform: "uppercase", color: "#D4AF37", fontWeight: 300, marginBottom: "12px" }}>
              Cuenta creada
            </p>
            <p style={{ fontSize: "10px", letterSpacing: "0.12em", color: "rgba(245,245,247,0.5)", fontWeight: 300, lineHeight: 1.8 }}>
              Revisá tu email para confirmar tu cuenta.<br />Luego podés iniciar sesión.
            </p>
            <button
              onClick={() => switchView("login")}
              style={{ marginTop: "24px", background: "transparent", border: "none", cursor: "pointer", color: "#D4AF37", fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", fontWeight: 300 }}
            >
              Ir a ingresar →
            </button>
          </div>
        )}

        {view === "register" && !registered && (
          <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label style={labelStyle}>Nombre</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
                autoComplete="name"
              />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                autoComplete="email"
              />
            </div>
            <div>
              <label style={labelStyle}>Contraseña</label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
                autoComplete="new-password"
              />
            </div>
            <div>
              <label style={labelStyle}>Confirmar contraseña</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                style={inputStyle}
                autoComplete="new-password"
              />
            </div>
            {error && (
              <p style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#c0392b", margin: 0, fontWeight: 300 }}>
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: "8px",
                padding: "13px",
                background: "transparent",
                border: "1px solid rgba(212,175,55,0.5)",
                color: "#D4AF37",
                fontSize: "10px",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                fontWeight: 300,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.5 : 1,
                transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                if (!loading) {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(212,175,55,0.08)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#D4AF37";
                }
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(212,175,55,0.5)";
              }}
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
