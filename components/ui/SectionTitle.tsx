import Reveal from "./Reveal";

interface SectionTitleProps {
  sticker: string;
  stickerColor?: string;
  title: string;
  align?: "left" | "center";
}

/** Editorial section header: small sticker label + oversized display title. */
export default function SectionTitle({
  sticker,
  stickerColor = "bg-lemon",
  title,
  align = "center",
}: SectionTitleProps) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start text-left";

  return (
    <Reveal className={`flex flex-col gap-4 ${alignCls}`}>
      <span className={`sticker ${stickerColor} -rotate-2 text-sm sm:text-base`}>
        {sticker}
      </span>
      <h2 className="font-display text-4xl leading-[0.95] sm:text-5xl lg:text-6xl uppercase">
        {title}
      </h2>
    </Reveal>
  );
}
