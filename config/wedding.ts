/**
 * ============================================================
 *  WEDDING CONFIG — satu-satunya tempat mengedit konten undangan.
 *  Ganti nilai di sini; UI akan menyesuaikan secara otomatis.
 *  Section opsional (streaming, dressCode, music, giftAddress)
 *  otomatis disembunyikan saat `enabled: false` / data kosong.
 * ============================================================
 */

export interface Person {
  name: string;
  fullName: string;
  parents: { father: string; mother: string };
  /** Path foto di /public, atau null untuk placeholder */
  photo: string | null;
}

export interface StoryChapter {
  year: string;
  title: string;
  text: string;
}

export interface GalleryPhoto {
  /** Path foto di /public, atau null untuk placeholder */
  src: string | null;
  alt: string;
}

export interface BankAccount {
  bank: string;
  number: string;
  holder: string;
  /** Path gambar QRIS di /public, atau null untuk placeholder */
  qr: string | null;
}

export interface Wish {
  name: string;
  message: string;
}

export const weddingConfig = {
  meta: {
    /** Ganti dengan domain undangan setelah deploy */
    siteUrl: "https://nura-dika.example.com",
    ogImage: "/images/og-image.jpg",
  },

  couple: {
    bride: {
      name: "Nura",
      fullName: "Nura",
      parents: { father: "[Nama Ayah]", mother: "[Nama Ibu]" },
      photo: null,
    } satisfies Person,

    groom: {
      name: "Dika",
      fullName: "Dika",
      parents: { father: "[Nama Ayah]", mother: "[Nama Ibu]" },
      photo: null,
    } satisfies Person,
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
  ] satisfies StoryChapter[],

  event: {
    /** Dipakai countdown — waktu lokal WIB */
    dateTime: "2026-09-05T08:00:00+07:00",
    dateLabel: { day: "SABTU", date: "05 SEPTEMBER", year: "2026" },
    dateShort: "05 • 09 • 2026",
    fullDateText: "Sabtu, 5 September 2026",
    time: "08:00 WIB",
    timeEnd: "s/d Selesai",
    venue: "Kp. Lempong Tengah RT 02 RW 05",
    address: "Desa Karang Anyar, Kabupaten Garut, Jawa Barat",
    coordinates: { lat: -6.910056, lng: 107.611139 },
    mapsUrl:
      "https://www.google.com/maps?ll=-6.910056,107.611139&z=14&t=m&hl=id&gl=ID&mapclient=embed",
  },

  gallery: [
    { src: null, alt: "[PHOTO 01]" },
    { src: null, alt: "[PHOTO 02]" },
    { src: null, alt: "[PHOTO 03]" },
    { src: null, alt: "[PHOTO 04]" },
    { src: null, alt: "[PHOTO 05]" },
    { src: null, alt: "[PHOTO 06]" },
  ] satisfies GalleryPhoto[],

  rsvp: {
    enabled: true,
  },

  wishes: {
    enabled: true,
    /** Dummy wishes — akan tampil sebelum ada data nyata */
    seed: [
      {
        name: "Guest Name",
        message:
          "[Dummy wedding wish — doa dan harapan terbaik untuk kedua mempelai.]",
      },
      {
        name: "Guest Name",
        message: "[Dummy wedding wish — selamat menempuh hidup baru!]",
      },
      {
        name: "Guest Name",
        message:
          "[Dummy wedding wish — semoga menjadi keluarga yang sakinah, mawaddah, warahmah.]",
      },
    ] satisfies Wish[],
  },

  gift: {
    enabled: true,
    accounts: [
      {
        bank: "BCA",
        number: "[Nomor Rekening]",
        holder: "a.n. [Nama]",
        qr: null,
      },
    ] satisfies BankAccount[],
  },

  giftAddress: {
    enabled: true,
    recipient: "[Nama Penerima]",
    address: "[Alamat Lengkap]",
    phone: "[Nomor Telepon]",
  },

  streaming: {
    enabled: false,
    url: "",
  },

  dressCode: {
    enabled: false,
    text: "",
    /** Palet warna dress code (hex) — tampil sebagai swatch */
    colors: [] as string[],
  },

  music: {
    enabled: false,
    url: "",
  },
};

export type WeddingConfig = typeof weddingConfig;
