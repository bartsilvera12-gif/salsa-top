import { notFound } from "next/navigation";
import { requirePerfil } from "@/lib/auth";
import { CONTENIDO } from "@/lib/permisos";
import { getProductoById, getCategoriasOpciones, getEtiquetasOpciones } from "@/lib/admin-datos";
import { ProductoForm } from "@/components/admin/producto-form";

export const dynamic = "force-dynamic";

export default async function EditarProductoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requirePerfil(CONTENIDO);
  const { id } = await params;
  const [data, categorias, etiquetas] = await Promise.all([
    getProductoById(id),
    getCategoriasOpciones(),
    getEtiquetasOpciones(),
  ]);
  if (!data) notFound();

  return (
    <div className="mx-auto max-w-4xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">
        Editar: {data.producto.nombre}
      </h2>
      <ProductoForm
        producto={data.producto}
        etiquetasProducto={data.etiquetas}
        categorias={categorias}
        etiquetas={etiquetas}
      />
    </div>
  );
}
