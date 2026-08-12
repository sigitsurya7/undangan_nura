import { CalendarDays, Clock, MapPin } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";

/** SAVE THE DATE — the main informational event card. */
export default function EventDetails() {
  const { event } = weddingConfig;

  return (
    <section id="event" className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <SectionTitle sticker="Mark your calendar" title="Save the Date" />

        <Reveal className="mt-12 sm:mt-16">
          <div className="card-brutal overflow-hidden sm:-rotate-1">
            {/* Big date banner */}
            <div className="border-b-[3px] border-ink bg-lemon px-6 py-8 text-center sm:py-10">
              <p className="font-heading text-base font-bold uppercase tracking-[0.3em] sm:text-lg">
                {event.dateLabel.day}
              </p>
              <p className="font-display text-4xl uppercase leading-none sm:text-6xl">
                {event.dateLabel.date}
              </p>
              <p className="mt-2 font-display text-2xl sm:text-4xl">
                {event.dateLabel.year}
              </p>
            </div>

            <div className="grid sm:grid-cols-2">
              {/* Time */}
              <div className="flex flex-col items-center gap-3 border-b-[3px] border-ink px-6 py-8 text-center sm:border-b-0 sm:border-r-[3px]">
                <span className="flex h-12 w-12 items-center justify-center border-[3px] border-ink bg-bubblegum shadow-[4px_4px_0_0_#141414]">
                  <Clock aria-hidden="true" className="h-6 w-6" />
                </span>
                <h3 className="font-heading text-sm font-bold uppercase tracking-widest">
                  Waktu
                </h3>
                <p className="font-display text-2xl sm:text-3xl">{event.time}</p>
                <p className="font-heading text-sm font-bold uppercase text-ink/70">
                  {event.timeEnd}
                </p>
              </div>

              {/* Location */}
              <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
                <span className="flex h-12 w-12 items-center justify-center border-[3px] border-ink bg-teal shadow-[4px_4px_0_0_#141414]">
                  <MapPin aria-hidden="true" className="h-6 w-6 text-cream" />
                </span>
                <h3 className="font-heading text-sm font-bold uppercase tracking-widest">
                  Lokasi
                </h3>
                <p className="font-heading text-base font-bold sm:text-lg">
                  {event.venue}
                </p>
                <p className="text-sm leading-relaxed text-ink/75">
                  {event.address}
                </p>
              </div>
            </div>

            {/* Footer strip */}
            <div className="flex items-center justify-center gap-2 border-t-[3px] border-ink bg-coral px-6 py-3 text-cream">
              <CalendarDays aria-hidden="true" className="h-4 w-4" />
              <p className="font-heading text-sm font-bold uppercase tracking-widest">
                {event.fullDateText}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
