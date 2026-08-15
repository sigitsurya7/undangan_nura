/**
 * ============================================================
 *  WEDDING CONTENT — dua bagian:
 *
 *  1. `siteConfig`  — infrastruktur, TIDAK diedit dari website
 *     (domain, passcode admin). Ubah langsung di file ini.
 *
 *  2. `defaultSettings` — konten yang TAMPIL di undangan dan BISA
 *     diedit langsung dari /undangan_setting (tersimpan di storage,
 *     lihat lib/wedding-settings.ts). Nilai di sini hanya dipakai
 *     sebagai fallback sebelum pengantin menyimpan pengaturan apa pun.
 * ============================================================
 */

export interface Person {
  name: string;
  fullName: string;
  parents: { father: string; mother: string };
  /** URL foto (hasil upload), atau null untuk placeholder */
  photo: string | null;
}

export interface StoryChapter {
  year: string;
  title: string;
  text: string;
}

export interface GalleryPhoto {
  /** URL foto (hasil upload), atau null untuk placeholder dummy */
  src: string | null;
  alt: string;
}

export interface BankAccount {
  bank: string;
  number: string;
  holder: string;
  /** URL gambar QRIS (hasil upload), atau null untuk placeholder */
  qr: string | null;
}

export interface Wish {
  name: string;
  message: string;
}

export interface EditableSettings {
  couple: { bride: Person; groom: Person };
  verse: { arabic: string; translation: string; source: string };
  story: StoryChapter[];
  event: {
    /** ISO datetime dengan offset, mis. "2026-09-05T08:00:00+07:00" */
    dateTime: string;
    timeEnd: string;
    venue: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  /** Kosong = tampilkan dummy placeholder (lihat DUMMY_GALLERY) */
  gallery: GalleryPhoto[];
  rsvp: { enabled: boolean };
  wishes: { enabled: boolean };
  gift: { enabled: boolean; accounts: BankAccount[] };
  giftAddress: {
    enabled: boolean;
    recipient: string;
    address: string;
    phone: string;
  };
  streaming: { enabled: boolean; url: string };
  dressCode: { enabled: boolean; text: string; colors: string[] };
  music: { enabled: boolean; url: string };
}

/** Infrastruktur — tidak diedit dari UI. */
export const siteConfig = {
  siteUrl: "https://undangan-nura.vercel.app",
  ogImage: "/images/og-image.jpg",
  admin: {
    /** Passcode /kirim_undangan & /undangan_setting */
    passcode: "n5926d",
    /** Salah berturut-turut sebanyak ini → diarahkan ke halaman awal */
    maxAttempts: 3,
  },
};

/** Placeholder galeri saat pengantin belum mengunggah foto apa pun. */
export const DUMMY_GALLERY: GalleryPhoto[] = [
  { src: null, alt: "[PHOTO 01]" },
  { src: null, alt: "[PHOTO 02]" },
  { src: null, alt: "[PHOTO 03]" },
  { src: null, alt: "[PHOTO 04]" },
  { src: null, alt: "[PHOTO 05]" },
  { src: null, alt: "[PHOTO 06]" },
];

export const defaultSettings: EditableSettings = {
  couple: {
    bride: {
      name: "Nura",
      fullName: "Nura",
      parents: { father: "[Nama Ayah]", mother: "[Nama Ibu]" },
      photo: null,
    },
    groom: {
      name: "Dika",
      fullName: "Dika",
      parents: { father: "[Nama Ayah]", mother: "[Nama Ibu]" },
      photo: null,
    },
  },

  verse: {
    arabic:
      "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا",
    translation:
      "“Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri...”",
    source: "QS. Ar-Rum: 21",
  },

  story: [
    {
      year: "[TAHUN]",
      title: "First Meet",
      text: "[Isi cerita — bagaimana kami pertama kali bertemu.]",
    },
    {
      year: "[TAHUN]",
      title: "The Beginning",
      text: "[Isi cerita — awal perjalanan kami bersama.]",
    },
    {
      year: "[TAHUN]",
      title: "The Proposal",
      text: "[Isi cerita — momen lamaran yang tak terlupakan.]",
    },
    {
      year: "2026",
      title: "The Wedding",
      text: "Finally, here we are.",
    },
  ],

  event: {
    dateTime: "2026-09-05T08:00:00+07:00",
    timeEnd: "s/d Selesai",
    venue: "Kp. Lempong Tengah RT 02 RW 05",
    address: "Desa Karang Anyar, Kabupaten Garut, Jawa Barat",
    coordinates: { lat: -6.910056, lng: 107.611139 },
  },

  gallery: [],

  rsvp: { enabled: true },
  wishes: { enabled: true },

  gift: {
    enabled: true,
    accounts: [
      { bank: "BCA", number: "[Nomor Rekening]", holder: "a.n. [Nama]", qr: null },
    ],
  },

  giftAddress: {
    enabled: true,
    recipient: "[Nama Penerima]",
    address: "[Alamat Lengkap]",
    phone: "[Nomor Telepon]",
  },

  streaming: { enabled: false, url: "" },
  dressCode: { enabled: false, text: "", colors: [] },
  music: { enabled: false, url: "" },
};
