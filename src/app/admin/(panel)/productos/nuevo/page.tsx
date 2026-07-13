import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { getCategoriasOpciones, getEtiquetasOpciones } from "@/lib/admin-datos";
import { ProductoForm } from "@/components/admin/producto-form";

export const dynamic = "force-dynamic";

export default async function NuevoProductoPage() {
  await requirePerfil(CONTENIDO);
  const [categorias, etiquetas] = await Promise.all([
    getCategoriasOpciones(),
    getEtiquetasOpciones(),
  ]);

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Nuevo producto</h2>
      <ProductoForm producto={null} etiquetasProducto={[]} categorias={categorias} etiquetas={etiquetas} />
    </div>
  );
}
