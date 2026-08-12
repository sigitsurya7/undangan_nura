import type { Wish } from "@/config/wedding";

/** Bentuk data yang tersimpan di storage. */

export interface StoredWish extends Wish {
  createdAt: string;
}

export interface StoredRsvp {
  name: string;
  attendance: "hadir" | "tidak";
  guestCount: number;
  createdAt: string;
}
