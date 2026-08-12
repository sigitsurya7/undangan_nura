import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { weddingConfig } from "@/config/wedding";

const archivo = Archivo_Black({
  weight: "400",
  variable: "--font-archivo",
  subsets: ["latin"],
});

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const { bride, groom } = weddingConfig.couple;

export const metadata: Metadata = {
  metadataBase: new URL(weddingConfig.meta.siteUrl),
  title: `${bride.name} & ${groom.name} — Wedding Invitation`,
  description:
    "Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir di hari pernikahan Nura & Dika.",
  openGraph: {
    title: `${bride.name} & ${groom.name} — Wedding Invitation`,
    description:
      "Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir di hari pernikahan Nura & Dika.",
    images: [weddingConfig.meta.ogImage],
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${archivo.variable} ${grotesk.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
