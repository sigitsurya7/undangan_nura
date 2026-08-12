"use client";

import { Home, CalendarDays, Images, MailCheck } from "lucide-react";

const links = [
  { href: "#home", label: "Home", Icon: Home },
  { href: "#event", label: "Event", Icon: CalendarDays },
  { href: "#gallery", label: "Gallery", Icon: Images },
  { href: "#rsvp", label: "RSVP", Icon: MailCheck },
];

/** Minimal floating bottom navigation (mobile) / sticky pill (desktop). */
export default function FloatingNav() {
  return (
    <nav
      aria-label="Navigasi undangan"
      className="fixed bottom-4 left-1/2 z-40 -translate-x-1/2"
    >
      <ul className="flex items-center gap-1 border-[3px] border-ink bg-paper px-2 py-1.5 shadow-[5px_5px_0_0_#141414]">
        {links.map(({ href, label, Icon }) => (
          <li key={href}>
            <a
              href={href}
              className="flex flex-col items-center gap-0.5 px-3 py-1 font-heading text-[10px] font-bold uppercase tracking-wider transition-colors hover:bg-lemon focus-visible:bg-lemon focus-visible:outline-none sm:flex-row sm:gap-2 sm:text-xs"
            >
              <Icon aria-hidden="true" className="h-4 w-4" />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
