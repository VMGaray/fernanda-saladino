"use client";
import { useState } from "react";
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
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [name, setName] = useState(initialData?.name ?? "");
  const [price, setPrice] = useState(initialData?.price?.toString() ?? "");
  const [category, setCategory] = useState(initialData?.category ?? CATEGORIES[0]);
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [stock, setStock] = useState(initialData?.stock?.toString() ?? "");
  const [featured, setFeatured] = useState(initialData?.featured ?? false);
  const [slug, setSlug] = useState(initialData?.slug ?? "");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setSelectedFiles(files);
      setPreviews(files.map(f => URL.createObjectURL(f)));
    }
  };

  const removeImage = (index: number) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrls: string[] = initialData?.images ?? [];
      let imageUrl: string = initialData?.image_url ?? "";

      if (selectedFiles.length > 0) {
        imageUrls = [];
        for (const file of selectedFiles) {
          const fileExt = file.name.split(".").pop();
          const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
          const { error: storageError } = await supabase.storage
            .from("product-images")
            .upload(fileName, file);
          if (storageError) throw storageError;
          const { data: { publicUrl } } = supabase.storage
            .from("product-images")
            .getPublicUrl(fileName);
          imageUrls.push(publicUrl);
        }
        imageUrl = imageUrls[0];
      }

      const payload: Record<string, unknown> = {
        name,
        price: parseFloat(price),
        category,
        description,
        stock: stock ? parseInt(stock) : null,
        featured,
        slug: slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        ...(imageUrls.length > 0 && { image_url: imageUrl, images: imageUrls }),
      };

      if (isEdit) {
        const { error } = await supabase.from("products").update(payload).eq("id", initialData!.id!);
        if (error) throw error;
      } else {
        if (imageUrls.length === 0) throw new Error("Seleccioná al menos una imagen.");
        const { error } = await supabase.from("products").insert([payload]);
        if (error) throw error;
      }

      onSuccess?.();
    } catch (err: unknown) {
      alert("Error: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      setLoading(false);
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
        <label style={labelStyle}>Imágenes {isEdit && "(dejar vacío para mantener las actuales)"}</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          required={!isEdit}
          style={{ fontSize: "10px", color: "rgba(192,192,192,0.5)", marginTop: "4px" }}
        />
        {previews.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "12px" }}>
            {previews.map((src, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img src={src} alt="" style={{ width: "100%", height: "80px", objectFit: "cover", border: "1px solid rgba(212,175,55,0.2)" }} />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  style={{ position: "absolute", top: 2, right: 2, background: "#c0392b", border: "none", color: "#fff", width: 18, height: 18, cursor: "pointer", fontSize: "10px" }}
                >✕</button>
                {i === 0 && <span style={{ position: "absolute", bottom: 2, left: 2, background: "#D4AF37", color: "#121212", fontSize: "7px", padding: "1px 5px", letterSpacing: "0.2em", textTransform: "uppercase" }}>Principal</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Acciones */}
      <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
        <button
          type="submit"
          disabled={loading}
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
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? "Guardando..." : isEdit ? "Guardar cambios" : "Publicar producto"}
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
