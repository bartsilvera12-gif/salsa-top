/** Roles y permisos del panel administrativo. */

export type Rol = "super_admin" | "administrador" | "editor" | "operador_pedidos";

export const ROLES: Rol[] = [
  "super_admin",
  "administrador",
  "editor",
  "operador_pedidos",
];

export const ROL_LABEL: Record<Rol, string> = {
  super_admin: "Super admin",
  administrador: "Administrador",
  editor: "Editor",
  operador_pedidos: "Operador de pedidos",
};

// Grupos de roles reutilizables
export const TODOS: Rol[] = ROLES;
export const CONTENIDO: Rol[] = ["super_admin", "administrador", "editor"];
export const OPERACIONES: Rol[] = ["super_admin", "administrador", "operador_pedidos"];
export const ADMIN: Rol[] = ["super_admin", "administrador"];
export const SUPER: Rol[] = ["super_admin"];

export type ItemMenu = {
  key: string;
  label: string;
  href: string;
  icono: string; // nombre de icono lucide-react
  roles: Rol[];
};

/** Menú lateral del panel. `roles` define quién ve/accede cada módulo. */
export const MENU: ItemMenu[] = [
  { key: "dashboard", label: "Dashboard", href: "/admin", icono: "LayoutDashboard", roles: TODOS },
  { key: "productos", label: "Productos", href: "/admin/productos", icono: "Package", roles: CONTENIDO },
  { key: "categorias", label: "Categorías", href: "/admin/categorias", icono: "Tags", roles: CONTENIDO },
  // Secciones ocultas del menú a pedido del cliente (reversible: volver a
  // agregar la línea correspondiente). Las páginas y datos siguen intactos.
  //   pedidos, clientes, banners, beneficios, testimonios, recetas, cupones,
  //   multimedia, configuracion, usuarios, auditoria
];

export function puedeAcceder(rol: Rol, roles: Rol[]): boolean {
  return roles.includes(rol);
}

export function menuPara(rol: Rol): ItemMenu[] {
  return MENU.filter((m) => m.roles.includes(rol));
}
