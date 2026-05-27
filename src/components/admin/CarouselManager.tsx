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
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Cargar las imágenes actuales del carrusel
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
      alert("No se pudieron cargar las imágenes del carrusel.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  // 2. Subir una nueva imagen al carrusel
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        // Limpiamos el nombre del archivo para evitar problemas de caracteres
        const cleanFileName = file.name
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .replace(/[^a-zA-Z0-9.-]/g, "-")
          .toLowerCase();
        
        const fileName = `carousel-${Date.now()}-${cleanFileName}`;

        // Subir al bucket existente "product-images" (reutilizamos el mismo para no complicar los buckets)
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("product-images")
          .upload(`carousel/${fileName}`, file);

        if (uploadError) throw uploadError;

        // Obtener la URL pública
        const { data: { publicUrl } } = supabase.storage
          .from("product-images")
          .getPublicUrl(`carousel/${fileName}`);

        if (!publicUrl) throw new Error("No se pudo generar la URL pública.");

        // Insertar el registro en la tabla que lee el HeroCarousel
        const { error: dbError } = await supabase
          .from("home_slides")
          .insert([{ image_url: publicUrl }]);

        if (dbError) throw dbError;
      }

      // Refrescar la lista de imágenes en pantalla
      await fetchSlides();
    } catch (err: any) {
      console.error("Error al subir banner:", err);
      alert("Error al subir la imagen: " + (err.message || err));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // 3. Eliminar una imagen del carrusel
  const handleDeleteSlide = async (id: number, imageUrl: string) => {
    if (!confirm("¿Estás segura de que querés eliminar esta imagen de la portada?")) return;

    try {
      // Opcional: Podríamos borrar el archivo del Storage, pero para asegurar la integridad 
      // y velocidad eliminamos directo el registro de la base de datos primero.
      const { error: dbError } = await supabase
        .from("home_slides")
        .delete()
        .eq("id", id);

      if (dbError) throw dbError;

      // Intentar limpiar el storage de forma secundaria (sin trabar si falla)
      try {
        const urlParts = imageUrl.split("/product-images/");
        if (urlParts.length > 1) {
          const storagePath = urlParts[1];
          await supabase.storage.from("product-images").remove([storagePath]);
        }
      } catch (storageErr) {
        console.warn("No se pudo remover del storage físico, pero se quitó de la BD:", storageErr);
      }

      // Actualizar estado local de forma reactiva rápida
      setSlides(prev => prev.filter(slide => slide.id !== id));
    } catch (err) {
      console.error("Error al eliminar slide:", err);
      alert("No se pudo eliminar la imagen.");
    }
  };

  // Estilos coordinados con tu UI minimalista/dark de joyería de lujo
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
        <div style={{ padding: "20px 0", color: "rgba(245,245,247,0.4)", fontSize: "11px", letterSpacing: "0.1em" }}>
          Cargando galería de portada...
        </div>
      ) : (
        <>
          {slides.length === 0 ? (
            <div style={{ border: "1px dashed rgba(212,175,55,0.15)", padding: "30px", textAlign: "center", marginBottom: "16px" }}>
              <p style={{ color: "rgba(245,245,247,0.3)", fontSize: "11px", fontWeight: 300, letterSpacing: "0.05em" }}>
                No hay imágenes asignadas a la portada. Se mostrará un fondo elegante de respaldo.
              </p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px", marginBottom: "16px" }}>
              {slides.map((slide, i) => (
                <div key={slide.id} style={{ position: "relative", border: "1px solid rgba(212,175,55,0.2)", overflow: "hidden" }}>
                  <img
                    src={slide.image_url}
                    alt=""
                    style={{ width: "100%", height: "120px", objectFit: "cover", display: "block", opacity: 0.85 }}
                  />
                  {/* Badge identificador de posición */}
                  <span style={{ position: "absolute", bottom: 6, left: 6, background: "rgba(18,18,18,0.7)", color: "rgba(245,245,247,0.6)", fontSize: "8px", padding: "2px 5px", letterSpacing: "0.1em" }}>
                    Vista {i + 1}
                  </span>
                  {/* Botón de borrado */}
                  <button
                    type="button"
                    onClick={() => handleDeleteSlide(slide.id, slide.image_url)}
                    style={{
                      position: "absolute",
                      top: 6,
                      right: 6,
                      background: "#c0392b",
                      border: "none",
                      color: "#fff",
                      width: "22px",
                      height: "22px",
                      cursor: "pointer",
                      fontSize: "10px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.5)"
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Dropzone / Botón de Acción para subir nuevas fotos */}
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        style={{
          border: "1px dashed rgba(212,175,55,0.3)",
          padding: "20px",
          textAlign: "center",
          cursor: uploading ? "not-allowed" : "pointer",
          transition: "border-color 0.2s",
          background: "rgba(245,245,247,0.02)",
        }}
        onMouseEnter={e => !uploading && (e.currentTarget.style.borderColor = "rgba(212,175,55,0.6)")}
        onMouseLeave={e => !uploading && (e.currentTarget.style.borderColor = "rgba(212,175,55,0.3)")}
      >
        <span style={{ fontSize: "9px", letterSpacing: "0.25em", textTransform: "uppercase", color: uploading ? "#D4AF37" : "rgba(192,192,192,0.5)", fontWeight: 300 }}>
          {uploading ? "Subiendo archivos a la portada..." : "Añadir nuevas imágenes al Carrusel"}
        </span>
      </div>
    </div>
  );
}