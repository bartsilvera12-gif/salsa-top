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

## Despliegue en Coolify

1. Crear un recurso **Application** desde este repositorio (rama `main`).
2. Build pack: **Nixpacks** (Node). Build: `npm run build` · Start: `npm run start`.
3. Cargar las variables de entorno (las de `.env.example`).
   `SUPABASE_SERVICE_ROLE_KEY` solo como variable de servidor.
4. Puerto: `3000`. Node ≥ 20.
5. Desplegar. Verificar `/` (público) y `/admin/login`.

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
