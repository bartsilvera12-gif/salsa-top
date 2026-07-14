"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";

const MENSAJES: Record<string, string> = {
  denegado: "Necesitás iniciar sesión con una cuenta autorizada.",
  sin_permiso: "Tu cuenta no tiene permiso para acceder a esa sección.",
  inactivo: "Tu cuenta está desactivada. Contactá a un administrador.",
};

function LoginPanelInterior() {
  const sp = useSearchParams();
  const error = sp.get("error");
  const aviso = error ? MENSAJES[error] : null;
  const redirect = sp.get("redirect");
  const redirectTo = redirect && redirect.startsWith("/admin") ? redirect : "/admin";

  return (
    <>
      {aviso && (
        <p className="mb-4 rounded-xl border border-fuego-naranja/40 bg-fuego-amarillo/20 px-4 py-3 text-sm font-medium text-acento">
          {aviso}
        </p>
      )}
      <LoginForm redirectTo={redirectTo} />
    </>
  );
}

export function LoginPanel() {
  return (
    <Suspense fallback={<LoginForm redirectTo="/admin" />}>
      <LoginPanelInterior />
    </Suspense>
  );
}
