import { notFound } from "next/navigation";
import { requirePerfil } from "@/lib/auth";
import { ADMIN } from "@/lib/permisos";
import { getCuponById } from "@/lib/admin-datos";
import { CuponForm } from "@/components/admin/cupon-form";

export const dynamic = "force-dynamic";

export default async function EditarCuponPage({ params }: { params: Promise<{ id: string }> }) {
  await requirePerfil(ADMIN);
  const { id } = await params;
  const cupon = await getCuponById(id);
  if (!cupon) notFound();

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Editar cupón: {cupon.codigo}</h2>
      <CuponForm cupon={cupon} />
    </div>
  );
}
