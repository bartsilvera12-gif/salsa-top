# Despliegue en Hostinger (hosting compartido / Apache, sin Node.js)

## Cómo está organizado el proyecto

- **El código fuente vive en `main`**, y es la versión principal del proyecto:
  la app Next.js en `src/` y los assets en `public/`. Todo cambio se hace acá.
- **`out/` es el resultado del build**, no una copia del proyecto. Se genera con
  `npm run build`, **no reemplaza al código fuente** y no se commitea
  (está en `.gitignore`). Se puede borrar y regenerar cuando sea.
- **A Hostinger se sube el contenido de `out/`**, dentro de `public_html`.

El sitio se compila 100 % estático (`output: 'export'`), porque el hosting
compartido de Hostinger **no ejecuta Node.js**.

## 1. Generar el build estático

```bash
npm ci
# Solo se hornean las NEXT_PUBLIC_* (URL + anon key = PÚBLICAS por diseño).
# La SUPABASE_SERVICE_ROLE_KEY NO se usa en el build ni se sube nunca.
#   .env.local (o variables de entorno):
#   NEXT_PUBLIC_SUPABASE_URL=https://api.neura.com.py
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
#   NEXT_PUBLIC_SITE_URL=https://tudominio.com
#   NEXT_PUBLIC_WHATSAPP_NUMBER=595993605100
npm run build          # genera out/ (+ postbuild copia el .htaccess)
```

## 2. Probar el build en local (antes de subir)

```bash
npx serve out -l 8095   # abrir http://localhost:8095
```

Sirve `out/` con un servidor web real, igual que lo hará Hostinger. Es la única
forma válida de probarlo: abrir `out/index.html` con doble clic (`file://`) se ve
roto, porque el sitio usa rutas absolutas (`/_next/…`) que necesitan un servidor.

## 3. Subir a Hostinger

- Subí **todo el contenido de `out/`** (no la carpeta, su contenido) dentro de
  **`public_html`**, incluido el **`.htaccess`** (activá "mostrar ocultos" en el
  administrador de archivos / FileZilla).
- Debe quedar `public_html/index.html`, `public_html/_next/…`, `public_html/.htaccess`, etc.

> ⚠️ **Desplegar en la RAÍZ de `public_html`.** El sitio usa rutas absolutas
> (`/_next/…`, `/logo-icono.png`). Si lo pusieras en un subdirectorio, habría que
> configurar `basePath` + `assetPrefix` y reconstruir. En la raíz: sin cambios.

## 4. Qué resuelve el `.htaccess` (incluido en `out/`)

- **Rutas directas**: Next genera `/ruta/index.html`; Apache las sirve al entrar
  a `/ruta/` (y agrega la barra final si falta). Rutas sin carpeta caen a `.html`.
- **HTTPS forzado** (Hostinger ya trae el certificado).
- **404** propio de Next (`/404.html`).
- **MIME types** de `.js/.mjs/.css/.woff2/.webp/.svg`, por si el hosting no los trae.
- **Caché** larga e inmutable para assets con hash; HTML sin caché agresiva.
- **Compresión** gzip.

## 5. Rutas dinámicas

Como el export no admite parámetros desconocidos (`[id]`, `[numero]`), esas
pantallas se sirven como **HTML base + render en el navegador** leyendo el
parámetro de la query (`?id=…`). Ej.: `/admin/productos/editar/?id=abc` sirve el
HTML de `editar/` y el navegador carga el producto. **Funciona con acceso directo.**

## 6. Requisitos del lado de Supabase (una vez)

1. **Exponer el schema `saltatop`** en PostgREST (reiniciar el servicio `rest`).
2. Desplegar la **Edge Function `crear-usuario`** (para alta de admins sin
   exponer la service_role): `supabase functions deploy crear-usuario`.

## 7. Checklist de verificación (Apache, sin Node)

- [ ] `https://tudominio.com/` carga (home pública).
- [ ] Recarga directa de `/carrito/`, `/checkout/`, `/admin/login/` (F5) → OK.
- [ ] Assets (`/_next/…`, imágenes) cargan desde cualquier subruta.
- [ ] Login en `/admin/login/` → entra al panel.
- [ ] CRUD del panel guarda (vía RLS).
- [ ] Checkout crea el pedido (RPC) y muestra la confirmación.
- [ ] Sin errores de consola; sin peticiones a rutas de servidor.

**Seguridad:** la protección la hace **RLS** en la base + Auth (JWT). El anon key
es público por diseño; la **service_role nunca** está en el frontend.
