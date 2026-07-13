-- ============================================================================
-- Salsa Top · seed inicial (idempotente)
-- Contenido extraído del sitio estático actual. Precios en 0 (placeholders):
-- se completan desde el panel /admin. Imágenes servidas desde /public.
-- ============================================================================
set search_path = saltatop, public;

-- ---------------------------------------------------------------------------
-- Configuración del sitio (un único registro activo)
-- ---------------------------------------------------------------------------
insert into saltatop.configuracion_sitio (
  nombre_marca, eslogan, descripcion_corta, descripcion_larga,
  logo_url, favicon_url, whatsapp, telefono,
  instagram_url, facebook_url, tiktok_url,
  moneda, simbolo_moneda, pais, retiro_local_habilitado, pedidos_habilitados,
  mensaje_confirmacion, activo
)
select
  'Salsa Top',
  'No es solo una salsa. Es una experiencia gourmet.',
  'Salsas artesanales gourmet del Paraguay.',
  'Salsas picantes, agridulces y untables elaboradas de forma artesanal, con ingredientes naturales de nuestra propia finca. Sabor auténtico, sin colorantes ni esencias artificiales.',
  '/logo-icono.png', '/logo-icono.png', '595994208200', '0994 208 200',
  'https://www.instagram.com/salsa.top.py',
  'https://www.facebook.com/share/1BYp9aQXAG/',
  'https://www.tiktok.com/@salsa.top.py',
  'PYG', 'Gs.', 'Paraguay', true, true,
  '¡Gracias por tu pedido! Te contactaremos por WhatsApp para confirmarlo.', true
where not exists (select 1 from saltatop.configuracion_sitio);

-- ---------------------------------------------------------------------------
-- Categorías
-- ---------------------------------------------------------------------------
insert into saltatop.categorias (nombre, slug, descripcion, orden, activa) values
  ('Salsas picantes',   'salsas-picantes',   'Nuestra línea con carácter y fuego.', 1, true),
  ('Salsas agridulces', 'salsas-agridulces', 'El balance justo entre dulzor y sabor.', 2, true),
  ('Untables',          'untables',          'Cremosas y envolventes, ideales para untar.', 3, true),
  ('Combos gourmet',    'combos-gourmet',    'Selecciones para regalar o disfrutar.', 4, true),
  ('Ediciones especiales','ediciones-especiales','Lanzamientos y series limitadas.', 5, true)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Etiquetas
-- ---------------------------------------------------------------------------
insert into saltatop.etiquetas (nombre, slug, activa) values
  ('Artesanal', 'artesanal', true),
  ('Natural', 'natural', true),
  ('Gourmet', 'gourmet', true),
  ('Sin colorantes artificiales', 'sin-colorantes-artificiales', true),
  ('Picante', 'picante', true),
  ('Agridulce', 'agridulce', true),
  ('Edición especial', 'edicion-especial', true)
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Productos (6) — precio 0 (placeholder), contenido neto 30 g
-- ---------------------------------------------------------------------------
insert into saltatop.productos
  (categoria_id, nombre, slug, descripcion_corta, contenido_neto, presentacion,
   nivel_picante, imagen_principal_url, activo, destacado, orden)
values
  ((select id from saltatop.categorias where slug='untables'),
   'Salsa de Ajo Ahumado', 'salsa-de-ajo-ahumado',
   'Aromática y envolvente, con ese toque ahumado. Ideal para untar, marinar y acompañar.',
   '30 g', 'Sachet', 1, '/salsa-ajo.jpg', true, true, 1),
  ((select id from saltatop.categorias where slug='salsas-agridulces'),
   'Salsa Barbacoa', 'salsa-barbacoa',
   'El balance justo entre dulzor y ahumado. Perfecta para carnes, papas y snacks.',
   '30 g', 'Sachet', 1, '/salsa-barbacoa.jpg', true, true, 2),
  ((select id from saltatop.categorias where slug='salsas-picantes'),
   'Salsa Picante de Mango con Habanero', 'salsa-picante-de-mango-con-habanero',
   'El dulzor tropical del mango con el fuego del habanero. Intensa y con carácter.',
   '30 g', 'Sachet', 4, '/salsa-mango-habanero.jpg', true, true, 3),
  ((select id from saltatop.categorias where slug='salsas-picantes'),
   'Salsa Picante de Morrones con Nueces', 'salsa-picante-de-morrones-con-nueces',
   'Morrones asados y nueces para un picante con textura, cuerpo y elegancia.',
   '30 g', 'Sachet', 3, '/salsa-morrones-nueces.jpg', true, true, 4),
  ((select id from saltatop.categorias where slug='salsas-picantes'),
   'Salsa Picante de Piña con Pimienta', 'salsa-picante-de-pina-con-pimienta',
   'Piña jugosa y pimienta: fresco, dulce y picante en cada bocado.',
   '30 g', 'Sachet', 3, '/salsa-pina-pimienta.jpg', true, false, 5),
  ((select id from saltatop.categorias where slug='salsas-picantes'),
   'Salsa Picante de Tomate con Especias', 'salsa-picante-de-tomate-con-especias',
   'Tomate maduro y especias seleccionadas: el picante clásico que va con todo.',
   '30 g', 'Sachet', 2, '/salsa-tomate-especias.jpg', true, false, 6)
on conflict (slug) do nothing;

