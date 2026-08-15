import { Radio } from "lucide-react";
import type { EditableSettings } from "@/config/wedding";
import Reveal from "@/components/ui/Reveal";

interface StreamingProps {
  settings: EditableSettings;
}

/** Optional live streaming section — hidden when disabled or URL empty. */
export default function Streaming({ settings }: StreamingProps) {
  const { streaming } = settings;

  if (!streaming.enabled || !streaming.url) return null;

  return (
    <section className="border-y-[3px] border-ink bg-ink px-6 py-16 text-cream sm:py-24">
      <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="sticker bg-coral -rotate-2 text-xs text-cream">
          <Radio aria-hidden="true" className="mr-1 inline h-3 w-3" /> Live
        </span>
        <h2 className="mt-6 font-display text-4xl uppercase leading-[0.95] sm:text-6xl">
          Can&apos;t make it?
          <br />
          Join us online.
        </h2>
        <a
          href={streaming.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-brutal mt-10 border-cream bg-lemon px-8 py-4 text-base uppercase text-ink shadow-[5px_5px_0_0_#faf1e4] hover:shadow-[2px_2px_0_0_#faf1e4] active:shadow-[0_0_0_0_#faf1e4]"
        >
          Watch Live →
        </a>
      </Reveal>
    </section>
  );
}
