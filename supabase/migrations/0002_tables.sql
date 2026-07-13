-- ============================================================================
-- Salsa Top · 0002 · Tablas (26), constraints e índices
-- Todas dentro del schema `saltatop`.
-- ============================================================================
set search_path = saltatop, public;

-- ----------------------------------------------------------------------------
-- 1. perfiles
-- ----------------------------------------------------------------------------
create table if not exists saltatop.perfiles (
  id            uuid primary key default gen_random_uuid(),
  auth_user_id  uuid unique not null references auth.users(id) on delete cascade,
  nombre        text not null,
  apellido      text,
  email         text not null,
  rol           text not null check (rol in ('super_admin','administrador','editor','operador_pedidos')),
  activo        boolean not null default true,
  avatar_url    text,
  ultimo_acceso timestamptz,
  creado_en     timestamptz not null default now(),
  actualizado_en timestamptz not null default now()
);

-- ----------------------------------------------------------------------------
-- 2. configuracion_sitio (un único registro activo)
-- ----------------------------------------------------------------------------
create table if not exists saltatop.configuracion_sitio (
  id                    uuid primary key default gen_random_uuid(),
  nombre_marca          text not null,
  eslogan               text,
  descripcion_corta     text,
  descripcion_larga     text,
  logo_url              text,
  logo_alternativo_url  text,
  favicon_url           text,
  whatsapp              text,
  telefono              text,
  email                 text,
  direccion             text,
  horario_atencion      text,
  instagram_url         text,
  facebook_url          text,
  tiktok_url            text,
  moneda                text default 'PYG',
  simbolo_moneda        text default 'Gs.',
  pais                  text default 'Paraguay',
  compra_minima         numeric default 0 check (compra_minima >= 0),
  costo_envio           numeric default 0 check (costo_envio >= 0),
  envio_gratis_desde    numeric check (envio_gratis_desde >= 0),
  retiro_local_habilitado boolean default true,
  pedidos_habilitados   boolean default true,
  mensaje_confirmacion  text,
  activo                boolean default true,
  creado_en             timestamptz default now(),
  actualizado_en        timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 3. categorias
-- ----------------------------------------------------------------------------
create table if not exists saltatop.categorias (
  id            uuid primary key default gen_random_uuid(),
  nombre        text not null,
  slug          text unique not null,
  descripcion   text,
  imagen_url    text,
  icono         text,
  color         text,
  orden         integer default 0,
  activa        boolean default true,
  creada_en     timestamptz default now(),
  actualizada_en timestamptz default now()
);
create index if not exists idx_categorias_slug on saltatop.categorias(slug);
create index if not exists idx_categorias_activa on saltatop.categorias(activa);

-- ----------------------------------------------------------------------------
-- 7. etiquetas (antes de productos por producto_etiquetas)
-- ----------------------------------------------------------------------------
create table if not exists saltatop.etiquetas (
  id         uuid primary key default gen_random_uuid(),
  nombre     text not null,
  slug       text unique not null,
  color      text,
  activa     boolean default true,
  creada_en  timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 4. productos
-- ----------------------------------------------------------------------------
create table if not exists saltatop.productos (
  id                 uuid primary key default gen_random_uuid(),
  categoria_id       uuid references saltatop.categorias(id) on delete set null,
  nombre             text not null,
  slug               text unique not null,
  codigo             text unique,
  descripcion_corta  text,
  descripcion_larga  text,
  ingredientes       text,
  recomendaciones_uso text,
  presentacion       text,
  contenido_neto     text,
  precio             numeric not null default 0 check (precio >= 0),
  precio_oferta      numeric check (precio_oferta >= 0),
  costo              numeric check (costo >= 0),
  stock              numeric default 0 check (stock >= 0),
  stock_minimo       numeric default 0 check (stock_minimo >= 0),
  controla_stock     boolean default true,
  nivel_picante      integer default 0 check (nivel_picante between 0 and 5),
  imagen_principal_url text,
  destacado          boolean default false,
  nuevo              boolean default false,
  en_oferta          boolean default false,
  activo             boolean default true,
  orden              integer default 0,
  meta_titulo        text,
  meta_descripcion   text,
  creado_en          timestamptz default now(),
  actualizado_en     timestamptz default now()
);
create index if not exists idx_productos_slug on saltatop.productos(slug);
create index if not exists idx_productos_codigo on saltatop.productos(codigo);
create index if not exists idx_productos_categoria on saltatop.productos(categoria_id);
create index if not exists idx_productos_activo on saltatop.productos(activo);
create index if not exists idx_productos_destacado on saltatop.productos(destacado);
create index if not exists idx_productos_nivel_picante on saltatop.productos(nivel_picante);

-- ----------------------------------------------------------------------------
-- 5. producto_imagenes (una sola principal por producto)
-- ----------------------------------------------------------------------------
create table if not exists saltatop.producto_imagenes (
  id                uuid primary key default gen_random_uuid(),
  producto_id       uuid not null references saltatop.productos(id) on delete cascade,
  url               text not null,
  ruta_storage      text,
  texto_alternativo text,
  orden             integer default 0,
  es_principal      boolean default false,
  creada_en         timestamptz default now()
);
create index if not exists idx_prod_img_producto on saltatop.producto_imagenes(producto_id);
create unique index if not exists uq_prod_img_principal
  on saltatop.producto_imagenes(producto_id) where es_principal;

-- ----------------------------------------------------------------------------
-- 6. producto_variantes
-- ----------------------------------------------------------------------------
create table if not exists saltatop.producto_variantes (
  id             uuid primary key default gen_random_uuid(),
  producto_id    uuid not null references saltatop.productos(id) on delete cascade,
  nombre         text not null,
  sku            text unique,
  presentacion   text,
  contenido      text,
  precio         numeric not null check (precio >= 0),
  precio_oferta  numeric check (precio_oferta >= 0),
  stock          numeric default 0 check (stock >= 0),
  activa         boolean default true,
  orden          integer default 0,
  creado_en      timestamptz default now(),
  actualizado_en timestamptz default now()
);
create index if not exists idx_variantes_producto on saltatop.producto_variantes(producto_id);

-- ----------------------------------------------------------------------------
-- 8. producto_etiquetas (PK compuesta)
-- ----------------------------------------------------------------------------
create table if not exists saltatop.producto_etiquetas (
  producto_id  uuid not null references saltatop.productos(id) on delete cascade,
  etiqueta_id  uuid not null references saltatop.etiquetas(id) on delete cascade,
  primary key (producto_id, etiqueta_id)
);

-- ----------------------------------------------------------------------------
-- 9. banners
-- ----------------------------------------------------------------------------
create table if not exists saltatop.banners (
  id                 uuid primary key default gen_random_uuid(),
  titulo             text,
  subtitulo          text,
  descripcion        text,
  imagen_desktop_url text,
  imagen_mobile_url  text,
  texto_boton        text,
  enlace_boton       text,
  posicion_contenido text,
  alineacion         text,
  color_texto        text,
  color_fondo        text,
  overlay            numeric default 0 check (overlay >= 0 and overlay <= 1),
  orden              integer default 0,
  activo             boolean default true,
  fecha_inicio       timestamptz,
  fecha_fin          timestamptz,
  creado_en          timestamptz default now(),
  actualizado_en     timestamptz default now()
);
create index if not exists idx_banners_activo on saltatop.banners(activo);

-- ----------------------------------------------------------------------------
-- 10. secciones_sitio
-- ----------------------------------------------------------------------------
create table if not exists saltatop.secciones_sitio (
  id                uuid primary key default gen_random_uuid(),
  clave             text unique not null,
  titulo            text,
  subtitulo         text,
  contenido         text,
  imagen_url        text,
  imagen_mobile_url text,
  video_url         text,
  texto_boton       text,
  enlace_boton      text,
  configuracion     jsonb default '{}'::jsonb,
  orden             integer default 0,
  activa            boolean default true,
  creado_en         timestamptz default now(),
  actualizado_en    timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 11. beneficios
-- ----------------------------------------------------------------------------
create table if not exists saltatop.beneficios (
  id             uuid primary key default gen_random_uuid(),
  titulo         text not null,
  descripcion    text,
  icono          text,
  imagen_url     text,
  orden          integer default 0,
  activo         boolean default true,
  creado_en      timestamptz default now(),
  actualizado_en timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 12. testimonios
-- ----------------------------------------------------------------------------
create table if not exists saltatop.testimonios (
  id                 uuid primary key default gen_random_uuid(),
  nombre_cliente     text not null,
  cargo_o_descripcion text,
  comentario         text not null,
  calificacion       integer default 5 check (calificacion between 1 and 5),
  imagen_url         text,
  destacado          boolean default false,
  aprobado           boolean default false,
  orden              integer default 0,
  creado_en          timestamptz default now(),
  actualizado_en     timestamptz default now()
);
create index if not exists idx_testimonios_aprobado on saltatop.testimonios(aprobado);

-- ----------------------------------------------------------------------------
-- 13. recetas
-- ----------------------------------------------------------------------------
create table if not exists saltatop.recetas (
  id                        uuid primary key default gen_random_uuid(),
  titulo                    text not null,
  slug                      text unique not null,
  descripcion_corta         text,
  contenido                 text,
  ingredientes              text,
  instrucciones             text,
  imagen_principal_url      text,
  tiempo_preparacion_minutos integer check (tiempo_preparacion_minutos >= 0),
  porciones                 integer check (porciones >= 0),
  dificultad                text,
  activa                    boolean default true,
  destacada                 boolean default false,
  meta_titulo               text,
  meta_descripcion          text,
  creada_en                 timestamptz default now(),
  actualizada_en            timestamptz default now()
);
create index if not exists idx_recetas_slug on saltatop.recetas(slug);

-- ----------------------------------------------------------------------------
-- 14. receta_productos (PK compuesta)
-- ----------------------------------------------------------------------------
create table if not exists saltatop.receta_productos (
  receta_id       uuid not null references saltatop.recetas(id) on delete cascade,
  producto_id     uuid not null references saltatop.productos(id) on delete cascade,
  descripcion_uso text,
  primary key (receta_id, producto_id)
);

-- ----------------------------------------------------------------------------
-- 15. clientes
-- ----------------------------------------------------------------------------
create table if not exists saltatop.clientes (
  id             uuid primary key default gen_random_uuid(),
  nombre         text not null,
  apellido       text,
  telefono       text not null,
  email          text,
  documento      text,
  ciudad         text,
  barrio         text,
  direccion      text,
  referencia     text,
  notas          text,
  activo         boolean default true,
  creado_en      timestamptz default now(),
  actualizado_en timestamptz default now()
);
create index if not exists idx_clientes_telefono on saltatop.clientes(telefono);
create index if not exists idx_clientes_email on saltatop.clientes(email);

-- ----------------------------------------------------------------------------
-- 19. cupones (antes de pedidos por FK cupon_id)
-- ----------------------------------------------------------------------------
create table if not exists saltatop.cupones (
  id                uuid primary key default gen_random_uuid(),
  codigo            text unique not null,
  descripcion       text,
  tipo_descuento    text not null check (tipo_descuento in ('porcentaje','monto_fijo','envio_gratis')),
  valor             numeric not null check (valor >= 0),
  compra_minima     numeric default 0 check (compra_minima >= 0),
  limite_usos       integer,
  limite_por_cliente integer,
  usos_actuales     integer default 0,
  fecha_inicio      timestamptz,
  fecha_fin         timestamptz,
  activo            boolean default true,
  creado_en         timestamptz default now(),
  actualizado_en    timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 21. metodos_pago
-- ----------------------------------------------------------------------------
create table if not exists saltatop.metodos_pago (
  id             uuid primary key default gen_random_uuid(),
  nombre         text not null,
  descripcion    text,
  instrucciones  text,
  icono          text,
  orden          integer default 0,
  activo         boolean default true,
  creado_en      timestamptz default now(),
  actualizado_en timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 22. metodos_entrega
-- ----------------------------------------------------------------------------
create table if not exists saltatop.metodos_entrega (
  id             uuid primary key default gen_random_uuid(),
  nombre         text not null,
  descripcion    text,
  costo          numeric default 0 check (costo >= 0),
  compra_minima  numeric default 0 check (compra_minima >= 0),
  orden          integer default 0,
  activo         boolean default true,
  creado_en      timestamptz default now(),
  actualizado_en timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 16. pedidos
-- ----------------------------------------------------------------------------
create table if not exists saltatop.pedidos (
  id                    uuid primary key default gen_random_uuid(),
  numero                text unique not null,
  cliente_id            uuid references saltatop.clientes(id) on delete set null,
  nombre_cliente        text not null,
  telefono_cliente      text not null,
  email_cliente         text,
  ciudad                text,
  barrio                text,
  direccion_entrega     text,
  referencia_entrega    text,
  estado                text not null default 'pendiente'
                          check (estado in ('pendiente','confirmado','preparando','listo','enviado','entregado','cancelado')),
  estado_pago           text not null default 'pendiente'
                          check (estado_pago in ('pendiente','pagado','rechazado','reembolsado')),
  metodo_pago           text,
  metodo_entrega        text,
  subtotal              numeric default 0 check (subtotal >= 0),
  descuento             numeric default 0 check (descuento >= 0),
  costo_envio           numeric default 0 check (costo_envio >= 0),
  total                 numeric default 0 check (total >= 0),
  cupon_id              uuid references saltatop.cupones(id) on delete set null,
  observaciones_cliente text,
  observaciones_internas text,
  origen                text default 'web',
  creado_en             timestamptz default now(),
  actualizado_en        timestamptz default now(),
  confirmado_en         timestamptz,
  preparando_en         timestamptz,
  enviado_en            timestamptz,
  entregado_en          timestamptz,
  cancelado_en          timestamptz
);
create index if not exists idx_pedidos_numero on saltatop.pedidos(numero);
create index if not exists idx_pedidos_estado on saltatop.pedidos(estado);
create index if not exists idx_pedidos_estado_pago on saltatop.pedidos(estado_pago);
create index if not exists idx_pedidos_creado_en on saltatop.pedidos(creado_en);
create index if not exists idx_pedidos_cliente on saltatop.pedidos(cliente_id);

-- ----------------------------------------------------------------------------
-- 17. pedido_items (snapshot histórico de nombre/precio/variante)
-- ----------------------------------------------------------------------------
create table if not exists saltatop.pedido_items (
  id                  uuid primary key default gen_random_uuid(),
  pedido_id           uuid not null references saltatop.pedidos(id) on delete cascade,
  producto_id         uuid references saltatop.productos(id) on delete set null,
  variante_id         uuid references saltatop.producto_variantes(id) on delete set null,
  nombre_producto     text not null,
  descripcion_variante text,
  cantidad            numeric not null check (cantidad > 0),
  precio_unitario     numeric not null check (precio_unitario >= 0),
  descuento           numeric default 0 check (descuento >= 0),
  subtotal            numeric not null check (subtotal >= 0),
  creado_en           timestamptz default now()
);
create index if not exists idx_pedido_items_pedido on saltatop.pedido_items(pedido_id);

-- ----------------------------------------------------------------------------
-- 18. pedido_historial
-- ----------------------------------------------------------------------------
create table if not exists saltatop.pedido_historial (
  id              uuid primary key default gen_random_uuid(),
  pedido_id       uuid not null references saltatop.pedidos(id) on delete cascade,
  estado_anterior text,
  estado_nuevo    text not null,
  comentario      text,
  usuario_id      uuid references saltatop.perfiles(id) on delete set null,
  creado_en       timestamptz default now()
);
create index if not exists idx_pedido_historial_pedido on saltatop.pedido_historial(pedido_id);

-- ----------------------------------------------------------------------------
-- 20. cupon_usos
-- ----------------------------------------------------------------------------
create table if not exists saltatop.cupon_usos (
  id         uuid primary key default gen_random_uuid(),
  cupon_id   uuid references saltatop.cupones(id) on delete cascade,
  pedido_id  uuid references saltatop.pedidos(id) on delete cascade,
  cliente_id uuid references saltatop.clientes(id) on delete set null,
  creado_en  timestamptz default now()
);
create index if not exists idx_cupon_usos_cupon on saltatop.cupon_usos(cupon_id);

-- ----------------------------------------------------------------------------
-- 23. mensajes_contacto
-- ----------------------------------------------------------------------------
create table if not exists saltatop.mensajes_contacto (
  id             uuid primary key default gen_random_uuid(),
  nombre         text not null,
  telefono       text,
  email          text,
  asunto         text,
  mensaje        text not null,
  estado         text default 'nuevo' check (estado in ('nuevo','en_revision','respondido','archivado')),
  notas_internas text,
  creado_en      timestamptz default now(),
  respondido_en  timestamptz
);

-- ----------------------------------------------------------------------------
-- 24. suscriptores
-- ----------------------------------------------------------------------------
create table if not exists saltatop.suscriptores (
  id             uuid primary key default gen_random_uuid(),
  nombre         text,
  email          text unique not null,
  activo         boolean default true,
  origen         text default 'web',
  creado_en      timestamptz default now(),
  actualizado_en timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 25. archivos (multimedia)
-- ----------------------------------------------------------------------------
create table if not exists saltatop.archivos (
  id                uuid primary key default gen_random_uuid(),
  nombre            text not null,
  url               text not null,
  ruta_storage      text not null,
  mime_type         text,
  tamano_bytes      bigint,
  tipo              text,
  texto_alternativo text,
  usuario_id        uuid references saltatop.perfiles(id) on delete set null,
  creado_en         timestamptz default now()
);

-- ----------------------------------------------------------------------------
-- 26. auditoria
-- ----------------------------------------------------------------------------
create table if not exists saltatop.auditoria (
  id               uuid primary key default gen_random_uuid(),
  usuario_id       uuid references saltatop.perfiles(id) on delete set null,
  accion           text not null,
  entidad          text not null,
  entidad_id       uuid,
  datos_anteriores jsonb,
  datos_nuevos     jsonb,
  ip               text,
  user_agent       text,
  creado_en        timestamptz default now()
);
create index if not exists idx_auditoria_usuario on saltatop.auditoria(usuario_id);
create index if not exists idx_auditoria_entidad on saltatop.auditoria(entidad, entidad_id);
