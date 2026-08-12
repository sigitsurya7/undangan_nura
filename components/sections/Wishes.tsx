"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import { weddingConfig, type Wish } from "@/config/wedding";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";

/** WISHES & PRAYERS — wish form + list (dummy seed, local state only). */
export default function Wishes() {
  const { wishes } = weddingConfig;
  const [list, setList] = useState<Wish[]>(wishes.seed);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  if (!wishes.enabled) return null;

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    setList((cur) => [{ name: name.trim(), message: message.trim() }, ...cur]);
    setName("");
    setMessage("");
    setSent(true);
    setTimeout(() => setSent(false), 2500);
  };

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
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tulis ucapan dan doa terbaikmu..."
                rows={4}
                className="input-brutal mt-2 resize-none"
              />
            </label>

            <button
              type="submit"
              className="btn-brutal mt-6 w-full bg-lemon px-6 py-4 text-sm uppercase sm:text-base"
            >
              {sent ? "Terkirim ✦" : "Kirim Ucapan"}
              <Send aria-hidden="true" className="h-4 w-4" />
            </button>
          </form>
        </Reveal>

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
      </div>
    </section>
  );
}
