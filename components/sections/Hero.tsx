import { Heart } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import Reveal from "@/components/ui/Reveal";
import Marquee from "@/components/ui/Marquee";

/** Poster-style home section — the couple's names as oversized typography. */
export default function Hero() {
  const { couple, event } = weddingConfig;

  return (
    <section id="home" className="relative overflow-hidden pt-20 sm:pt-28">
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 pb-16 text-center sm:pb-24">
        <Reveal>
          <span className="sticker bg-bubblegum rotate-2 text-xs sm:text-sm">
            We are getting married
          </span>
        </Reveal>

        <Reveal delay={100}>
          <h2 className="mt-8 font-display uppercase leading-[0.88] text-[clamp(4rem,17vw,11rem)]">
            {couple.bride.name}
            <span className="relative mx-3 inline-flex align-middle sm:mx-6">
              <Heart
                aria-hidden="true"
                className="h-[0.55em] w-[0.55em] fill-coral stroke-ink stroke-[1.5] rotate-6"
              />
            </span>
            {couple.groom.name}
          </h2>
        </Reveal>

        <Reveal delay={200} className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {[
            event.dateLabel.day,
            event.dateLabel.date,
            event.dateLabel.year,
          ].map((chunk, i) => (
            <span
              key={chunk}
              className={`border-[3px] border-ink px-4 py-2 font-heading text-sm font-bold uppercase tracking-widest shadow-[4px_4px_0_0_#141414] sm:text-base ${
                ["bg-lemon", "bg-paper", "bg-teal text-cream"][i]
              } ${i % 2 === 0 ? "-rotate-1" : "rotate-1"}`}
            >
              {chunk}
            </span>
          ))}
        </Reveal>
      </div>

      <Marquee
        items={["Nura & Dika", "05.09.2026", "Save the date", "Garut, Jawa Barat"]}
        className="bg-lemon"
      />
    </section>
  );
}
