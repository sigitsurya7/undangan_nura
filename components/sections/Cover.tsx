"use client";

import { useSearchParams } from "next/navigation";
import { ArrowRight, Heart } from "lucide-react";
import { weddingConfig } from "@/config/wedding";

interface CoverProps {
  onOpen: () => void;
  opened: boolean;
}

/**
 * Full-screen opening cover. Shows guest greeting (reads `?to=` from the URL,
 * falls back to the placeholder) and the "Buka Undangan" button.
 * Pemakainya wajib membungkus dengan <Suspense> (karena useSearchParams).
 */
export default function Cover({ onOpen, opened }: CoverProps) {
  const { couple, event } = weddingConfig;
  const guestName = useSearchParams().get("to")?.trim() || "[Nama Tamu]";

  return (
    <div
      aria-hidden={opened}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-cream px-6 transition-[opacity,visibility] duration-700 ${
        opened ? "pointer-events-none invisible opacity-0" : "visible opacity-100"
      }`}
    >
      {/* Decorative corner stickers */}
      <span className="sticker bg-bubblegum absolute left-4 top-6 -rotate-6 text-xs sm:left-10 sm:top-10 sm:text-sm">
        05.09.26
      </span>
      <span className="sticker bg-lemon absolute right-4 top-6 rotate-3 text-xs sm:right-10 sm:top-10 sm:text-sm">
        Save the date
      </span>
      <span className="sticker bg-teal absolute bottom-6 left-4 rotate-2 text-xs text-cream sm:bottom-10 sm:left-10 sm:text-sm">
        Love is here
      </span>
      <Heart
        aria-hidden="true"
        className="absolute bottom-8 right-6 h-10 w-10 rotate-12 fill-coral stroke-ink stroke-[1.5] sm:bottom-12 sm:right-12 sm:h-14 sm:w-14"
      />

      <div className="flex w-full max-w-md flex-col items-center text-center">
        <p className="font-heading text-sm font-bold uppercase tracking-[0.35em] sm:text-base">
          The Wedding Of
        </p>

        {/* Names + date block — the visual hero */}
        <div className="relative mt-5 w-full">
          <h1 className="font-display uppercase leading-[0.9]">
            <span className="block text-[clamp(3.5rem,18vw,6.5rem)]">
              {couple.bride.name}
            </span>
            <span className="my-1 inline-block rotate-[-4deg] border-[3px] border-ink bg-coral px-4 py-1 text-[clamp(1.5rem,7vw,2.5rem)] text-cream shadow-[4px_4px_0_0_#141414]">
              &amp;
            </span>
            <span className="block text-[clamp(3.5rem,18vw,6.5rem)]">
              {couple.groom.name}
            </span>
          </h1>

          <div
            aria-hidden="true"
            className="absolute -right-2 top-1/2 hidden -translate-y-1/2 flex-col gap-1 sm:flex"
          >
            {["05", "09", "26"].map((n) => (
              <span
                key={n}
                className="border-[3px] border-ink bg-paper px-2 py-0.5 font-heading text-sm font-bold shadow-[3px_3px_0_0_#141414]"
              >
                {n}
              </span>
            ))}
          </div>
        </div>

        <p className="mt-5 border-y-[3px] border-ink py-2 font-heading text-sm font-bold uppercase tracking-[0.2em] sm:text-base">
          {event.fullDateText}
        </p>

        <div className="card-brutal mt-8 w-full max-w-xs px-6 py-4">
          <p className="text-sm text-ink/70">Kepada Yth.</p>
          <p className="text-sm text-ink/70">Bapak/Ibu/Saudara/i</p>
          <p className="mt-1 font-heading text-lg font-bold">{guestName}</p>
        </div>

        <button
          type="button"
          onClick={onOpen}
          className="btn-brutal mt-8 bg-lemon px-8 py-4 text-base uppercase sm:text-lg"
        >
          Buka Undangan
          <ArrowRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
