import { Shirt } from "lucide-react";
import type { EditableSettings } from "@/config/wedding";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";

interface DressCodeProps {
  settings: EditableSettings;
}

/** Optional dress code section with a color palette — hidden when empty. */
export default function DressCode({ settings }: DressCodeProps) {
  const { dressCode } = settings;

  if (!dressCode.enabled || !dressCode.text) return null;

  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-xl">
        <SectionTitle sticker="What to wear" title="Dress Code" />

        <Reveal className="mt-10">
          <div className="card-brutal px-6 py-8 text-center sm:-rotate-1">
            <span className="mx-auto flex h-12 w-12 items-center justify-center border-[3px] border-ink bg-lemon shadow-[4px_4px_0_0_#141414]">
              <Shirt aria-hidden="true" className="h-6 w-6" />
            </span>
            <p className="mt-5 font-heading text-lg font-bold uppercase tracking-widest">
              {dressCode.text}
            </p>

            {dressCode.colors.length > 0 && (
              <div className="mt-6 flex justify-center gap-3">
                {dressCode.colors.map((color) => (
                  <span
                    key={color}
                    title={color}
                    style={{ backgroundColor: color }}
                    className="h-12 w-12 border-[3px] border-ink shadow-[3px_3px_0_0_#141414]"
                  />
                ))}
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
