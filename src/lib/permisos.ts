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
  { key: "pedidos", label: "Pedidos", href: "/admin/pedidos", icono: "ShoppingCart", roles: OPERACIONES },
  { key: "clientes", label: "Clientes", href: "/admin/clientes", icono: "Users", roles: OPERACIONES },
  { key: "banners", label: "Banners", href: "/admin/banners", icono: "Image", roles: CONTENIDO },
  { key: "contenido", label: "Contenido", href: "/admin/contenido", icono: "FileText", roles: CONTENIDO },
  { key: "beneficios", label: "Beneficios", href: "/admin/beneficios", icono: "Sparkles", roles: CONTENIDO },
  { key: "testimonios", label: "Testimonios", href: "/admin/testimonios", icono: "MessageSquareQuote", roles: CONTENIDO },
  { key: "recetas", label: "Recetas", href: "/admin/recetas", icono: "ChefHat", roles: CONTENIDO },
  { key: "cupones", label: "Cupones", href: "/admin/cupones", icono: "Ticket", roles: ADMIN },
  { key: "multimedia", label: "Multimedia", href: "/admin/multimedia", icono: "Images", roles: CONTENIDO },
  { key: "configuracion", label: "Configuración", href: "/admin/configuracion", icono: "Settings", roles: ADMIN },
  { key: "usuarios", label: "Usuarios", href: "/admin/usuarios", icono: "ShieldCheck", roles: SUPER },
  { key: "auditoria", label: "Auditoría", href: "/admin/auditoria", icono: "ScrollText", roles: ADMIN },
];

export function puedeAcceder(rol: Rol, roles: Rol[]): boolean {
  return roles.includes(rol);
}

export function menuPara(rol: Rol): ItemMenu[] {
  return MENU.filter((m) => m.roles.includes(rol));
}
