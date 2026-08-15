import { ExternalLink } from "lucide-react";
import type { EditableSettings } from "@/config/wedding";
import { buildMapsEmbedUrl, buildMapsUrl } from "@/lib/event-date";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";

interface VenueProps {
  settings: EditableSettings;
}

/** THE VENUE — embedded Google Maps (no API key) + open-in-maps button. */
export default function Venue({ settings }: VenueProps) {
  const { event } = settings;
  const { lat, lng } = event.coordinates;
  const embedUrl = buildMapsEmbedUrl(lat, lng);
  const mapsUrl = buildMapsUrl(lat, lng);

  return (
    <section className="border-y-[3px] border-ink bg-periwinkle/30 px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <SectionTitle sticker="See you there" stickerColor="bg-teal text-cream" title="The Venue" />

        <Reveal className="mt-12 sm:mt-16">
          <div className="card-brutal overflow-hidden sm:rotate-1">
            <iframe
              title={`Peta lokasi acara — ${event.venue}`}
              src={embedUrl}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-72 w-full border-b-[3px] border-ink sm:h-96"
            />
            <div className="flex flex-col items-center gap-4 px-6 py-8 text-center">
              <p className="font-heading text-base font-bold sm:text-lg">
                {event.venue}
              </p>
              <p className="text-sm text-ink/75">{event.address}</p>
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brutal bg-teal px-6 py-3 text-sm uppercase text-cream sm:text-base"
              >
                Lihat di Google Maps
                <ExternalLink aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
