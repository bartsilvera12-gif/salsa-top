import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const baseInput =
  "w-full rounded-xl border border-black/15 bg-white px-3.5 py-2.5 text-sm text-tinta outline-none transition focus:border-fuego-naranja focus:ring-2 focus:ring-fuego-naranja/25 disabled:opacity-60";

export function Field({
  label,
  error,
  hint,
  htmlFor,
  children,
  className,
}: {
  label?: string;
  error?: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-tinta">
          {label}
        </label>
      )}
      {children}
      {hint && !error && <p className="mt-1 text-xs text-tinta-tenue">{hint}</p>}
      {error && <p className="mt-1 text-xs font-medium text-fuego-rojo">{error}</p>}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return <input ref={ref} className={cn(baseInput, className)} {...props} />;
  },
);

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return <textarea ref={ref} className={cn(baseInput, "min-h-24 resize-y", className)} {...props} />;
  },
);

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <select ref={ref} className={cn(baseInput, "appearance-none", className)} {...props}>
        {children}
      </select>
    );
  },
);

export function Toggle({
  label,
  descripcion,
  checked,
  onChange,
}: {
  label: string;
  descripcion?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-black/10 bg-white px-4 py-3 text-left"
    >
      <span>
        <span className="block text-sm font-semibold text-tinta">{label}</span>
        {descripcion && <span className="block text-xs text-tinta-tenue">{descripcion}</span>}
      </span>
      <span className={cn("relative h-6 w-11 flex-shrink-0 rounded-full transition", checked ? "bg-fuego-naranja" : "bg-black/20")}>
        <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all", checked ? "left-[22px]" : "left-0.5")} />
      </span>
    </button>
  );
}
