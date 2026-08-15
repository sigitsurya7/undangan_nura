"use client";

import type { ReactNode } from "react";
import { Plus, Trash2 } from "lucide-react";

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="font-heading text-sm font-bold uppercase tracking-widest">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <input {...props} className={`input-brutal ${props.className ?? ""}`} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea {...props} className={`input-brutal resize-none ${props.className ?? ""}`} />
  );
}

export function ToggleField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 border-[3px] border-ink bg-paper px-4 py-3">
      <span className="font-heading text-sm font-bold uppercase tracking-widest">
        {label}
      </span>
      <span className="relative inline-flex h-7 w-12 shrink-0 items-center border-[3px] border-ink bg-cream">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={`absolute left-0.5 h-4 w-4 bg-ink transition-transform ${
            checked ? "translate-x-5 bg-teal" : ""
          }`}
        />
      </span>
    </label>
  );
}

export function SettingsSection({
  title,
  sticker,
  toggle,
  children,
}: {
  title: string;
  sticker: string;
  toggle?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="card-brutal mt-8 px-6 py-8 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="sticker bg-lemon -rotate-2 text-[10px]">{sticker}</span>
          <h2 className="mt-2 font-display text-2xl uppercase">{title}</h2>
        </div>
        {toggle}
      </div>
      <div className="mt-6 flex flex-col gap-5">{children}</div>
    </section>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn-brutal self-start bg-paper px-4 py-2 text-xs uppercase"
    >
      <Plus aria-hidden="true" className="h-4 w-4" />
      {label}
    </button>
  );
}

export function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="btn-brutal shrink-0 bg-coral p-2 text-cream"
    >
      <Trash2 aria-hidden="true" className="h-4 w-4" />
    </button>
  );
}
