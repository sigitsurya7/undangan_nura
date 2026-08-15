"use client";

/* eslint-disable @next/next/no-img-element */

import { useRef, useState, type ChangeEvent } from "react";
import { Check, ImagePlus, Images, Loader2, X } from "lucide-react";
import { adminFetch } from "@/lib/admin-session";
import type { StoredMedia } from "@/app/api/settings/upload/route";

interface PhotoPickerProps {
  label: string;
  value: string | null;
  onChange: (url: string | null) => void;
  /** Rasio aspek pratinjau, default persegi */
  aspect?: string;
}

/**
 * Upload foto baru atau pilih dari foto yang sudah pernah diunggah.
 * Upload langsung tersimpan ke storage; hasilnya baru terpasang ke field
 * ini setelah dipilih (dan permanen setelah form pengaturan disimpan).
 */
export default function PhotoPicker({
  label,
  value,
  onChange,
  aspect = "aspect-square",
}: PhotoPickerProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [media, setMedia] = useState<StoredMedia[]>([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const upload = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await adminFetch("/api/settings/upload", {
        method: "POST",
        body: form,
      });
      const data = (await res.json().catch(() => null)) as {
        media?: StoredMedia;
        error?: string;
      } | null;
      if (!res.ok || !data?.media) {
        throw new Error(data?.error ?? "Gagal mengunggah foto.");
      }
      onChange(data.media.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setUploading(false);
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) upload(file);
  };

  const openPicker = async () => {
    setPickerOpen(true);
    setLoadingMedia(true);
    try {
      const res = await fetch("/api/settings/media");
      const data = (await res.json().catch(() => null)) as {
        media?: StoredMedia[];
      } | null;
      setMedia(data?.media ?? []);
    } finally {
      setLoadingMedia(false);
    }
  };

  return (
    <div>
      <span className="font-heading text-sm font-bold uppercase tracking-widest">
        {label}
      </span>

      <div className="mt-2 flex items-center gap-4">
        <div
          className={`${aspect} w-24 shrink-0 overflow-hidden border-[3px] border-ink bg-paper shadow-brutal-sm`}
        >
          {value ? (
            <img src={value} alt={label} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-ink/30">
              <ImagePlus aria-hidden="true" className="h-6 w-6" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-brutal bg-lemon px-3 py-2 text-xs uppercase disabled:opacity-70"
            >
              {uploading ? (
                <>
                  <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                  Mengunggah...
                </>
              ) : (
                <>
                  <ImagePlus aria-hidden="true" className="h-4 w-4" />
                  Upload Baru
                </>
              )}
            </button>
            <button
              type="button"
              onClick={openPicker}
              className="btn-brutal bg-paper px-3 py-2 text-xs uppercase"
            >
              <Images aria-hidden="true" className="h-4 w-4" />
              Pilih dari Galeri
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange(null)}
                aria-label={`Hapus ${label}`}
                className="btn-brutal bg-coral p-2 text-cream"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            )}
          </div>
          {error && <p className="text-xs font-bold text-coral">{error}</p>}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={onFileChange}
          className="sr-only"
        />
      </div>

      {/* Modal pilih dari galeri */}
      {pickerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Pilih foto dari galeri"
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/80 px-4"
          onClick={() => setPickerOpen(false)}
        >
          <div
            className="card-brutal max-h-[80vh] w-full max-w-lg overflow-y-auto bg-paper p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg uppercase">Pilih Foto</h3>
              <button
                type="button"
                onClick={() => setPickerOpen(false)}
                aria-label="Tutup"
                className="btn-brutal bg-coral p-2 text-cream"
              >
                <X aria-hidden="true" className="h-4 w-4" />
              </button>
            </div>

            {loadingMedia ? (
              <p className="mt-6 text-center text-sm text-ink/60">Memuat...</p>
            ) : media.length === 0 ? (
              <p className="mt-6 text-center text-sm text-ink/60">
                Belum ada foto yang diunggah.
              </p>
            ) : (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {media.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      onChange(m.url);
                      setPickerOpen(false);
                    }}
                    className="relative aspect-square overflow-hidden border-[3px] border-ink"
                  >
                    <img
                      src={m.url}
                      alt={m.filename}
                      className="h-full w-full object-cover"
                    />
                    {value === m.url && (
                      <span className="absolute inset-0 flex items-center justify-center bg-ink/50">
                        <Check aria-hidden="true" className="h-6 w-6 text-cream" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
