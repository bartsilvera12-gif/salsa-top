-- ============================================================================
-- Salsa Top · 0003 · Funciones y triggers (schema saltatop)
-- ============================================================================
set search_path = saltatop, public;

-- Columna interna para control idempotente de stock por pedido.
alter table saltatop.pedidos
  add column if not exists stock_descontado boolean not null default false;

-- ----------------------------------------------------------------------------
-- 1/2. actualizado_en / actualizada_en
-- ----------------------------------------------------------------------------
create or replace function saltatop.set_actualizado_en()
returns trigger language plpgsql as $$
begin
  new.actualizado_en := now();
  return new;
end; $$;

create or replace function saltatop.set_actualizada_en()
returns trigger language plpgsql as $$
begin
  new.actualizada_en := now();
  return new;
end; $$;

-- Tablas con columna actualizado_en (pedidos se maneja aparte en su trigger).
do $$
declare t text;
begin
  foreach t in array array[
    'perfiles','configuracion_sitio','productos','producto_variantes','banners',
    'secciones_sitio','beneficios','testimonios','clientes','cupones',
    'metodos_pago','metodos_entrega','suscriptores'
  ] loop
    execute format('drop trigger if exists trg_actualizado_en on saltatop.%I;', t);
    execute format(
      'create trigger trg_actualizado_en before update on saltatop.%I
         for each row execute function saltatop.set_actualizado_en();', t);
  end loop;
end $$;

-- Tablas con columna actualizada_en.
do $$
declare t text;
begin
  foreach t in array array['categorias','recetas'] loop
    execute format('drop trigger if exists trg_actualizada_en on saltatop.%I;', t);
    execute format(
      'create trigger trg_actualizada_en before update on saltatop.%I
         for each row execute function saltatop.set_actualizada_en();', t);
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- 11. Helpers de roles (SECURITY DEFINER para evitar recursión con RLS)
-- ----------------------------------------------------------------------------
create or replace function saltatop.obtener_perfil_actual()
returns saltatop.perfiles
language sql stable security definer set search_path = saltatop, public as $$
  select * from saltatop.perfiles
  where auth_user_id = auth.uid() and activo = true
  limit 1;
$$;

create or replace function saltatop.usuario_es_admin()
returns boolean
language sql stable security definer set search_path = saltatop, public as $$
  select exists (
    select 1 from saltatop.perfiles
    where auth_user_id = auth.uid() and activo = true
      and rol in ('super_admin','administrador','editor','operador_pedidos')
  );
$$;

create or replace function saltatop.usuario_tiene_rol(roles text[])
returns boolean
language sql stable security definer set search_path = saltatop, public as $$
  select exists (
    select 1 from saltatop.perfiles
    where auth_user_id = auth.uid() and activo = true
      and rol = any(roles)
  );
$$;

-- ----------------------------------------------------------------------------
-- 12. Registro de auditoría (helper)
-- ----------------------------------------------------------------------------
create or replace function saltatop.registrar_auditoria(
  p_accion text, p_entidad text, p_entidad_id uuid default null,
  p_datos_anteriores jsonb default null, p_datos_nuevos jsonb default null
) returns void
language plpgsql security definer set search_path = saltatop, public as $$
declare v_perfil uuid;
begin
  select id into v_perfil from saltatop.perfiles where auth_user_id = auth.uid() limit 1;
  insert into saltatop.auditoria(usuario_id, accion, entidad, entidad_id, datos_anteriores, datos_nuevos)
  values (v_perfil, p_accion, p_entidad, p_entidad_id, p_datos_anteriores, p_datos_nuevos);
end; $$;

-- ----------------------------------------------------------------------------
-- 4. Historial de cambios de estado del pedido (AFTER UPDATE)
-- ----------------------------------------------------------------------------
create or replace function saltatop.registrar_cambio_estado_pedido()
returns trigger language plpgsql security definer set search_path = saltatop, public as $$
declare v_perfil uuid;
begin
  if new.estado is distinct from old.estado then
    select id into v_perfil from saltatop.perfiles where auth_user_id = auth.uid() limit 1;
    insert into saltatop.pedido_historial(pedido_id, estado_anterior, estado_nuevo, usuario_id)
    values (new.id, old.estado, new.estado, v_perfil);
  end if;
  return new;
end; $$;

drop trigger if exists trg_pedido_historial on saltatop.pedidos;
create trigger trg_pedido_historial
  after update on saltatop.pedidos
  for each row execute function saltatop.registrar_cambio_estado_pedido();

-- ----------------------------------------------------------------------------
-- 8/9/10. Gestión de estado: timestamps + stock (BEFORE UPDATE, idempotente)
-- ----------------------------------------------------------------------------
create or replace function saltatop.gestionar_estado_pedido()
returns trigger language plpgsql security definer set search_path = saltatop, public as $$
declare it record;
begin
  new.actualizado_en := now();

  if new.estado is distinct from old.estado then
    if new.estado = 'confirmado' and new.confirmado_en is null then new.confirmado_en := now(); end if;
    if new.estado = 'preparando' and new.preparando_en is null then new.preparando_en := now(); end if;
    if new.estado = 'enviado'    and new.enviado_en    is null then new.enviado_en    := now(); end if;
    if new.estado = 'entregado'  and new.entregado_en  is null then new.entregado_en  := now(); end if;
    if new.estado = 'cancelado'  and new.cancelado_en  is null then new.cancelado_en  := now(); end if;

    -- Descontar stock una sola vez al reservar (confirmado en adelante).
    if not coalesce(old.stock_descontado, false)
       and new.estado in ('confirmado','preparando','listo','enviado','entregado') then
      for it in select producto_id, variante_id, cantidad
                from saltatop.pedido_items where pedido_id = new.id loop
        if it.variante_id is not null then
          update saltatop.producto_variantes set stock = stock - it.cantidad where id = it.variante_id;
        elsif it.producto_id is not null then
          update saltatop.productos set stock = stock - it.cantidad
            where id = it.producto_id and controla_stock = true;
        end if;
      end loop;
      new.stock_descontado := true;
    end if;

    -- Devolver stock al cancelar solo si estaba descontado (evita duplicación).
    if new.estado = 'cancelado' and coalesce(old.stock_descontado, false) then
      for it in select producto_id, variante_id, cantidad
                from saltatop.pedido_items where pedido_id = new.id loop
        if it.variante_id is not null then
          update saltatop.producto_variantes set stock = stock + it.cantidad where id = it.variante_id;
        elsif it.producto_id is not null then
          update saltatop.productos set stock = stock + it.cantidad
            where id = it.producto_id and controla_stock = true;
        end if;
      end loop;
      new.stock_descontado := false;
    end if;
  end if;

  return new;
end; $$;

drop trigger if exists trg_gestionar_estado_pedido on saltatop.pedidos;
create trigger trg_gestionar_estado_pedido
  before update on saltatop.pedidos
  for each row execute function saltatop.gestionar_estado_pedido();

-- ----------------------------------------------------------------------------
-- 6. Validación de cupones
-- ----------------------------------------------------------------------------
create or replace function saltatop.validar_cupon(
  p_codigo text, p_subtotal numeric, p_cliente_id uuid default null
) returns jsonb
language plpgsql stable security definer set search_path = saltatop, public as $$
declare c saltatop.cupones; v_desc numeric := 0; v_usos_cli int;
begin
  select * into c from saltatop.cupones where lower(codigo) = lower(p_codigo) and activo = true;
  if not found then return jsonb_build_object('valido', false, 'mensaje', 'Cupón inexistente o inactivo'); end if;
  if c.fecha_inicio is not null and now() < c.fecha_inicio then
    return jsonb_build_object('valido', false, 'mensaje', 'El cupón aún no está vigente'); end if;
  if c.fecha_fin is not null and now() > c.fecha_fin then
    return jsonb_build_object('valido', false, 'mensaje', 'El cupón está vencido'); end if;
  if p_subtotal < coalesce(c.compra_minima, 0) then
    return jsonb_build_object('valido', false, 'mensaje', 'No alcanza la compra mínima del cupón'); end if;
  if c.limite_usos is not null and coalesce(c.usos_actuales, 0) >= c.limite_usos then
    return jsonb_build_object('valido', false, 'mensaje', 'El cupón no tiene usos disponibles'); end if;
  if c.limite_por_cliente is not null and p_cliente_id is not null then
    select count(*) into v_usos_cli from saltatop.cupon_usos where cupon_id = c.id and cliente_id = p_cliente_id;
    if v_usos_cli >= c.limite_por_cliente then
      return jsonb_build_object('valido', false, 'mensaje', 'Alcanzaste el límite de uso de este cupón'); end if;
  end if;

  if c.tipo_descuento = 'porcentaje' then v_desc := round(p_subtotal * c.valor / 100);
  elsif c.tipo_descuento = 'monto_fijo' then v_desc := least(c.valor, p_subtotal);
  else v_desc := 0; -- envio_gratis se resuelve en el cálculo de envío
  end if;

  return jsonb_build_object('valido', true, 'cupon_id', c.id, 'tipo', c.tipo_descuento,
                            'descuento', v_desc, 'mensaje', 'Cupón aplicado');
end; $$;

-- ----------------------------------------------------------------------------
-- 3/5/7. Crear pedido (cálculo seguro en base de datos). Escritura pública
-- controlada: NO confía en totales del cliente; recalcula todo con precios
-- reales, valida stock y cupón, crea cliente/pedido/items y registra el cupón.
-- ----------------------------------------------------------------------------
create or replace function saltatop.crear_pedido(
  p_cliente jsonb,
  p_items jsonb,
  p_metodo_entrega text default null,
  p_metodo_pago text default null,
  p_cupon_codigo text default null,
  p_observaciones text default null
) returns jsonb
language plpgsql security definer set search_path = saltatop, public as $$
declare
  v_subtotal numeric := 0;
  v_descuento numeric := 0;
  v_envio numeric := 0;
  v_total numeric := 0;
  v_cliente_id uuid;
  v_pedido_id uuid;
  v_numero text;
  v_item jsonb;
  v_items_calc jsonb := '[]'::jsonb;
  v_prod saltatop.productos;
  v_var saltatop.producto_variantes;
  v_variante_id uuid;
  v_precio numeric;
  v_cant numeric;
  v_nombre text;
  v_desc_var text;
  v_config saltatop.configuracion_sitio;
  v_entrega saltatop.metodos_entrega;
  v_cupon jsonb;
  v_cupon_id uuid;
begin
  if p_items is null or jsonb_array_length(p_items) = 0 then
    raise exception 'El pedido no contiene productos';
  end if;

  select * into v_config from saltatop.configuracion_sitio where activo = true limit 1;
  if v_config.id is not null and coalesce(v_config.pedidos_habilitados, true) = false then
    raise exception 'Los pedidos están deshabilitados temporalmente';
  end if;

  -- Cliente: reutilizar por teléfono o crear.
  if coalesce(p_cliente->>'telefono', '') <> '' then
    select id into v_cliente_id from saltatop.clientes where telefono = p_cliente->>'telefono' limit 1;
  end if;
  if v_cliente_id is null then
    insert into saltatop.clientes(nombre, apellido, telefono, email, documento, ciudad, barrio, direccion, referencia)
    values (coalesce(nullif(p_cliente->>'nombre',''), 'Cliente'), p_cliente->>'apellido',
            coalesce(p_cliente->>'telefono',''), p_cliente->>'email', p_cliente->>'documento',
            p_cliente->>'ciudad', p_cliente->>'barrio', p_cliente->>'direccion', p_cliente->>'referencia')
    returning id into v_cliente_id;
  end if;

  -- Recalcular cada item con precios reales y validar stock.
  for v_item in select * from jsonb_array_elements(p_items) loop
    v_var := null; v_variante_id := null;
    v_cant := coalesce((v_item->>'cantidad')::numeric, 0);
    if v_cant <= 0 then raise exception 'Cantidad inválida en un producto'; end if;

    if coalesce(v_item->>'variante_id','') <> '' then
      select * into v_var from saltatop.producto_variantes
        where id = (v_item->>'variante_id')::uuid and activa = true;
      if not found then raise exception 'Variante no disponible'; end if;
      select * into v_prod from saltatop.productos where id = v_var.producto_id and activo = true;
      if not found then raise exception 'Producto no disponible'; end if;
      v_variante_id := v_var.id;
      v_precio := coalesce(v_var.precio_oferta, v_var.precio);
      v_nombre := v_prod.nombre;
      v_desc_var := v_var.nombre;
      if v_prod.controla_stock and v_var.stock < v_cant then
        raise exception 'Sin stock suficiente para %', v_prod.nombre; end if;
    else
      select * into v_prod from saltatop.productos where id = (v_item->>'producto_id')::uuid and activo = true;
      if not found then raise exception 'Producto no disponible'; end if;
      v_precio := case when v_prod.en_oferta and v_prod.precio_oferta is not null
                       then v_prod.precio_oferta else v_prod.precio end;
      v_nombre := v_prod.nombre;
      v_desc_var := null;
      if v_prod.controla_stock and v_prod.stock < v_cant then
        raise exception 'Sin stock suficiente para %', v_prod.nombre; end if;
    end if;

    v_subtotal := v_subtotal + v_precio * v_cant;
    v_items_calc := v_items_calc || jsonb_build_object(
      'producto_id', v_prod.id, 'variante_id', v_variante_id, 'nombre', v_nombre,
      'desc_var', v_desc_var, 'cantidad', v_cant, 'precio', v_precio, 'subtotal', v_precio * v_cant);
  end loop;

  -- Envío.
  if p_metodo_entrega is not null then
    select * into v_entrega from saltatop.metodos_entrega where nombre = p_metodo_entrega and activo = true limit 1;
    if found then v_envio := coalesce(v_entrega.costo, 0); end if;
  end if;
  if v_config.envio_gratis_desde is not null and v_subtotal >= v_config.envio_gratis_desde then
    v_envio := 0;
  end if;

  -- Cupón.
  if coalesce(p_cupon_codigo,'') <> '' then
    v_cupon := saltatop.validar_cupon(p_cupon_codigo, v_subtotal, v_cliente_id);
    if (v_cupon->>'valido')::boolean then
      v_cupon_id := (v_cupon->>'cupon_id')::uuid;
      v_descuento := coalesce((v_cupon->>'descuento')::numeric, 0);
      if v_cupon->>'tipo' = 'envio_gratis' then v_envio := 0; end if;
    end if;
  end if;

  -- Compra mínima.
  if v_config.compra_minima is not null and v_subtotal < v_config.compra_minima then
    raise exception 'La compra mínima es Gs. %', to_char(v_config.compra_minima, 'FM999G999G999');
  end if;

  v_total := greatest(v_subtotal - v_descuento, 0) + v_envio;

  -- Número de pedido serializado.
  perform pg_advisory_xact_lock(hashtext('saltatop_numero_pedido'));
  v_numero := 'ST-' || to_char(now(), 'YYYYMMDD') || '-' ||
    lpad(((select count(*) from saltatop.pedidos where creado_en::date = current_date) + 1)::text, 4, '0');

  insert into saltatop.pedidos(numero, cliente_id, nombre_cliente, telefono_cliente, email_cliente,
     ciudad, barrio, direccion_entrega, referencia_entrega, metodo_pago, metodo_entrega,
     subtotal, descuento, costo_envio, total, cupon_id, observaciones_cliente, origen)
  values (v_numero, v_cliente_id,
     nullif(trim(coalesce(p_cliente->>'nombre','') || ' ' || coalesce(p_cliente->>'apellido','')), ''),
     coalesce(p_cliente->>'telefono',''), p_cliente->>'email',
     p_cliente->>'ciudad', p_cliente->>'barrio', p_cliente->>'direccion', p_cliente->>'referencia',
     p_metodo_pago, p_metodo_entrega,
     v_subtotal, v_descuento, v_envio, v_total, v_cupon_id, p_observaciones, 'web')
  returning id into v_pedido_id;

  insert into saltatop.pedido_items(pedido_id, producto_id, variante_id, nombre_producto,
     descripcion_variante, cantidad, precio_unitario, subtotal)
  select v_pedido_id, (e->>'producto_id')::uuid, nullif(e->>'variante_id','')::uuid,
     e->>'nombre', e->>'desc_var', (e->>'cantidad')::numeric, (e->>'precio')::numeric, (e->>'subtotal')::numeric
  from jsonb_array_elements(v_items_calc) e;

  if v_cupon_id is not null then
    insert into saltatop.cupon_usos(cupon_id, pedido_id, cliente_id) values (v_cupon_id, v_pedido_id, v_cliente_id);
    update saltatop.cupones set usos_actuales = coalesce(usos_actuales, 0) + 1 where id = v_cupon_id;
  end if;

  insert into saltatop.pedido_historial(pedido_id, estado_anterior, estado_nuevo, comentario)
  values (v_pedido_id, null, 'pendiente', 'Pedido creado desde la web');

  return jsonb_build_object('id', v_pedido_id, 'numero', v_numero, 'subtotal', v_subtotal,
     'descuento', v_descuento, 'costo_envio', v_envio, 'total', v_total);
end; $$;

-- Permisos de ejecución de las RPC públicas controladas.
grant execute on function saltatop.crear_pedido(jsonb, jsonb, text, text, text, text) to anon, authenticated;
grant execute on function saltatop.validar_cupon(text, numeric, uuid) to anon, authenticated;
grant execute on function saltatop.obtener_perfil_actual() to authenticated;
grant execute on function saltatop.usuario_es_admin() to authenticated, anon;
grant execute on function saltatop.usuario_tiene_rol(text[]) to authenticated, anon;
grant execute on function saltatop.registrar_auditoria(text, text, uuid, jsonb, jsonb) to authenticated;
