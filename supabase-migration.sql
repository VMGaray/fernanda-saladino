-- Script para agregar soporte de múltiples imágenes a la tabla products
-- Ejecutar esto en Supabase SQL Editor

-- 1. Agregar columna 'images' tipo JSONB para almacenar array de URLs
ALTER TABLE products
ADD COLUMN IF NOT EXISTS images JSONB;

-- 2. (Opcional) Migrar productos existentes: copiar image_url al array images
-- Solo si ya tenés productos cargados
UPDATE products
SET images = jsonb_build_array(image_url)
WHERE images IS NULL AND image_url IS NOT NULL;

-- 3. Verificar que se agregó correctamente
SELECT id, name, image_url, images FROM products LIMIT 5;