-- Etiquetas base para todos los productos (Artesanal, Natural, Sin colorantes)
insert into saltatop.producto_etiquetas (producto_id, etiqueta_id)
select p.id, e.id
from saltatop.productos p
cross join saltatop.etiquetas e
where e.slug in ('artesanal','natural','sin-colorantes-artificiales')
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- Beneficios ("Por qué Salsa Top")
-- ---------------------------------------------------------------------------
insert into saltatop.beneficios (titulo, descripcion, icono, orden, activo)
select v.titulo, v.descripcion, v.icono, v.orden, true
from (values
  ('Elaboración artesanal', 'Cada lote se elabora a mano, con procesos cuidados y control de calidad.', 'hand', 1),
  ('Ingredientes naturales', 'Materias primas frescas y seleccionadas de nuestra propia finca.', 'leaf', 2),
  ('Sin aditivos artificiales', 'Sin colorantes ni esencias artificiales. Solo sabor real.', 'sparkles', 3),
  ('Calidad garantizada', 'Estándares orientados a certificaciones HACCP e ISO 9001.', 'shield-check', 4)
) as v(titulo, descripcion, icono, orden)
where not exists (select 1 from saltatop.beneficios b where b.titulo = v.titulo);

-- ---------------------------------------------------------------------------
-- Secciones editables del sitio
-- ---------------------------------------------------------------------------
insert into saltatop.secciones_sitio (clave, titulo, subtitulo, contenido, texto_boton, enlace_boton, orden, activa) values
  ('hero', 'No es solo una salsa. Es una experiencia gourmet.', 'Artesanal · Gourmet · Paraguay',
   'Salsas picantes, agridulces y untables elaboradas de forma artesanal, con ingredientes naturales de nuestra propia finca. Sabor auténtico, sin colorantes ni esencias artificiales.',
   'Ver productos', '/productos', 1, true),
  ('historia', 'De la tradición familiar a tu mesa', 'Quiénes somos',
   'Somos una marca artesanal paraguaya que elabora salsas gourmet con ingredientes naturales de cultivo propio, cuidando cada paso del proceso.',
   null, null, 2, true),
  ('objetivo', 'Nuestro objetivo', 'Hacia dónde vamos',
   'Construimos una marca de excelencia con productos únicos, hechos de forma artesanal y con ingredientes naturales, frescos y seleccionados, para llevar sabor auténtico al mundo. Aplicamos procesos orientados a obtener a futuro la certificación HACCP e ISO 9001, con foco inicial en los puntos de venta del Paraguay y planes de exportación.',
   null, null, 3, true),
  ('impacto', 'Para quienes disfrutan la buena mesa', '¿A quién impactamos?',
   'Creamos productos para quienes disfrutan los sabores sofisticados y convierten cada comida en un momento especial: con amigos, en familia o en cualquier ocasión única.',
   null, null, 4, true),
  ('proceso', 'De la finca a la mesa', 'Proceso artesanal',
   'Cultivo propio, elaboración a mano y control de calidad en nuestra planta.',
   null, null, 5, true),
  ('propuesta', 'Una propuesta única', 'Posicionamiento',
   'Desarrollamos productos con ingredientes y combinaciones únicas que hoy no tienen equivalente en el mercado. Como competencia indirecta identificamos marcas premium como Heinz, Tabasco y Kühne, con estándares comparables.',
   null, null, 6, true),
  ('distribuidores', 'Sumá Salsa Top a tu local', 'Para comercios y mayoristas',
   'Trabajamos con comercios y mayoristas. Escribinos para conocer condiciones y precios de distribución.',
   'Quiero vender Salsa Top', null, 7, true),
  ('contacto', 'Hablemos de sabor', 'Contacto',
   'Escribinos por WhatsApp al 0994 208 200 o seguinos en nuestras redes.',
   'Escribir por WhatsApp', null, 8, true),
  ('footer', 'Salsa Top', null,
   'Marca artesanal gourmet de salsas picantes, agridulces y untables. Paraguay.',
   null, null, 9, true)
on conflict (clave) do nothing;

-- ---------------------------------------------------------------------------
-- Banner hero
-- ---------------------------------------------------------------------------
insert into saltatop.banners (titulo, subtitulo, texto_boton, enlace_boton, orden, activo)
select 'No es solo una salsa. Es una experiencia gourmet.', 'Artesanal · Gourmet · Paraguay',
       'Ver productos', '/productos', 1, true
where not exists (select 1 from saltatop.banners);

-- ---------------------------------------------------------------------------
-- Métodos de pago
-- ---------------------------------------------------------------------------
insert into saltatop.metodos_pago (nombre, descripcion, orden, activo)
select v.nombre, v.descripcion, v.orden, true
from (values
  ('Efectivo', 'Pago en efectivo contra entrega o retiro.', 1),
  ('Transferencia bancaria', 'Transferencia o pago por billetera electrónica.', 2)
) as v(nombre, descripcion, orden)
where not exists (select 1 from saltatop.metodos_pago m where m.nombre = v.nombre);

-- ---------------------------------------------------------------------------
-- Métodos de entrega
-- ---------------------------------------------------------------------------
insert into saltatop.metodos_entrega (nombre, descripcion, costo, orden, activo)
select v.nombre, v.descripcion, v.costo, v.orden, true
from (values
  ('Retiro en local', 'Retirá tu pedido sin costo.', 0, 1),
  ('Delivery', 'Envío a domicilio (costo según zona).', 0, 2)
) as v(nombre, descripcion, costo, orden)
where not exists (select 1 from saltatop.metodos_entrega m where m.nombre = v.nombre);
