/* eslint-disable @next/next/no-img-element */

interface PhotoPlaceholderProps {
  src: string | null;
  label: string;
  alt: string;
  className?: string;
  /** Background accent for the placeholder state */
  tone?: string;
}

/**
 * Renders the real photo when `src` is provided, otherwise a bold
 * neo-brutalist placeholder tile with the label text.
 */
export default function PhotoPlaceholder({
  src,
  label,
  alt,
  className = "",
  tone = "bg-periwinkle",
}: PhotoPlaceholderProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex h-full w-full items-center justify-center ${tone} ${className}`}
    >
      <span className="font-heading font-bold uppercase tracking-widest text-ink/80 text-sm sm:text-base [text-shadow:1px_1px_0_rgba(255,255,255,0.5)]">
        {label}
      </span>
    </div>
  );
}
