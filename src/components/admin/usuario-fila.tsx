"use client";

import { useState, useTransition } from "react";
import { ROL_LABEL, ROLES, type Rol } from "@/lib/permisos";
import { cambiarRolUsuario, alternarActivoUsuario } from "@/app/admin/(panel)/usuarios/actions";

export function UsuarioFila({
  id,
  nombre,
  email,
  rol,
  activo,
  ultimoAcceso,
}: {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  activo: boolean;
  ultimoAcceso: string | null;
}) {
  const [pending, startTransition] = useTransition();
  const [rolActual, setRolActual] = useState(rol);
  const [activoActual, setActivoActual] = useState(activo);

  return (
    <tr className="border-b border-black/5 last:border-0">
      <td className="px-4 py-3">
        <span className="font-semibold text-tinta">{nombre}</span>
        <br />
        <span className="text-xs text-tinta-tenue">{email}</span>
      </td>
      <td className="px-4 py-3">
        <select
          value={rolActual}
          disabled={pending}
          onChange={(e) => {
            const nuevo = e.target.value;
            setRolActual(nuevo);
            startTransition(() => { void cambiarRolUsuario(id, nuevo as Rol); });
          }}
          className="rounded-lg border border-black/15 bg-white px-2.5 py-1.5 text-sm"
        >
          {ROLES.map((r) => <option key={r} value={r}>{ROL_LABEL[r]}</option>)}
        </select>
      </td>
      <td className="px-4 py-3 text-xs text-tinta-tenue">
        {ultimoAcceso ? new Date(ultimoAcceso).toLocaleString("es-PY") : "—"}
      </td>
      <td className="px-4 py-3 text-right">
        <button
          type="button"
          disabled={pending}
          onClick={() => {
            const nuevo = !activoActual;
            setActivoActual(nuevo);
            startTransition(() => { void alternarActivoUsuario(id, nuevo); });
          }}
          className={activoActual
            ? "rounded-lg bg-petroleo/10 px-3 py-1.5 text-xs font-semibold text-petroleo"
            : "rounded-lg bg-black/10 px-3 py-1.5 text-xs font-semibold text-tinta-tenue"}
        >
          {activoActual ? "Activo" : "Inactivo"}
        </button>
      </td>
    </tr>
  );
}
