# Salsa Top — Tienda + Panel administrativo

Aplicación web de **Salsa Top** (marca artesanal gourmet de salsas, Paraguay):
sitio público + panel de administración, con **Next.js (App Router) + TypeScript
+ Tailwind CSS + Supabase** (PostgreSQL, Auth, Storage).

> El sitio estático original quedó respaldado en la rama **`static-legacy`** y en
> la carpeta raíz (`index.html`) hasta completar el corte a la nueva versión.

## Stack

- **Next.js 15** (App Router, Server Components, Server Actions) · **React 19** · **TypeScript**
- **Tailwind CSS** con la identidad visual de Salsa Top (paleta de fuego, Barlow / Barlow Condensed)
- **Supabase**: PostgreSQL (schema `saltatop`), Auth (email/contraseña), Storage
- **Zod** + **React Hook Form** para validación de formularios
- Despliegue en **Coolify** (Node, `output: standalone`)

## Requisitos

- Node.js ≥ 20
- Una instancia de Supabase (self-hosted en Coolify o Supabase Cloud)

## Instalación local

```bash
npm install
cp .env.example .env.local   # completar valores
npm run dev
```

Scripts:

```bash
npm run dev        # desarrollo
npm run build      # build de producción
npm run start      # servir el build
npm run lint       # ESLint
npm run typecheck  # TypeScript sin emitir
```

## Variables de entorno (`.env.example`)

| Variable | Descripción |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL pública de Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clave anónima (navegador) |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave service_role — **solo servidor**, nunca exponer |
| `NEXT_PUBLIC_SITE_URL` | URL pública del sitio (SEO / OG) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp de la marca (solo dígitos) |

## Configurar Supabase

1. **Aplicar migraciones** (en orden) desde `supabase/migrations/`:
   `0001_schema.sql` → `0002_tables.sql` → `0003_functions_triggers.sql`
   → `0004_rls.sql` → `0005_storage.sql`.
   Con Supabase CLI: `supabase db push`. O ejecutá cada archivo en el SQL editor.
2. **Exponer el schema `saltatop` en la API** (PostgREST):
   - **Self-hosted (Coolify):** en el servicio `rest`, setear
     `PGRST_DB_SCHEMAS=public,graphql_public,storage,saltatop` y reiniciar.
   - **Supabase Cloud:** Dashboard → Project Settings → API → *Exposed schemas*
     → agregar `saltatop`.
3. **Cargar datos iniciales:** ejecutar `supabase/seed.sql`.
4. **Crear el primer super_admin:** ver `supabase/primer_admin.sql`.

### Crear el primer super_admin

1. Crear el usuario en **Supabase Auth** (Dashboard → Authentication → Add user).
2. Ejecutar `supabase/primer_admin.sql` reemplazando el email por el del usuario.
3. Verificar `rol = 'super_admin'` y `activo = true`.
4. Ingresar en `/admin/login`.

> El acceso al panel exige: sesión válida **+** perfil en `saltatop.perfiles`
> **+** perfil activo **+** rol autorizado. No basta con estar registrado en Auth.

## Exponer el schema `saltatop` en PostgREST (self-hosted)

Requisito para que la API vea `saltatop`. El schema ya se agregó a la config del
rol `authenticator`; PostgREST debe **recargar** para tomarlo. En Supabase
self-hosted, el `NOTIFY pgrst, 'reload config'` puede no llegar si PostgREST se
conecta vía pooler, así que la vía segura es **reiniciar el servicio `rest`**:

```bash
# Ubicar el contenedor de PostgREST
docker ps --format '{{.Names}}' | grep -i rest
# Reiniciarlo (nombre típico: supabase-rest o <stack>-rest-1)
docker restart <nombre-del-contenedor-rest>
```

Si PostgREST toma los schemas desde variable de entorno (`PGRST_DB_SCHEMAS`) en
vez de la config del rol, agregar `saltatop` a esa lista y reiniciar.

Verificar (debe dar HTTP 200):

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
  "https://<tu-api>/rest/v1/categorias?select=nombre&limit=1" \
  -H "apikey: <ANON_KEY>" -H "Accept-Profile: saltatop"
```

## Despliegue en Vercel (recomendado para Next.js)

1. En [vercel.com](https://vercel.com) → **Add New → Project** → importar el repo
   `bartsilvera12-gif/salsa-top` (rama `main`). Framework: **Next.js** (autodetectado).
2. En **Environment Variables**, cargar las 5 de `.env.example`:
   `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   `SUPABASE_SERVICE_ROLE_KEY` (secreta), `NEXT_PUBLIC_SITE_URL`,
   `NEXT_PUBLIC_WHATSAPP_NUMBER`.
3. **Deploy**. Verificar `/` (público) y `/admin/login`.
4. (Opcional) Configurar el dominio propio en Vercel → Settings → Domains.

> El sitio estático original sigue intacto en GitHub Pages y en la rama
> `static-legacy` hasta hacer el corte final.

### Alternativa: self-host (Docker / VPS)

`next.config.mjs` ya usa `output: "standalone"`. Build con `npm run build` y
correr `node .next/standalone/server.js` (o `npm run start`) en el puerto `3000`
con las mismas variables de entorno.

## Estructura

```
src/app/            Rutas (públicas y /admin)
src/lib/            Utilidades, clientes de Supabase, env
supabase/migrations Migraciones SQL versionadas (schema saltatop)
supabase/seed.sql   Datos iniciales
public/             Imágenes de marca
legacy/ | rama static-legacy  Respaldo del sitio estático original
```

## Identidad visual

Colores: Rojo `#EF3340` · Naranja `#FF8200` · Amarillo `#FFD100` · Negro `#000000`
· Verde petróleo `#1E5155` · fondos crema `#FFF4EA`.
Tipografías: **Barlow Condensed** (títulos/botones) y **Barlow** (texto).

---

Hecho con fuego 🔥 y tradición.
