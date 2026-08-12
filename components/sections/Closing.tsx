import { Heart } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import Reveal from "@/components/ui/Reveal";
import Marquee from "@/components/ui/Marquee";

/** Big memorable closing section. */
export default function Closing() {
  const { couple, event } = weddingConfig;

  return (
    <footer className="border-t-[3px] border-ink bg-ink text-cream">
      <Marquee
        items={["Thank you", "Terima kasih", "See you there", "05.09.2026"]}
        className="border-y-0 border-b-[3px] border-cream/30 bg-ink text-cream"
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center sm:py-28">
        <Reveal>
          <h2 className="font-display uppercase leading-[0.92] text-[clamp(2.5rem,10vw,5.5rem)]">
            We&apos;d love to
            <br />
            see you there.
          </h2>
        </Reveal>

        <Reveal delay={150}>
          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-cream/75 sm:text-base">
            Terima kasih atas doa, kasih sayang, dan kehadiranmu di hari bahagia
            kami.
          </p>
        </Reveal>

        <Reveal delay={250} className="mt-12 flex flex-col items-center gap-6">
          <Heart
            aria-hidden="true"
            className="h-10 w-10 rotate-6 fill-coral stroke-cream stroke-[1.5]"
          />
          <p className="font-display text-3xl uppercase sm:text-5xl">
            {couple.bride.name} &amp; {couple.groom.name}
          </p>
          <span className="sticker bg-lemon -rotate-2 text-sm text-ink">
            {event.dateShort}
          </span>
        </Reveal>
      </div>
    </footer>
  );
}
