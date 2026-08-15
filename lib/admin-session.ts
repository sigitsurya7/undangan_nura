"use client";

const KEY = "admin-passcode-session";

/** Passcode tersimpan di sessionStorage setelah PasscodeGate berhasil dibuka. */
export function getStoredPasscode(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(KEY);
}

export function setStoredPasscode(value: string): void {
  sessionStorage.setItem(KEY, value);
}

/**
 * fetch() yang otomatis menyertakan header passcode admin.
 * Dipakai untuk semua request yang mengubah data di halaman
 * /kirim_undangan dan /undangan_setting.
 */
export function adminFetch(input: string, init: RequestInit = {}): Promise<Response> {
  const passcode = getStoredPasscode() ?? "";
  return fetch(input, {
    ...init,
    headers: { ...init.headers, "x-admin-passcode": passcode },
  });
}
