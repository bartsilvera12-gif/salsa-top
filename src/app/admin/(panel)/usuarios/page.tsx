import { requirePerfil } from "@/lib/auth";
import { SUPER } from "@/lib/permisos";
import { getPerfilesAdmin } from "@/lib/admin-datos";
import { UsuarioCrearForm } from "@/components/admin/usuario-crear-form";
import { UsuarioFila } from "@/components/admin/usuario-fila";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  await requirePerfil(SUPER);
  const perfiles = await getPerfilesAdmin();

  return (
    <div className="space-y-6">
      <UsuarioCrearForm />

      <div className="recuadro overflow-hidden p-0">
        <div className="border-b border-black/10 px-4 py-3 text-sm text-tinta-tenue">{perfiles.length} usuario(s)</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-black/10 bg-crema-suave text-left text-xs uppercase tracking-wide text-tinta-tenue">
              <tr>
                <th className="px-4 py-3">Usuario</th>
                <th className="px-4 py-3">Rol</th>
                <th className="px-4 py-3">Último acceso</th>
                <th className="px-4 py-3 text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {perfiles.length === 0 && <tr><td colSpan={4} className="px-4 py-10 text-center text-tinta-tenue">No hay usuarios.</td></tr>}
              {perfiles.map((p) => (
                <UsuarioFila
                  key={p.id}
                  id={p.id}
                  nombre={`${p.nombre} ${p.apellido ?? ""}`.trim()}
                  email={p.email}
                  rol={p.rol}
                  activo={p.activo}
                  ultimoAcceso={p.ultimo_acceso}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
