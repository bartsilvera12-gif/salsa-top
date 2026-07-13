"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { UserPlus } from "lucide-react";
import { Field, Input, Select } from "@/components/admin/ui";
import { ROL_LABEL, ROLES } from "@/lib/permisos";
import { crearUsuario } from "@/app/admin/(panel)/usuarios/actions";

type FormValues = {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rol: string;
};

export function UsuarioCrearForm() {
  const [msg, setMsg] = useState<{ tipo: "ok" | "error"; texto: string } | null>(null);
  const { register, handleSubmit, reset, formState } = useForm<FormValues>({
    defaultValues: { nombre: "", apellido: "", email: "", password: "", rol: "editor" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setMsg(null);
    const res = await crearUsuario(values);
    if ("error" in res) setMsg({ tipo: "error", texto: res.error });
    else {
      setMsg({ tipo: "ok", texto: "Usuario creado correctamente." });
      reset();
    }
  });

  return (
    <div className="recuadro p-6">
      <h3 className="mb-4 flex items-center gap-2 font-title text-lg font-extrabold uppercase text-tinta">
        <UserPlus size={20} /> Crear usuario
      </h3>
      {msg && (
        <p className={msg.tipo === "ok"
          ? "mb-4 rounded-xl border border-petroleo/30 bg-petroleo/10 px-4 py-3 text-sm font-medium text-petroleo"
          : "mb-4 rounded-xl border border-fuego-rojo/30 bg-fuego-rojo/10 px-4 py-3 text-sm font-medium text-fuego-rojo"}>
          {msg.texto}
        </p>
      )}
      <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="u_nombre" error={formState.errors.nombre?.message}>
          <Input id="u_nombre" {...register("nombre", { required: "Obligatorio" })} />
        </Field>
        <Field label="Apellido" htmlFor="u_apellido"><Input id="u_apellido" {...register("apellido")} /></Field>
        <Field label="Email" htmlFor="u_email" error={formState.errors.email?.message}>
          <Input id="u_email" type="email" {...register("email", { required: "Obligatorio" })} />
        </Field>
        <Field label="Contraseña" htmlFor="u_password" hint="Mínimo 8 caracteres" error={formState.errors.password?.message}>
          <Input id="u_password" type="password" {...register("password", { required: "Obligatorio", minLength: { value: 8, message: "Mínimo 8" } })} />
        </Field>
        <Field label="Rol" htmlFor="u_rol">
          <Select id="u_rol" {...register("rol")}>
            {ROLES.map((r) => <option key={r} value={r}>{ROL_LABEL[r]}</option>)}
          </Select>
        </Field>
        <div className="flex items-end">
          <button type="submit" disabled={formState.isSubmitting} className="btn-fuego disabled:opacity-60">
            {formState.isSubmitting ? "Creando…" : "Crear usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}
