import type { EditableSettings } from "@/config/wedding";
import Reveal from "@/components/ui/Reveal";

interface VerseProps {
  settings: EditableSettings;
}

/** Minimal Islamic verse section (QS. Ar-Rum: 21 secara default). */
export default function Verse({ settings }: VerseProps) {
  const { verse } = settings;

  return (
    <section className="px-6 py-16 sm:py-24">
      <Reveal className="mx-auto max-w-2xl">
        <figure className="card-brutal relative px-6 py-10 text-center sm:px-12">
          <span
            aria-hidden="true"
            className="sticker bg-lemon absolute -top-4 left-1/2 -translate-x-1/2 -rotate-2 text-xs"
          >
            ✦
          </span>
          <p
            lang="ar"
            dir="rtl"
            className="font-heading text-xl leading-relaxed sm:text-2xl"
          >
            {verse.arabic}
          </p>
          <blockquote className="mt-6 text-sm leading-relaxed text-ink/80 sm:text-base">
            {verse.translation}
          </blockquote>
          <figcaption className="mt-6">
            <span className="sticker bg-bubblegum rotate-1 text-xs">
              {verse.source}
            </span>
          </figcaption>
        </figure>
      </Reveal>
    </section>
  );
}
