"use client";
import { useState, useEffect, useRef } from "react";
import React from "react";
import { supabase } from "../../lib/supabase";

interface Slide {
  id: number;
  image_url: string;
}

export default function CarouselManager() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null); // Estado para el modal de vista previa
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchSlides = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("home_slides")
        .select("*")
        .order("id", { ascending: true });

      if (error) throw error;
      setSlides(data || []);
    } catch (err) {
      console.error("Error al traer los slides:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const cleanFileName = file.name
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .replace(/[^a-zA-Z0-9.-]/g, "-")
          .toLowerCase();
        
        const fileName = `carousel-${Date.now()}-${cleanFileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(`carousel/${fileName}`, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(`carousel/${fileName}`);

        if (!publicUrl) throw new Error("No se pudo generar la URL pública.");

        const { error: dbError } = await supabase
          .from("home_slides")
          .insert([{ image_url: publicUrl }]);

        if (dbError) throw dbError;
      }

      await fetchSlides();
    } catch (err: any) {
      alert("Error al subir la imagen: " + (err.message || err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDeleteSlide = async (id: number, imageUrl: string) => {
    if (!confirm("¿Estás segura de que querés eliminar esta imagen?")) return;

    try {
      const { error: dbError } = await supabase.from("home_slides").delete().eq("id", id);
      if (dbError) throw dbError;

      try {
        const urlParts = imageUrl.split("/product-images/");
        if (urlParts.length > 1) {
          await supabase.storage.from("product-images").remove([urlParts[1]]);
        }
      } catch (storageErr) {
        console.warn(storageErr);
      }

      setSlides(prev => prev.filter(slide => slide.id !== id));
    } catch (err) {
      alert("No se pudo eliminar la imagen.");
    }
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "9px",
    letterSpacing: "0.28em",
    textTransform: "uppercase",
    color: "rgba(192,192,192,0.6)",
    marginBottom: "14px",
    fontWeight: 300,
  };

  return (
    <div style={{ background: "transparent", padding: "10px 0" }}>
      <label style={labelStyle}>Imágenes del Carrusel Principal</label>
      
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileUpload}
        style={{ display: "none" }}
      />

      {loading ? (
        <div style={{ padding: "20px 0", color: "rgba(245,245,247,0.4)", fontSize: "11px" }}>
          Cargando galería de portada...
        </div>
      ) : (
        <>
          {slides.length === 0 ? (
            <div style={{ border: "1px dashed rgba(212,175,55,0.15)", padding: "30px", textAlign: "center", marginBottom: "16px" }}>
              <p style={{ color: "rgba(245,245,247,0.3)", fontSize: "11px", fontWeight: 300 }}>
                No hay imágenes asignadas a la portada.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
              {slides.map((slide, i) => (
                <div key={slide.id} style={{ border: "1px solid rgba(245,245,247,0.06)", padding: "12px", background: "rgba(245,245,247,0.02)" }}>
                  
                  {/* Contenedor de la Imagen Recortada en Admin */}
                  <div style={{ position: "relative", overflow: "hidden" }}>
                    <img
                      src={slide.image_url}
                      alt=""
                      style={{ width: "100%", height: "110px", objectFit: "cover", display: "block", opacity: 0.85 }}
                    />
                    <span style={{ position: "absolute", bottom: 6, left: 6, background: "rgba(18,18,18,0.8)", color: "rgba(245,245,247,0.6)", fontSize: "8px", padding: "3px 6px", letterSpacing: "0.1em" }}>
                      Posición {i + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteSlide(slide.id, slide.image_url)}
                      style={{ position: "absolute", top: 6, right: 6, background: "#c0392b", border: "none", color: "#fff", width: "22px", height: "22px", cursor: "pointer" }}
                    >✕</button>
                  </div>

                  {/* NUEVO: Botón de Vista Previa Celular */}
                  <button
                    type="button"
                    onClick={() => setPreviewUrl(slide.image_url)}
                    style={{
                      width: "100%",
                      marginTop: "10px",
                      padding: "8px 0",
                      background: "transparent",
                      border: "1px solid rgba(212,175,55,0.3)",
                      color: "#D4AF37",
                      fontSize: "9px",
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      fontWeight: 300
                    }}
                  >
                    👁 Ver Vista Previa Celular
                  </button>

                </div>
              ))}
            </div>
          )}
        </>
      )}

      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        style={{ border: "1px dashed rgba(212,175,55,0.3)", padding: "20px", textAlign: "center", cursor: uploading ? "not-allowed" : "pointer", background: "rgba(245,245,247,0.02)" }}
      >
        <span style={{ fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(192,192,192,0.5)", fontWeight: 300 }}>
          {uploading ? "Subiendo..." : "Añadir nuevas imágenes al Carrusel"}
        </span>
      </div>

      {/* MODAL FLOTANTE DE PREVISUALIZACIÓN MÓVIL */}
      {previewUrl && (
        <div 
          onClick={() => setPreviewUrl(null)} // Cierra al tocar el fondo oscurecido
          style={{
            position: "fixed", inset: 0, zIndex: 9999, background: "rgba(0,0,0,0.85)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px"
          }}
        >
          <p style={{ fontSize: "9px", letterSpacing: "0.3em", color: "rgba(192,192,192,0.6)", textTransform: "uppercase", marginBottom: "12px" }}>
            Asi se vera en celulares:
          </p>

          {/* Simulador de ventana de Celular (Mantiene la proporción 60vh del Hero real) */}
          <div 
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al tocar adentro
            style={{
              width: "100%", maxWidth: "340px", height: "60vh", background: "#121212",
              position: "relative", overflow: "hidden", border: "2px solid #D4AF37", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)"
            }}
          >
            {/* Imagen simulando el comportamiento CSS exacto de la Home */}
            <img 
              src={previewUrl} 
              alt="Preview" 
              style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.5 }} 
            />

            {/* Texto de la marca superpuesto idéntico a la Home */}
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "0 16px" }}>
              <h2 style={{ fontSize: "26px", fontWeight: 200, letterSpacing: "0.15em", color: "#FFF", textTransform: "uppercase", margin: "0 0 8px 0" }}>
                NUEVA <span style={{ fontStyle: "italic", fontWeight: 300, color: "#D4AF37" }}>COLECCIÓN</span>
              </h2>
              <p style={{ fontSize: "8px", letterSpacing: "0.4em", color: "rgba(245,245,247,0.6)", textTransform: "uppercase", margin: 0 }}>
                Ediciones Limitadas • 2026
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={() => setPreviewUrl(null)}
            style={{ marginTop: "20px", background: "#1E1E1E", border: "1px solid rgba(245,245,247,0.15)", color: "rgba(245,245,247,0.7)", padding: "10px 24px", fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Cerrar Vista Previa
          </button>
        </div>
      )}

    </div>
  );
}