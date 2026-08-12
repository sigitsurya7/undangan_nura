"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import PhotoPlaceholder from "@/components/ui/PhotoPlaceholder";

const tones = [
  "bg-lemon",
  "bg-bubblegum",
  "bg-periwinkle",
  "bg-teal",
  "bg-coral",
  "bg-paper",
];

/** OUR MOMENTS — photo grid (2 cols mobile / 3 desktop) with a lightbox. */
export default function Gallery() {
  const { gallery } = weddingConfig;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const close = useCallback(() => setActiveIndex(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setActiveIndex((cur) =>
        cur === null ? cur : (cur + dir + gallery.length) % gallery.length,
      ),
    [gallery.length],
  );

  useEffect(() => {
    if (activeIndex === null) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [activeIndex, close, step]);

  if (gallery.length === 0) return null;

  return (
    <section id="gallery" className="border-y-[3px] border-ink bg-paper px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl">
        <SectionTitle sticker="Captured with love" title="Our Moments" />

        <div className="mt-12 grid grid-cols-2 gap-4 sm:mt-16 sm:gap-6 lg:grid-cols-3">
          {gallery.map((photo, i) => (
            <Reveal key={photo.alt} delay={(i % 3) * 80}>
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Buka foto: ${photo.alt}`}
                className={`card-brutal block w-full cursor-zoom-in overflow-hidden p-0 transition-transform hover:-translate-y-1 ${
                  i % 2 === 0 ? "-rotate-1" : "rotate-1"
                } ${i % 3 === 1 ? "aspect-[3/4]" : "aspect-square"}`}
              >
                <PhotoPlaceholder
                  src={photo.src}
                  label={photo.alt}
                  alt={photo.alt}
                  tone={tones[i % tones.length]}
                />
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${activeIndex + 1} dari ${gallery.length}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/85 px-4"
          onClick={close}
        >
          <div
            className="relative w-full max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="card-brutal aspect-square w-full overflow-hidden sm:aspect-[4/3]">
              <PhotoPlaceholder
                src={gallery[activeIndex].src}
                label={gallery[activeIndex].alt}
                alt={gallery[activeIndex].alt}
                tone={tones[activeIndex % tones.length]}
              />
            </div>

            <p className="mt-3 text-center font-heading text-sm font-bold uppercase tracking-widest text-cream">
              {activeIndex + 1} / {gallery.length}
            </p>

            <button
              type="button"
              onClick={close}
              aria-label="Tutup foto"
              className="btn-brutal absolute -right-2 -top-5 bg-coral p-2 text-cream"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Foto sebelumnya"
              className="btn-brutal absolute -left-2 top-1/2 -translate-y-1/2 bg-lemon p-2"
            >
              <ChevronLeft aria-hidden="true" className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Foto selanjutnya"
              className="btn-brutal absolute -right-2 top-1/2 -translate-y-1/2 bg-lemon p-2"
            >
              <ChevronRight aria-hidden="true" className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
