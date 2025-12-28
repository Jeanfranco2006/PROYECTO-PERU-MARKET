import type { JSX } from "react";
import { FaTriangleExclamation } from "react-icons/fa6";

interface SelectFieldProps {
  label: string;
  icon: JSX.Element;
  value: string;
  options: string[];
  onChange: (val: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: string;
}

export default function SelectField({
  label,
  icon,
  value,
  options,
  onChange,
  required = false,
  disabled = false,
  error = ""
}: SelectFieldProps) {
  return (
    <div>
      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5 flex items-center gap-1.5">
        <span className="text-slate-400">{icon}</span>
        {label}
        {required && <span className="text-red-500">*</span>}
      </label>

      <select
        className={`block w-full rounded-lg border px-3 py-2.5 text-slate-900 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:bg-slate-100 disabled:cursor-not-allowed ${
          error
            ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-200"
            : "border-slate-300 bg-white focus:border-indigo-500 focus:ring-indigo-200 hover:border-indigo-300"
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        disabled={disabled}
      >
        <option value="">-- Seleccionar --</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-xs text-red-600 font-medium flex items-center gap-1">
          <FaTriangleExclamation /> {error}
        </p>
      )}
    </div>
  );
}
