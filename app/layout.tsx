import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/wedding";
import { getEffectiveSettings } from "@/lib/wedding-settings";

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

export async function generateMetadata(): Promise<Metadata> {
  const { couple } = await getEffectiveSettings();
  const title = `${couple.bride.name} & ${couple.groom.name} — Wedding Invitation`;
  const description = `Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir di hari pernikahan ${couple.bride.name} & ${couple.groom.name}.`;

  return {
    metadataBase: new URL(siteConfig.siteUrl),
    title,
    description,
    openGraph: {
      title,
      description,
      images: [siteConfig.ogImage],
      type: "website",
    },
  };
}

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
