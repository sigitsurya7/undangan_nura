"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, Minus, Plus } from "lucide-react";
import type { EditableSettings } from "@/config/wedding";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";

type Attendance = "hadir" | "tidak";

interface RsvpProps {
  settings: EditableSettings;
}

export interface RsvpPayload {
  name: string;
  attendance: Attendance;
  guestCount: number;
}

/** Kirim konfirmasi kehadiran ke storage via /api/rsvp. */
async function handleRSVP(payload: RsvpPayload): Promise<void> {
  const res = await fetch("/api/rsvp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const data = (await res.json().catch(() => null)) as {
      error?: string;
    } | null;
    throw new Error(data?.error ?? "Gagal menyimpan konfirmasi.");
  }
}

/** WILL YOU JOIN US? — RSVP form, tersimpan ke storage. */
export default function Rsvp({ settings }: RsvpProps) {
  const [name, setName] = useState("");
  const [attendance, setAttendance] = useState<Attendance>("hadir");
  const [guestCount, setGuestCount] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!settings.rsvp.enabled) return null;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || sending) return;

    setSending(true);
    setError(null);
    try {
      await handleRSVP({ name: name.trim(), attendance, guestCount });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="rsvp" className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-xl">
        <SectionTitle
          sticker="RSVP"
          stickerColor="bg-coral text-cream"
          title="Will You Join Us?"
        />

        <Reveal className="mt-12 sm:mt-16">
          {submitted ? (
            <div className="card-brutal bg-lemon px-8 py-12 text-center sm:-rotate-1">
              <span className="mx-auto flex h-14 w-14 items-center justify-center border-[3px] border-ink bg-paper shadow-[4px_4px_0_0_#141414]">
                <Check aria-hidden="true" className="h-7 w-7" />
              </span>
              <p className="mt-6 font-display text-2xl uppercase sm:text-3xl">
                Terima kasih!
              </p>
              <p className="mt-2 text-sm sm:text-base">
                Konfirmasi kehadiran kamu sudah diterima.
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="card-brutal px-6 py-8 sm:px-10">
              <label className="block">
                <span className="font-heading text-sm font-bold uppercase tracking-widest">
                  Nama
                </span>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama kamu"
                  className="input-brutal mt-2"
                />
              </label>

              <fieldset className="mt-6">
                <legend className="font-heading text-sm font-bold uppercase tracking-widest">
                  Kehadiran
                </legend>
                <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {(
                    [
                      ["hadir", "Akan Hadir"],
                      ["tidak", "Tidak Dapat Hadir"],
                    ] as const
                  ).map(([value, label]) => (
                    <label
                      key={value}
                      className={`flex cursor-pointer items-center gap-3 border-[3px] border-ink px-4 py-3 font-heading text-sm font-bold transition-colors ${
                        attendance === value
                          ? "bg-bubblegum shadow-[4px_4px_0_0_#141414]"
                          : "bg-paper"
                      }`}
                    >
                      <input
                        type="radio"
                        name="attendance"
                        value={value}
                        checked={attendance === value}
                        onChange={() => setAttendance(value)}
                        className="h-4 w-4 accent-ink"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </fieldset>

              {attendance === "hadir" && (
                <div className="mt-6">
                  <span className="font-heading text-sm font-bold uppercase tracking-widest">
                    Jumlah Tamu
                  </span>
                  <div className="mt-2 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setGuestCount((c) => Math.max(1, c - 1))}
                      aria-label="Kurangi jumlah tamu"
                      className="btn-brutal bg-paper p-2"
                    >
                      <Minus aria-hidden="true" className="h-5 w-5" />
                    </button>
                    <span
                      aria-live="polite"
                      className="flex h-12 w-14 items-center justify-center border-[3px] border-ink bg-lemon font-display text-xl shadow-[4px_4px_0_0_#141414]"
                    >
                      {guestCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuestCount((c) => Math.min(10, c + 1))}
                      aria-label="Tambah jumlah tamu"
                      className="btn-brutal bg-paper p-2"
                    >
                      <Plus aria-hidden="true" className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="mt-6 border-[3px] border-ink bg-coral px-4 py-3 text-sm font-bold text-cream"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={sending}
                className="btn-brutal mt-8 w-full bg-coral px-6 py-4 text-sm uppercase text-cream disabled:opacity-70 sm:text-base"
              >
                {sending ? "Mengirim..." : "Konfirmasi Kehadiran"}
                <ArrowRight aria-hidden="true" className="h-5 w-5" />
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
