const TIME_ZONE = "Asia/Jakarta";

function capitalize(word: string): string {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

export interface EventDisplay {
  /** "SABTU" */
  day: string;
  /** "05 SEPTEMBER" */
  date: string;
  /** "2026" */
  year: string;
  /** "08:00 WIB" */
  time: string;
  /** "05 • 09 • 2026" */
  dateShort: string;
  /** "Sabtu, 5 September 2026" */
  fullDateText: string;
  /** "05.09.26" — dipakai untuk sticker/marquee dekoratif */
  dateSticker: string;
}

/** Format tunggal-sumber untuk semua tampilan tanggal/waktu acara (selalu WIB). */
export function formatEventDisplay(iso: string): EventDisplay {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return {
      day: "—",
      date: "—",
      year: "—",
      time: "—",
      dateShort: "—",
      fullDateText: "Tanggal belum diatur",
      dateSticker: "—",
    };
  }

  const dayName = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    timeZone: TIME_ZONE,
  }).format(date);
  const dayNum = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    timeZone: TIME_ZONE,
  }).format(date);
  const dayNumShort = new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    timeZone: TIME_ZONE,
  }).format(date);
  const monthNum = new Intl.DateTimeFormat("id-ID", {
    month: "2-digit",
    timeZone: TIME_ZONE,
  }).format(date);
  const monthName = new Intl.DateTimeFormat("id-ID", {
    month: "long",
    timeZone: TIME_ZONE,
  }).format(date);
  const year = new Intl.DateTimeFormat("id-ID", {
    year: "numeric",
    timeZone: TIME_ZONE,
  }).format(date);
  const yearShort = year.slice(-2);
  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: TIME_ZONE,
  }).format(date);

  return {
    day: dayName.toUpperCase(),
    date: `${dayNum} ${monthName.toUpperCase()}`,
    year,
    time: `${time} WIB`,
    dateShort: `${dayNum} • ${monthNum} • ${year}`,
    fullDateText: `${capitalize(dayName)}, ${dayNumShort} ${capitalize(monthName)} ${year}`,
    dateSticker: `${dayNum}.${monthNum}.${yearShort}`,
  };
}

/** Link "buka di Google Maps" — tanpa API key. */
export function buildMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?ll=${lat},${lng}&z=14&t=m&hl=id&gl=ID&mapclient=embed`;
}

/** Src untuk <iframe> embed peta — tanpa API key. */
export function buildMapsEmbedUrl(lat: number, lng: number): string {
  return `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
}
