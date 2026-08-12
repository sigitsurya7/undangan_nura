"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeLeft(target: number): TimeLeft | null {
  const diff = target - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
  };
}

/** Real-time countdown to the wedding day. */
export default function Countdown() {
  const target = new Date(weddingConfig.event.dateTime).getTime();
  // null = belum mount (hindari hydration mismatch); "done" = waktunya tiba
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null | "pending">("pending");

  useEffect(() => {
    setTimeLeft(getTimeLeft(target));
    const id = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units =
    timeLeft && timeLeft !== "pending"
      ? ([
          [timeLeft.days, "Days"],
          [timeLeft.hours, "Hours"],
          [timeLeft.minutes, "Minutes"],
          [timeLeft.seconds, "Seconds"],
        ] as const)
      : ([
          ["--", "Days"],
          ["--", "Hours"],
          ["--", "Minutes"],
          ["--", "Seconds"],
        ] as const);

  const tones = ["bg-lemon", "bg-bubblegum", "bg-teal text-cream", "bg-coral text-cream"];
  const isDone = timeLeft === null;

  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <SectionTitle
          sticker="Counting down"
          stickerColor="bg-bubblegum"
          title="The Big Day"
        />

        <Reveal className="mt-12 sm:mt-16">
          {isDone ? (
            <div className="card-brutal bg-lemon px-6 py-14 text-center sm:-rotate-1">
              <p className="font-display text-3xl uppercase leading-tight sm:text-5xl">
                The Day Is Here
              </p>
              <Heart
                aria-hidden="true"
                className="mx-auto mt-4 h-10 w-10 fill-coral stroke-ink stroke-[1.5]"
              />
            </div>
          ) : (
            <div
              className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-6"
              role="timer"
              aria-live="off"
              aria-label="Hitung mundur menuju hari pernikahan"
            >
              {units.map(([value, label], i) => (
                <div
                  key={label}
                  className={`card-brutal flex flex-col items-center px-2 py-6 sm:py-8 ${
                    tones[i]
                  } ${i % 2 === 0 ? "-rotate-1" : "rotate-1"}`}
                >
                  <span className="font-display text-4xl tabular-nums leading-none sm:text-6xl">
                    {typeof value === "number"
                      ? String(value).padStart(2, "0")
                      : value}
                  </span>
                  <span className="mt-2 font-heading text-xs font-bold uppercase tracking-[0.25em] sm:text-sm">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
