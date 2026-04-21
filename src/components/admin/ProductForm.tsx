"use client";
import { useState } from "react";
import React from "react";
import { supabase } from "../../lib/supabase";

interface Product {
  id?: string;
  name: string;
  price: number;
  category: string;
  description?: string;
  stock?: number;
  featured?: boolean;
  image_url?: string;
  images?: string[];
  slug?: string;
}

interface ProductFormProps {
  initialData?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CATEGORIES = [
  "Bolsos", "Bandoleras", "Shoulder Bags", "Tote Bags", "Mini Bags",
  "Riñoneras", "Mochilas", "De Mano", "Sobres", "Bolso de Viaje",
  "Cinturones", "Fajas", "Yerberas", "Portadocumentos", "Porta Anteojos",
];

export default function ProductForm({ initialData, onSuccess, onCancel }: ProductFormProps) {
  const isEdit = !!initialData?.id;
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [existingUrls, setExistingUrls] = useState<string[]>(
    initialData?.images?.length ? initialData.images : initialData?.image_url ? [initialData.image_url] : []
  );
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newPreviews, setNewPreviews] = useState<string[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialData?.name ?? "");
  const [price, setPrice] = useState(initialData?.price?.toString() ?? "");
  const [category, setCategory] = useState(initialData?.category ?? CATEGORIES[0]);
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [stock, setStock] = useState(initialData?.stock?.toString() ?? "");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [slug, setSlug] = useState(initialData?.slug ?? "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const added = Array.from(e.target.files || []);
    if (added.length === 0) return;
    setNewFiles(prev => [...prev, ...added]);
    setNewPreviews(prev => [...prev, ...added.map(f => URL.createObjectURL(f))]);
    e.target.value = "";
  };

