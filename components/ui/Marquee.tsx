interface MarqueeProps {
  items: string[];
  className?: string;
}

/** Infinite horizontal marquee strip with repeated sticker-like items. */
export default function Marquee({ items, className = "" }: MarqueeProps) {
  const row = [...items, ...items, ...items];

  return (
    <div
      aria-hidden="true"
      className={`overflow-hidden border-y-[3px] border-ink py-3 ${className}`}
    >
      <div className="flex w-max animate-marquee gap-8 pr-8">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 gap-8">
            {row.map((item, i) => (
              <span
                key={`${half}-${i}`}
                className="font-heading text-lg font-bold uppercase tracking-widest whitespace-nowrap"
              >
                {item} <span className="mx-2">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
