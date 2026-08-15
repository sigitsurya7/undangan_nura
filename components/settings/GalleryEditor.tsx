"use client";

import type { GalleryPhoto } from "@/config/wedding";
import PhotoPicker from "./PhotoPicker";
import { AddButton, RemoveButton, TextInput } from "./fields";

interface GalleryEditorProps {
  items: GalleryPhoto[];
  onChange: (items: GalleryPhoto[]) => void;
}

export default function GalleryEditor({ items, onChange }: GalleryEditorProps) {
  const update = (i: number, patch: Partial<GalleryPhoto>) => {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div>
      <p className="text-sm text-ink/70">
        Kosongkan galeri untuk menampilkan placeholder dummy. Setelah ada satu
        foto saja, dummy otomatis hilang.
      </p>

      <div className="mt-4 flex flex-col gap-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-end gap-3 border-[3px] border-ink bg-paper p-4">
            <PhotoPicker
              label={`Foto ${i + 1}`}
              value={item.src}
              onChange={(src) => update(i, { src })}
            />
            <div className="flex-1">
              <TextInput
                type="text"
                placeholder="Keterangan foto (opsional)"
                maxLength={100}
                value={item.alt}
                onChange={(e) => update(i, { alt: e.target.value })}
              />
            </div>
            <RemoveButton label={`Hapus foto ${i + 1}`} onClick={() => remove(i)} />
          </div>
        ))}
      </div>

      {items.length < 12 && (
        <div className="mt-4">
          <AddButton
            label="Tambah Foto"
            onClick={() => onChange([...items, { src: null, alt: `Foto ${items.length + 1}` }])}
          />
        </div>
      )}
    </div>
  );
}