  const removeExistingImage = (index: number) => {
    setExistingUrls(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedUrls: string[] = [];

      if (newFiles.length > 0) {
        setUploadingImage(true);
        for (const file of newFiles) {
          const cleanFileName = file.name
            .normalize("NFD")
            .replace(/[̀-ͯ]/g, "")
            .replace(/[^a-zA-Z0-9.-]/g, "-")
            .toLowerCase();
          const fileName = `${Date.now()}-${cleanFileName}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from("product-images")
            .upload(fileName, file);
          if (uploadError) throw new Error("Error subiendo imagen: " + uploadError.message);
          if (!uploadData) throw new Error("Error subiendo imagen: no se recibió respuesta del servidor.");
          const { data: { publicUrl } } = supabase.storage
            .from("product-images")
            .getPublicUrl(fileName);
          if (!publicUrl) throw new Error("Error obteniendo URL pública de la imagen.");
          uploadedUrls.push(publicUrl);
        }
        setUploadingImage(false);
      }

      const allImageUrls = [...existingUrls, ...uploadedUrls];

      if (!isEdit && allImageUrls.length === 0) throw new Error("Seleccioná al menos una imagen.");

      const payload: Record<string, unknown> = {
        name,
        price: parseFloat(price),
        category,
        description,
        stock: stock ? parseInt(stock) : null,
        featured,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        ...(allImageUrls.length > 0 && { image_url: allImageUrls[0], images: allImageUrls }),
      };

      if (isEdit) {
        const { error: dbError } = await supabase.from("products").update(payload).eq("id", initialData!.id!);
        if (dbError) throw new Error("Error guardando producto: " + dbError.message);
      } else {
        const { error: dbError } = await supabase.from("products").insert([payload]);
        if (dbError) throw new Error("Error guardando producto: " + dbError.message);
      }

      onSuccess?.();
    } catch (err: unknown) {
      console.error("Error al guardar producto:", err);
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
      setUploadingImage(false);
    }
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "8.5px",
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "rgba(192,192,192,0.5)",
    marginBottom: "6px",
    fontWeight: 300,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "none",
    borderBottom: "1px solid rgba(212,175,55,0.3)",
    padding: "8px 0",
    color: "#F5F5F7",
    fontSize: "12px",
    letterSpacing: "0.06em",
    fontWeight: 300,
    outline: "none",
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Nombre</label>
          <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div>
          <label style={labelStyle}>Precio</label>
          <input style={inputStyle} type="number" value={price} onChange={e => setPrice(e.target.value)} required />
        </div>
        <div>
          <label style={labelStyle}>Stock</label>
          <input style={inputStyle} type="number" value={stock} onChange={e => setStock(e.target.value)} />
        </div>
        <div>
          <label style={labelStyle}>Categoría</label>
          <select
            style={{ ...inputStyle, cursor: "pointer" }}
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "#1E1E1E" }}>{c}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Slug</label>
          <input style={inputStyle} value={slug} onChange={e => setSlug(e.target.value)} placeholder="auto-generado si vacío" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Descripción</label>
          <textarea
            style={{ ...inputStyle, resize: "none", height: "72px" }}
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
      </div>

      {/* Featured */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          type="button"
          onClick={() => setFeatured(v => !v)}
          style={{
            width: "36px",
            height: "20px",
            background: featured ? "rgba(212,175,55,0.3)" : "rgba(245,245,247,0.08)",
            border: `1px solid ${featured ? "#D4AF37" : "rgba(245,245,247,0.15)"}`,
            cursor: "pointer",
            position: "relative",
            transition: "all 0.2s",
          }}
        >
          <span style={{
            position: "absolute",
            top: "2px",
            left: featured ? "16px" : "2px",
            width: "14px",
            height: "14px",
            background: featured ? "#D4AF37" : "rgba(245,245,247,0.3)",
            transition: "left 0.2s",
          }} />
        </button>
        <span style={{ fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(192,192,192,0.5)", fontWeight: 300 }}>
          Producto destacado
        </span>
      </div>

      {/* Imágenes */}
      <div>
        <label style={labelStyle}>Imágenes</label>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          style={{ display: "none" }}
        />

        {/* Grilla unificada: existentes + nuevas */}
        {(existingUrls.length > 0 || newPreviews.length > 0) && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "8px" }}>
            {existingUrls.map((src, i) => (
              <div key={`existing-${i}`} style={{ position: "relative" }}>
                <img
                  src={src}
                  alt=""
                  style={{ width: "100%", height: "160px", objectFit: "cover", border: "1px solid rgba(212,175,55,0.2)", display: "block" }}
                />
                <button
                  type="button"
                  onClick={() => removeExistingImage(i)}
                  style={{ position: "absolute", top: 4, right: 4, background: "#c0392b", border: "none", color: "#fff", width: 20, height: 20, cursor: "pointer", fontSize: "10px" }}
                >✕</button>
                {i === 0 && (
                  <span style={{ position: "absolute", bottom: 4, left: 4, background: "#D4AF37", color: "#121212", fontSize: "7px", padding: "2px 6px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    Principal
                  </span>
                )}
              </div>
            ))}
            {newPreviews.map((src, i) => (
              <div key={`new-${i}`} style={{ position: "relative" }}>
                <img
                  src={src}
                  alt=""
                  style={{ width: "100%", height: "160px", objectFit: "cover", border: "1px solid rgba(212,175,55,0.4)", display: "block" }}
                />
                <button
                  type="button"
                  onClick={() => removeNewImage(i)}
                  style={{ position: "absolute", top: 4, right: 4, background: "#c0392b", border: "none", color: "#fff", width: 20, height: 20, cursor: "pointer", fontSize: "10px" }}
                >✕</button>
                {existingUrls.length === 0 && i === 0 && (
                  <span style={{ position: "absolute", bottom: 4, left: 4, background: "#D4AF37", color: "#121212", fontSize: "7px", padding: "2px 6px", letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    Principal
                  </span>
                )}
                <span style={{ position: "absolute", top: 4, left: 4, background: "rgba(0,0,0,0.6)", color: "rgba(192,192,192,0.7)", fontSize: "7px", padding: "2px 5px", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                  Nueva
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Drop zone */}
        <div
          onClick={() => fileInputRef.current?.click()}
          style={{
            border: "1px dashed rgba(212,175,55,0.3)",
            padding: "16px",
            textAlign: "center",
            cursor: "pointer",
            marginTop: "8px",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.6)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)")}
        >
          <span style={{ fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(192,192,192,0.5)", fontWeight: 300 }}>
            {existingUrls.length + newPreviews.length > 0 ? "Agregar más imágenes" : "Seleccionar imágenes"}
          </span>
        </div>
      </div>

      {/* Acciones */}
      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <button
          type="submit"
          disabled={loading || uploadingImage}
          style={{
            flex: 1,
            padding: "12px",
            background: "transparent",
            border: "1px solid rgba(212,175,55,0.5)",
            color: "#D4AF37",
            fontSize: "9px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            fontWeight: 300,
            cursor: (loading || uploadingImage) ? "not-allowed" : "pointer",
            opacity: (loading || uploadingImage) ? 0.5 : 1,
          }}
        >
          {uploadingImage ? "Subiendo imagen..." : loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Publicar producto"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: "12px 20px",
              background: "transparent",
              border: "1px solid rgba(245,245,247,0.1)",
              color: "rgba(245,245,247,0.4)",
              fontSize: "9px",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              fontWeight: 300,
              cursor: "pointer",
            }}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
