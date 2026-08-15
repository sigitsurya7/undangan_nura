"use client";

import { X } from "lucide-react";
import { AddButton } from "./fields";

interface DressCodeColorsEditorProps {
  colors: string[];
  onChange: (colors: string[]) => void;
}

export default function DressCodeColorsEditor({
  colors,
  onChange,
}: DressCodeColorsEditorProps) {
  const update = (i: number, value: string) => {
    onChange(colors.map((c, idx) => (idx === i ? value : c)));
  };

  const remove = (i: number) => onChange(colors.filter((_, idx) => idx !== i));

  return (
    <div>
      <span className="font-heading text-sm font-bold uppercase tracking-widest">
        Palet Warna
      </span>
      <div className="mt-2 flex flex-wrap gap-3">
        {colors.map((color, i) => (
          <div key={i} className="relative">
            <input
              type="color"
              value={/^#[0-9a-fA-F]{6}$/.test(color) ? color : "#ffc700"}
              onChange={(e) => update(i, e.target.value)}
              className="h-12 w-12 cursor-pointer border-[3px] border-ink p-0 shadow-brutal-sm"
            />
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label="Hapus warna"
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center border-2 border-ink bg-coral text-cream"
            >
              <X aria-hidden="true" className="h-3 w-3" />
            </button>
          </div>
        ))}

        {colors.length < 8 && (
          <AddButton label="Tambah" onClick={() => onChange([...colors, "#ffc700"])} />
        )}
      </div>
    </div>
  );
}
