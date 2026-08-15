import { siteConfig } from "@/config/wedding";

export interface StoredInvitation {
  /** Opsional untuk data lama; item baru selalu punya id */
  id?: string;
  name: string;
  link: string;
  createdAt: string;
}

/** Identifier stabil — data lama tanpa id memakai createdAt. */
export function invitationId(inv: StoredInvitation): string {
  return inv.id ?? inv.createdAt;
}

/** Bentuk link undangan personal: <siteUrl>/?to=<nama> */
export function buildInvitationLink(name: string): string {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  return `${base}/?to=${encodeURIComponent(name)}`;
}
