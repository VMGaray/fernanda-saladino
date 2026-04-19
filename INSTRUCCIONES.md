# 🛍️ E-commerce Fernanda Saladino - Instrucciones de Configuración

## ✅ Funcionalidades Implementadas

### 1. **Múltiples Imágenes por Producto**
- Galería de imágenes con navegación
- Miniaturas clickeables
- Formulario de admin actualizado para subir múltiples fotos

### 2. **Sistema de Carrito de Compras**
- Agregar productos al carrito
- Ver carrito lateral (drawer)
- Modificar cantidades
- Eliminar productos
- Persistencia en localStorage
- Botón flotante con contador de items

### 3. **Checkout por WhatsApp**
- Formulario para datos del cliente (nombre y teléfono)
- Envío automático del pedido por WhatsApp a: **11-5181-8438**
- Mensaje estructurado con todos los productos y el total
- Confirmación visual para el usuario

---

## 🔧 Configuración Requerida en Supabase

### PASO 1: Ejecutar el Script SQL

Ve a tu proyecto en Supabase → SQL Editor y ejecuta el siguiente script:

```sql
-- Agregar columna 'images' tipo JSONB para almacenar array de URLs
ALTER TABLE products
ADD COLUMN IF NOT EXISTS images JSONB;

-- (Opcional) Migrar productos existentes
UPDATE products
SET images = jsonb_build_array(image_url)
WHERE images IS NULL AND image_url IS NOT NULL;
```

### PASO 2: Verificar el Storage Bucket

Asegúrate de que el bucket `product-images` existe y tiene políticas públicas:

1. Ve a **Storage** en Supabase
2. Verifica que existe el bucket `product-images`
3. Configura la política de acceso público:
   - Ir a Policies
   - Crear policy: **Public Access**
   - Target: `SELECT`
   - Policy definition: `true`

---

## 📱 Cómo Funciona el Checkout por WhatsApp

1. El usuario **agrega productos al carrito** desde la página de detalle
2. Hace click en el **botón flotante del carrito** (abajo a la derecha)
3. Revisa su pedido y presiona **"Finalizar Pedido"**
4. Ingresa su **nombre y teléfono**
5. Presiona **"Enviar Pedido por WhatsApp"**
6. Se abre WhatsApp automáticamente con el mensaje del pedido dirigido a: **11-5181-8438**
7. El usuario ve un mensaje de confirmación: _"Pedido Enviado! Fernanda se comunicará contigo pronto..."_
8. El carrito se limpia automáticamente

### Ejemplo de Mensaje que Recibe Fernanda:

```
🛍️ NUEVO PEDIDO - Fernanda Saladino

👤 Cliente: Juan Pérez
📱 Teléfono: 1122334455

📦 PRODUCTOS:
━━━━━━━━━━━━━━━━

▪️ Cartera Bandolera
   Cantidad: 1
   Precio unit: $25.000
   Subtotal: $25.000

▪️ Cinturón de Cuero
   Cantidad: 2
   Precio unit: $12.000
   Subtotal: $24.000

━━━━━━━━━━━━━━━━
💰 TOTAL: $49.000

Pedido generado desde el e-commerce
```

---

## 🚀 Para Probar el Sistema

1. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

2. **Ir al panel de admin:**
   ```
   http://localhost:3000/admin
   ```

3. **Subir un producto con múltiples imágenes:**
   - Nombre del producto
   - Precio
   - Categoría
   - Seleccionar **múltiples imágenes** (puedes elegir varias a la vez)
   - Click en "Subir a la Tienda"

4. **Ver el producto en una categoría:**
   ```
   http://localhost:3000/categoria/carteras
   ```

5. **Hacer click en el producto** para ver la página de detalle

6. **Agregar al carrito** y probar el checkout

---

## 📂 Archivos Nuevos/Modificados

### Nuevos:
- `src/context/CartContext.tsx` - Manejo del estado global del carrito
- `src/components/Cart.tsx` - Componente del carrito lateral
- `src/components/ProductImageGallery.tsx` - Galería de imágenes
- `supabase-migration.sql` - Script de migración para la BD
- `INSTRUCCIONES.md` - Este archivo

### Modificados:
- `src/app/layout.tsx` - Agregado CartProvider y Cart global
- `src/app/producto/[id]/page.tsx` - Convertido a Client Component, agregado botón de carrito
- `src/components/admin/ProductForm.tsx` - Soporte para múltiples imágenes
- `src/components/CategoryView.tsx` - Links a detalle de producto

---

## 💡 Próximos Pasos Sugeridos

1. **Autenticación de Admin** - Proteger /admin con login
2. **Gestión de Productos** - Editar y eliminar productos desde el admin
3. **Página de Gift Card** - Crear la página que ya está en el menú
4. **Productos Relacionados** - Mostrar sugerencias en la página de detalle
5. **Filtros** - Por precio, categoría, nuevos, etc.
6. **Búsqueda** - Buscador de productos
7. **Stock** - Control de inventario
8. **Descripción personalizada** - Campo de descripción único para cada producto

---

## 🎨 Paleta de Colores

```js
brand-black: #121212
brand-dark: #1E1E1E
brand-light: #F5F5F7
brand-accent: #D4AF37 (dorado)
brand-silver: #C0C0C0
```

---

## 📞 Contacto WhatsApp

**Número configurado:** 11-5181-8438

Para cambiar el número, editar en:
- `src/app/producto/[id]/page.tsx` (línea 83)
- `src/components/Cart.tsx` (línea 63)

---

¡Todo listo! 🎉
