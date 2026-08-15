"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import type { StoryChapter } from "@/config/wedding";
import { AddButton, RemoveButton, TextArea, TextInput } from "./fields";

interface StoryEditorProps {
  items: StoryChapter[];
  onChange: (items: StoryChapter[]) => void;
}

export default function StoryEditor({ items, onChange }: StoryEditorProps) {
  const update = (i: number, patch: Partial<StoryChapter>) => {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <div key={i} className="border-[3px] border-ink bg-paper p-4">
          <div className="flex items-start gap-2">
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-[100px_1fr]">
              <TextInput
                type="text"
                placeholder="Tahun"
                maxLength={30}
                value={item.year}
                onChange={(e) => update(i, { year: e.target.value })}
              />
              <TextInput
                type="text"
                placeholder="Judul (mis. First Meet)"
                maxLength={60}
                value={item.title}
                onChange={(e) => update(i, { title: e.target.value })}
              />
              <TextArea
                placeholder="Ceritanya..."
                maxLength={400}
                rows={2}
                value={item.text}
                onChange={(e) => update(i, { text: e.target.value })}
                className="sm:col-span-2"
              />
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Pindah ke atas"
                className="btn-brutal bg-paper p-2 disabled:opacity-30"
              >
                <ArrowUp aria-hidden="true" className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                aria-label="Pindah ke bawah"
                className="btn-brutal bg-paper p-2 disabled:opacity-30"
              >
                <ArrowDown aria-hidden="true" className="h-4 w-4" />
              </button>
              <RemoveButton label="Hapus cerita ini" onClick={() => remove(i)} />
            </div>
          </div>
        </div>
      ))}

      {items.length < 12 && (
        <AddButton
          label="Tambah Cerita"
          onClick={() => onChange([...items, { year: "", title: "", text: "" }])}
        />
      )}
    </div>
  );
}
