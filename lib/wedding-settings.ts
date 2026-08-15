import { getValue, setValue, cleanText, cleanUrl } from "@/lib/storage";
import {
  defaultSettings,
  type EditableSettings,
  type Person,
  type StoryChapter,
  type GalleryPhoto,
  type BankAccount,
} from "@/config/wedding";

const KEY = "wedding-settings";

/** Baca pengaturan efektif: tersimpan (jika ada) di atas default. */
export async function getEffectiveSettings(): Promise<EditableSettings> {
  try {
    const stored = await getValue<Partial<EditableSettings>>(KEY);
    return stored ? { ...defaultSettings, ...stored } : defaultSettings;
  } catch {
    // Storage bermasalah — situs tetap tampil dengan konten default.
    return defaultSettings;
  }
}

export async function saveSettings(settings: EditableSettings): Promise<void> {
  await setValue(KEY, settings);
}

function num(value: unknown, fallback: number, min: number, max: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, n));
}

function bool(value: unknown): boolean {
  return value === true;
}

function nullableUrl(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  const url = cleanText(value, 500);
  return url || null;
}

function cleanPerson(value: unknown, fallback: Person): Person {
  const v = (value ?? {}) as Record<string, unknown>;
  const parents = (v.parents ?? {}) as Record<string, unknown>;
  return {
    name: cleanText(v.name, 60) || fallback.name,
    fullName: cleanText(v.fullName, 100) || fallback.fullName,
    parents: {
      father: cleanText(parents.father, 100) || fallback.parents.father,
      mother: cleanText(parents.mother, 100) || fallback.parents.mother,
    },
    photo: nullableUrl(v.photo),
  };
}

function cleanStory(value: unknown): StoryChapter[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 12).map((item) => {
    const v = (item ?? {}) as Record<string, unknown>;
    return {
      year: cleanText(v.year, 30),
      title: cleanText(v.title, 60),
      text: cleanText(v.text, 400),
    };
  });
}

function cleanGallery(value: unknown): GalleryPhoto[] {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, 12)
    .map((item) => {
      const v = (item ?? {}) as Record<string, unknown>;
      return { src: nullableUrl(v.src), alt: cleanText(v.alt, 100) || "Foto" };
    })
    .filter((p) => p.src);
}

function cleanAccounts(value: unknown): BankAccount[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 5).map((item) => {
    const v = (item ?? {}) as Record<string, unknown>;
    return {
      bank: cleanText(v.bank, 50),
      number: cleanText(v.number, 50),
      holder: cleanText(v.holder, 100),
      qr: nullableUrl(v.qr),
    };
  });
}

const HEX_COLOR = /^#[0-9a-fA-F]{3,8}$/;

function cleanColors(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .slice(0, 8)
    .map((c) => cleanText(c, 20))
    .filter((c) => HEX_COLOR.test(c));
}

export type SanitizeResult =
  | { ok: true; data: EditableSettings }
  | { ok: false; error: string };

/** Validasi + bersihkan body PUT /api/settings sebelum disimpan. */
export function sanitizeSettings(body: unknown): SanitizeResult {
  const b = (body ?? {}) as Record<string, unknown>;

  const couple = (b.couple ?? {}) as Record<string, unknown>;
  const verse = (b.verse ?? {}) as Record<string, unknown>;
  const event = (b.event ?? {}) as Record<string, unknown>;
  const coordinates = (event.coordinates ?? {}) as Record<string, unknown>;
  const rsvp = (b.rsvp ?? {}) as Record<string, unknown>;
  const wishes = (b.wishes ?? {}) as Record<string, unknown>;
  const gift = (b.gift ?? {}) as Record<string, unknown>;
  const giftAddress = (b.giftAddress ?? {}) as Record<string, unknown>;
  const streaming = (b.streaming ?? {}) as Record<string, unknown>;
  const dressCode = (b.dressCode ?? {}) as Record<string, unknown>;
  const music = (b.music ?? {}) as Record<string, unknown>;

  const dateTime = cleanText(event.dateTime, 40);
  if (!dateTime || Number.isNaN(new Date(dateTime).getTime())) {
    return { ok: false, error: "Tanggal & waktu acara tidak valid." };
  }

  const lat = num(coordinates.lat, defaultSettings.event.coordinates.lat, -90, 90);
  const lng = num(coordinates.lng, defaultSettings.event.coordinates.lng, -180, 180);

  const streamingUrl = streaming.enabled ? cleanUrl(streaming.url) : "";
  if (streaming.enabled && streaming.url && !streamingUrl) {
    return { ok: false, error: "URL live streaming tidak valid." };
  }

  const musicUrl = music.enabled ? cleanUrl(music.url) : "";
  if (music.enabled && music.url && !musicUrl) {
    return { ok: false, error: "URL musik tidak valid." };
  }

  const data: EditableSettings = {
    couple: {
      bride: cleanPerson(couple.bride, defaultSettings.couple.bride),
      groom: cleanPerson(couple.groom, defaultSettings.couple.groom),
    },
    verse: {
      arabic: cleanText(verse.arabic, 1000) || defaultSettings.verse.arabic,
      translation:
        cleanText(verse.translation, 1000) || defaultSettings.verse.translation,
      source: cleanText(verse.source, 100) || defaultSettings.verse.source,
    },
    story: cleanStory(b.story),
    event: {
      dateTime,
      timeEnd: cleanText(event.timeEnd, 50) || defaultSettings.event.timeEnd,
      venue: cleanText(event.venue, 150),
      address: cleanText(event.address, 300),
      coordinates: { lat, lng },
    },
    gallery: cleanGallery(b.gallery),
    rsvp: { enabled: bool(rsvp.enabled) },
    wishes: { enabled: bool(wishes.enabled) },
    gift: { enabled: bool(gift.enabled), accounts: cleanAccounts(gift.accounts) },
    giftAddress: {
      enabled: bool(giftAddress.enabled),
      recipient: cleanText(giftAddress.recipient, 100),
      address: cleanText(giftAddress.address, 300),
      phone: cleanText(giftAddress.phone, 30),
    },
    streaming: { enabled: bool(streaming.enabled), url: streamingUrl },
    dressCode: {
      enabled: bool(dressCode.enabled),
      text: cleanText(dressCode.text, 200),
      colors: cleanColors(dressCode.colors),
    },
    music: { enabled: bool(music.enabled), url: musicUrl },
  };

  return { ok: true, data };
}
