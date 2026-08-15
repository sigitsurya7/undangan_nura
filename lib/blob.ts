import { promises as fs } from "fs";
import path from "path";
import { findEnvByPattern } from "@/lib/storage";

/**
 * Upload foto sederhana untuk halaman /undangan_setting.
 *
 * Production (Vercel): Vercel Blob dari tab Storage (free/Hobby tier).
 *   Env BLOB_READ_WRITE_TOKEN biasanya terisi otomatis setelah di-connect,
 *   tapi kalau store diberi nama/awalan (mis. "MYPROJECT_BLOB_READ_WRITE_TOKEN")
 *   Vercel memakai nama itu apa adanya — jadi kita cari juga secara pola nama.
 *
 * Development tanpa Blob: fallback ke public/uploads/ (di-gitignore),
 * disajikan langsung oleh dev server Next.js.
 */

function getBlobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN ?? findEnvByPattern("_BLOB_READ_WRITE_TOKEN");
}

function safeFileName(originalName: string): string {
  const ext = originalName.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  return `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
}

export async function uploadImage(file: File): Promise<string> {
  const token = getBlobToken();
  const filename = safeFileName(file.name);

  if (token) {
    const { put } = await import("@vercel/blob");
    const blob = await put(filename, file, { access: "public", token });
    return blob.url;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "Upload foto belum dikonfigurasi. Tambahkan Vercel Blob dari tab Storage (lihat .env.example).",
    );
  }

  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(dir, filename), buffer);
  return `/uploads/${filename}`;
}

/** Hapus foto (best-effort — kegagalan tidak melempar error). */
export async function deleteImage(url: string): Promise<void> {
  const token = getBlobToken();

  if (token && url.startsWith("http")) {
    try {
      const { del } = await import("@vercel/blob");
      await del(url, { token });
    } catch {
      /* biarkan — hapus dari daftar tetap boleh lanjut */
    }
    return;
  }

  if (url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", url);
    await fs.unlink(filePath).catch(() => {});
  }
}
