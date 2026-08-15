"use client";

import type { BankAccount } from "@/config/wedding";
import PhotoPicker from "./PhotoPicker";
import { AddButton, RemoveButton, TextInput } from "./fields";

interface GiftAccountsEditorProps {
  items: BankAccount[];
  onChange: (items: BankAccount[]) => void;
}

export default function GiftAccountsEditor({ items, onChange }: GiftAccountsEditorProps) {
  const update = (i: number, patch: Partial<BankAccount>) => {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  };

  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i));

  return (
    <div className="flex flex-col gap-4">
      {items.map((item, i) => (
        <div key={i} className="border-[3px] border-ink bg-paper p-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <TextInput
              type="text"
              placeholder="Nama Bank (mis. BCA)"
              maxLength={50}
              value={item.bank}
              onChange={(e) => update(i, { bank: e.target.value })}
            />
            <TextInput
              type="text"
              placeholder="Nomor Rekening"
              maxLength={50}
              value={item.number}
              onChange={(e) => update(i, { number: e.target.value })}
            />
            <TextInput
              type="text"
              placeholder="a.n. Nama Pemilik"
              maxLength={100}
              value={item.holder}
              onChange={(e) => update(i, { holder: e.target.value })}
              className="sm:col-span-2"
            />
          </div>
          <div className="mt-4 flex items-end justify-between gap-3">
            <PhotoPicker
              label="QRIS (opsional)"
              value={item.qr}
              onChange={(qr) => update(i, { qr })}
            />
            <RemoveButton label="Hapus rekening ini" onClick={() => remove(i)} />
          </div>
        </div>
      ))}

      {items.length < 5 && (
        <AddButton
          label="Tambah Rekening"
          onClick={() =>
            onChange([...items, { bank: "", number: "", holder: "", qr: null }])
          }
        />
      )}
    </div>
  );
}
