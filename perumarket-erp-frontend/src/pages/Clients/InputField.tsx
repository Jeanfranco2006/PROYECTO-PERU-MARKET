import type { JSX } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { FaTriangleExclamation } from "react-icons/fa6";

export interface InputFieldProps {
  label: string;
  icon: JSX.Element;
  value: string;
  type?: string;
  onChange: (val: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onBlur?: () => void;
  success?: boolean;
}

export default function InputField({
  label,
  icon,
  value,
  type = "text",
  onChange,
  required = false,
  disabled = false,
  error = "",
  onBlur,
  success = false
}: InputFieldProps) {
  return (
    <div className="relative">
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
        <span className="text-slate-400">{icon}</span>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <div className="relative">
        <input
          type={type}
          className={`block w-full rounded-lg border px-3 py-2.5 text-slate-900 placeholder-slate-400 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed ${
            error
              ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
              : success
              ? "border-emerald-300 bg-emerald-50 focus:border-emerald-500 focus:ring-emerald-200"
              : "border-slate-300 bg-white focus:border-indigo-500 focus:ring-indigo-200 hover:border-indigo-300"
          }`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          disabled={disabled}
          onBlur={onBlur}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {error && <FaTriangleExclamation className="h-4 w-4 text-red-500" />}
          {success && <FaCheckCircle className="h-4 w-4 text-emerald-500" />}
        </div>
      </div>

      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
}
