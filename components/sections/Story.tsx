import type { EditableSettings } from "@/config/wedding";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";

interface StoryProps {
  settings: EditableSettings;
}

/** OUR STORY — vertical timeline built from config data. */
export default function Story({ settings }: StoryProps) {
  const { story } = settings;
  const tones = ["bg-lemon", "bg-bubblegum", "bg-periwinkle", "bg-coral text-cream"];

  if (story.length === 0) return null;

  return (
    <section id="story" className="border-y-[3px] border-ink bg-paper px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl">
        <SectionTitle sticker="How it started" stickerColor="bg-coral text-cream" title="Our Story" />

        <ol className="relative mt-14 flex flex-col gap-10 border-l-[3px] border-ink pl-8 sm:mt-16 sm:gap-12 sm:pl-12">
          {story.map((chapter, i) => (
            <li key={`${chapter.year}-${chapter.title}-${i}`} className="relative">
              {/* Timeline node */}
              <span
                aria-hidden="true"
                className="absolute -left-[calc(2rem+11px)] top-1 h-5 w-5 border-[3px] border-ink bg-lemon sm:-left-[calc(3rem+11px)]"
              />
              <Reveal delay={i * 80}>
                <div
                  className={`card-brutal px-6 py-6 ${i % 2 === 0 ? "sm:-rotate-1" : "sm:rotate-1"}`}
                >
                  <span
                    className={`sticker text-xs ${tones[i % tones.length]} -rotate-2`}
                  >
                    {chapter.year}
                  </span>
                  <h3 className="mt-4 font-display text-2xl uppercase sm:text-3xl">
                    {chapter.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink/75 sm:text-base">
                    {chapter.text}
                  </p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
