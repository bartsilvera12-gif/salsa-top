-- 0006 · Lectura pública de un pedido por número (confirmación estática).
--
-- La página /pedido?numero=... debe funcionar desde el navegador (output: export)
-- SIN service_role. RLS restringe `pedidos` / `pedido_items` a roles admin, así que
-- exponemos una RPC SECURITY DEFINER que devuelve SOLO campos seguros del pedido y
-- sus ítems. El `numero` actúa como token no adivinable (capability), mismo criterio
-- que el link de confirmación. No expone datos internos (observaciones_internas,
-- cliente_id, email/teléfono, historial, etc.).

create or replace function saltatop.obtener_pedido_publico(p_numero text)
returns jsonb
language plpgsql security definer set search_path = saltatop, public as $$
declare
  v_id uuid;
  v_pedido jsonb;
  v_items jsonb;
begin
  select id,
         jsonb_build_object(
           'numero', numero,
           'nombre_cliente', nombre_cliente,
           'estado', estado,
           'metodo_entrega', metodo_entrega,
           'metodo_pago', metodo_pago,
           'subtotal', subtotal,
           'costo_envio', costo_envio,
           'descuento', descuento,
           'total', total
         )
    into v_id, v_pedido
  from saltatop.pedidos
  where numero = p_numero;

  if v_id is null then
    return null;
  end if;

  select coalesce(
           jsonb_agg(
             jsonb_build_object(
               'nombre_producto', nombre_producto,
               'descripcion_variante', descripcion_variante,
               'cantidad', cantidad,
               'subtotal', subtotal
             )
           ),
           '[]'::jsonb
         )
    into v_items
  from saltatop.pedido_items
  where pedido_id = v_id;

  return jsonb_build_object('pedido', v_pedido, 'items', v_items);
end;
$$;

-- La confirmación es pública (cliente anónimo tras el checkout).
grant execute on function saltatop.obtener_pedido_publico(text) to anon, authenticated;
