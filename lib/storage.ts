import { Redis } from "@upstash/redis";
import { promises as fs } from "fs";
import path from "path";

/**
 * Storage sederhana berbasis list untuk wishes / RSVP / undangan.
 *
 * Production (Vercel): Upstash Redis dari Vercel Marketplace (free tier).
 *   Integrasinya otomatis mengisi env KV_REST_API_URL + KV_REST_API_TOKEN
 *   (atau UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN).
 *
 * Development tanpa Redis: fallback ke file JSON di .data/ (di-gitignore).
 */

export type StoreKey = "wishes" | "rsvps" | "invitations" | "media";

const MAX_ITEMS = 500;

function getRedis(): Redis | null {
  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const DATA_DIR = path.join(process.cwd(), ".data");

async function fileRead<T>(key: StoreKey): Promise<T[]> {
  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${key}.json`), "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

async function fileWrite<T>(key: StoreKey, items: T[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, `${key}.json`),
    JSON.stringify(items, null, 2),
    "utf8",
  );
}

/** Ambil semua item (terbaru dulu), maksimal `limit`. */
export async function listItems<T>(key: StoreKey, limit = 100): Promise<T[]> {
  const redis = getRedis();
  if (redis) {
    // SDK otomatis (de)serialisasi JSON; LPUSH = terbaru di depan
    return await redis.lrange<T>(key, 0, limit - 1);
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Storage belum dikonfigurasi. Tambahkan Upstash Redis dari Vercel Marketplace (lihat .env.example).",
    );
  }

  const items = await fileRead<T>(key);
  return items.slice(0, limit);
}

/** Simpan item baru di posisi terdepan. */
export async function pushItem<T>(key: StoreKey, item: T): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.lpush(key, item);
    await redis.ltrim(key, 0, MAX_ITEMS - 1);
    return;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Storage belum dikonfigurasi. Tambahkan Upstash Redis dari Vercel Marketplace (lihat .env.example).",
    );
  }

  const items = await fileRead<T>(key);
  items.unshift(item);
  await fileWrite(key, items.slice(0, MAX_ITEMS));
}

/** Ganti seluruh isi list (dipakai untuk edit/hapus item). */
export async function replaceItems<T>(key: StoreKey, items: T[]): Promise<void> {
  const redis = getRedis();
  if (redis) {
    const tx = redis.multi();
    tx.del(key);
    if (items.length > 0) {
      // List disimpan terbaru-dulu; rpush mempertahankan urutan array
      tx.rpush(key, ...(items as unknown[]));
    }
    await tx.exec();
    return;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Storage belum dikonfigurasi. Tambahkan Upstash Redis dari Vercel Marketplace (lihat .env.example).",
    );
  }

  await fileWrite(key, items.slice(0, MAX_ITEMS));
}

/** Ambil satu objek JSON tersimpan (bukan list), atau null bila belum ada. */
export async function getValue<T>(key: string): Promise<T | null> {
  const redis = getRedis();
  if (redis) {
    return await redis.get<T>(key);
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Storage belum dikonfigurasi. Tambahkan Upstash Redis dari Vercel Marketplace (lihat .env.example).",
    );
  }

  try {
    const raw = await fs.readFile(path.join(DATA_DIR, `${key}.json`), "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/** Simpan satu objek JSON (menimpa nilai sebelumnya). */
export async function setValue<T>(key: string, value: T): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.set(key, value);
    return;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Storage belum dikonfigurasi. Tambahkan Upstash Redis dari Vercel Marketplace (lihat .env.example).",
    );
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    path.join(DATA_DIR, `${key}.json`),
    JSON.stringify(value, null, 2),
    "utf8",
  );
}

/** Bersihkan string input user: trim + batasi panjang. */
export function cleanText(value: unknown, maxLen: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLen);
}

/** Bersihkan URL input user; kosong/invalid → string kosong. */
export function cleanUrl(value: unknown, maxLen = 500): string {
  const text = cleanText(value, maxLen);
  if (!text) return "";
  try {
    new URL(text);
    return text;
  } catch {
    return "";
  }
}
