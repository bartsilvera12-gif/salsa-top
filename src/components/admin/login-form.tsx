"use client";

import { forwardRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createClient } from "@/lib/supabase/client";

const loginSchema = z.object({
  email: z.string().email("Ingresá un email válido"),
  password: z.string().min(1, "Ingresá tu contraseña"),
});
type LoginData = z.infer<typeof loginSchema>;

const resetSchema = z.object({
  email: z.string().email("Ingresá un email válido"),
});
type ResetData = z.infer<typeof resetSchema>;

export function LoginForm({ redirectTo }: { redirectTo: string }) {
  const [modo, setModo] = useState<"login" | "reset">("login");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const login = useForm<LoginData>({ resolver: zodResolver(loginSchema) });
  const reset = useForm<ResetData>({ resolver: zodResolver(resetSchema) });

  async function onLogin(data: LoginData) {
    setErrorMsg(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      setErrorMsg("Email o contraseña incorrectos.");
      return;
    }
    // Navegación completa para que el servidor revalide sesión + perfil + rol.
    window.location.assign(redirectTo || "/admin");
  }

  async function onReset(data: ResetData) {
    setErrorMsg(null);
    setOkMsg(null);
    const supabase = createClient();
    const redirect = `${window.location.origin}/admin/login`;
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: redirect,
    });
    if (error) {
      setErrorMsg("No se pudo enviar el correo de recuperación.");
      return;
    }
    setOkMsg("Si el email existe, te enviamos un enlace para restablecer la contraseña.");
    setModo("login");
  }

  return (
    <div className="w-full">
      {errorMsg && (
        <p className="mb-4 rounded-xl border border-fuego-rojo/30 bg-fuego-rojo/10 px-4 py-3 text-sm font-medium text-fuego-rojo">
          {errorMsg}
        </p>
      )}
      {okMsg && (
        <p className="mb-4 rounded-xl border border-petroleo/30 bg-petroleo/10 px-4 py-3 text-sm font-medium text-petroleo">
          {okMsg}
        </p>
      )}

      {modo === "login" ? (
        <form onSubmit={login.handleSubmit(onLogin)} className="space-y-4" noValidate>
          <Campo
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="admin@salsatop.com"
            error={login.formState.errors.email?.message}
            {...login.register("email")}
          />
          <Campo
            label="Contraseña"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            error={login.formState.errors.password?.message}
            {...login.register("password")}
          />
          <button
            type="submit"
            disabled={login.formState.isSubmitting}
            className="btn-fuego w-full disabled:opacity-60"
          >
            {login.formState.isSubmitting ? "Ingresando…" : "Ingresar"}
          </button>
          <button
            type="button"
            onClick={() => { setModo("reset"); setErrorMsg(null); }}
            className="block w-full text-center text-sm font-medium text-acento hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </form>
      ) : (
        <form onSubmit={reset.handleSubmit(onReset)} className="space-y-4" noValidate>
          <Campo
            label="Email"
            type="email"
            autoComplete="email"
            placeholder="admin@salsatop.com"
            error={reset.formState.errors.email?.message}
            {...reset.register("email")}
          />
          <button
            type="submit"
            disabled={reset.formState.isSubmitting}
            className="btn-fuego w-full disabled:opacity-60"
          >
            {reset.formState.isSubmitting ? "Enviando…" : "Enviar enlace de recuperación"}
          </button>
          <button
            type="button"
            onClick={() => { setModo("login"); setErrorMsg(null); }}
            className="block w-full text-center text-sm font-medium text-acento hover:underline"
          >
            Volver al inicio de sesión
          </button>
        </form>
      )}
    </div>
  );
}

type CampoProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

const Campo = forwardRef<HTMLInputElement, CampoProps>(function Campo(
  { label, error, id, ...props },
  ref,
) {
  const inputId = id ?? label.toLowerCase();
  return (
    <div>
      <label htmlFor={inputId} className="mb-1.5 block text-sm font-semibold text-tinta">
        {label}
      </label>
      <input
        id={inputId}
        ref={ref}
        className="w-full rounded-xl border border-black/15 bg-white px-4 py-3 text-tinta outline-none transition focus:border-fuego-naranja focus:ring-2 focus:ring-fuego-naranja/30"
        aria-invalid={!!error}
        {...props}
      />
      {error && <p className="mt-1 text-xs font-medium text-fuego-rojo">{error}</p>}
    </div>
  );
});
