import { requirePerfil } from "@/lib/auth";
import { ADMIN } from "@/lib/permisos";
import { CuponForm } from "@/components/admin/cupon-form";

export const dynamic = "force-dynamic";

export default async function NuevoCuponPage() {
  await requirePerfil(ADMIN);
  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-5 font-title text-2xl font-extrabold uppercase text-tinta">Nuevo cupón</h2>
      <CuponForm cupon={null} />
    </div>
  );
}
