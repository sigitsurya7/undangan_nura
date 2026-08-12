import { weddingConfig, type Person } from "@/config/wedding";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

function ProfileCard({
  person,
  role,
  parentPrefix,
  tone,
  rotate,
  delay,
}: {
  person: Person;
  role: string;
  parentPrefix: string;
  tone: string;
  rotate: string;
  delay: number;
}) {
  return (
    <Reveal delay={delay} className="w-full max-w-sm">
      <article className={`card-brutal overflow-hidden ${rotate}`}>
        <div className="relative aspect-[4/5] border-b-[3px] border-ink">
          <PhotoPlaceholder
            src={person.photo}
            label={`[PHOTO ${person.name.toUpperCase()}]`}
            alt={`Foto ${person.name}`}
            tone={tone}
          />
          <span className="sticker bg-paper absolute bottom-3 left-3 -rotate-2 text-xs">
            {role}
          </span>
        </div>
        <div className="px-6 py-6 text-center">
          <h3 className="font-display text-3xl uppercase sm:text-4xl">
            {person.fullName}
          </h3>
          <p className="mt-3 text-sm text-ink/70">{parentPrefix}</p>
          <p className="mt-1 font-heading text-sm font-bold sm:text-base">
            Bapak {person.parents.father}
            <br />
            &amp; Ibu {person.parents.mother}
          </p>
        </div>
      </article>
    </Reveal>
  );
}

/** THE COUPLE — two profile cards for bride and groom. */
export default function Couple() {
  const { bride, groom } = weddingConfig.couple;

  return (
    <section id="couple" className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <SectionTitle sticker="Assalamu'alaikum" title="The Couple" />

        <div className="mt-12 flex flex-col items-center justify-center gap-10 sm:mt-16 sm:flex-row sm:items-start sm:gap-8">
          <ProfileCard
            person={bride}
            role="The Bride"
            parentPrefix="Putri dari"
            tone="bg-bubblegum"
            rotate="sm:-rotate-2"
            delay={0}
          />

          <div
            aria-hidden="true"
            className="font-display text-5xl text-coral sm:mt-32"
          >
            &amp;
          </div>

          <ProfileCard
            person={groom}
            role="The Groom"
            parentPrefix="Putra dari"
            tone="bg-periwinkle"
            rotate="sm:rotate-2"
            delay={150}
          />
        </div>
      </div>
    </section>
  );
}
