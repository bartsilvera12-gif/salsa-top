// Repositorio tipado de Pedidos.
// Nota: el listado del módulo usa búsqueda multi-campo (numero/nombre/telefono)
// y filtros por estado / estado_pago; se afinan en la migración de Pedidos.
import { crearRepo } from "@/lib/repositorios/base";

export type Pedido = {
  id: string;
  numero: string;
  nombre_cliente: string;
  telefono_cliente: string;
  email_cliente: string | null;
  estado: string;
  estado_pago: string;
  metodo_pago: string | null;
  metodo_entrega: string | null;
  subtotal: number;
  descuento: number;
  costo_envio: number;
  total: number;
  creado_en: string;
};

export const pedidosRepo = crearRepo<Pedido>({
  tabla: "pedidos",
  campoBusqueda: "numero",
  ordenDefault: { campo: "creado_en", asc: false },
});
