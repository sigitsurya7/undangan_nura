"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import type { EditableSettings, Wish } from "@/config/wedding";
import type { StoredWish } from "@/lib/records";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";

interface WishesProps {
  settings: EditableSettings;
}

/**
 * WISHES & PRAYERS — form + daftar ucapan.
 * Data disimpan via /api/wishes. Tidak ada data dummy — sebelum ada
 * ucapan yang tersimpan, daftar hanya menampilkan pesan kosong.
 */
export default function Wishes({ settings }: WishesProps) {
  const [list, setList] = useState<Wish[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  useEffect(() => {
    if (!settings.wishes.enabled) return;
    fetch("/api/wishes")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { wishes?: StoredWish[] } | null) => {
        if (data?.wishes) setList(data.wishes);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, [settings.wishes.enabled]);

  if (!settings.wishes.enabled) return null;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim() || status === "sending") return;

    setStatus("sending");
    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), message: message.trim() }),
      });
      if (!res.ok) throw new Error();

      const wish: Wish = { name: name.trim(), message: message.trim() };
      setList((cur) => [wish, ...cur]);
      setName("");
      setMessage("");
      setStatus("sent");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const buttonLabel = {
    idle: "Kirim Ucapan",
    sending: "Mengirim...",
    sent: "Terkirim ✦",
    error: "Gagal — coba lagi",
  }[status];

  const tones = ["bg-lemon", "bg-bubblegum", "bg-periwinkle"];

  return (
    <section className="border-y-[3px] border-ink bg-paper px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl">
        <SectionTitle sticker="For the couple" title="Wishes & Prayers" />

        <Reveal className="mt-12 sm:mt-16">
          <form onSubmit={onSubmit} className="card-brutal px-6 py-8 sm:-rotate-1 sm:px-10">
            <label className="block">
              <span className="font-heading text-sm font-bold uppercase tracking-widest">
                Nama
              </span>
              <input
                type="text"
                required
                maxLength={100}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama kamu"
                className="input-brutal mt-2"
              />
            </label>

            <label className="mt-6 block">
              <span className="font-heading text-sm font-bold uppercase tracking-widest">
                Ucapan &amp; doa
              </span>
              <textarea
                required
                maxLength={500}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis ucapan dan doa terbaikmu..."
                rows={4}
                className="input-brutal mt-2 resize-none"
              />
            </label>

            <button
              type="submit"
              disabled={status === "sending"}
              className={`btn-brutal mt-6 w-full px-6 py-4 text-sm uppercase sm:text-base ${
                status === "error" ? "bg-coral text-cream" : "bg-lemon"
              } disabled:opacity-70`}
            >
              {buttonLabel}
              <Send aria-hidden="true" className="h-4 w-4" />
            </button>
          </form>
        </Reveal>

        {list.length > 0 ? (
          <ul className="mt-10 flex flex-col gap-5" aria-live="polite">
            {list.map((wish, i) => (
              <Reveal key={`${wish.name}-${i}`} delay={i * 60}>
                <li
                  className={`border-[3px] border-ink px-6 py-5 shadow-[5px_5px_0_0_#141414] ${
                    tones[i % tones.length]
                  } ${i % 2 === 0 ? "sm:-rotate-1" : "sm:rotate-1"}`}
                >
                  <p className="text-sm leading-relaxed sm:text-base">
                    &ldquo;{wish.message}&rdquo;
                  </p>
                  <p className="mt-3 font-heading text-sm font-bold uppercase tracking-widest">
                    — {wish.name}
                  </p>
                </li>
              </Reveal>
            ))}
          </ul>
        ) : (
          loaded && (
            <p className="mt-10 text-center text-sm text-ink/60">
              Jadilah yang pertama mengirimkan ucapan &amp; doa. ✦
            </p>
          )
        )}
      </div>
    </section>
  );
}
