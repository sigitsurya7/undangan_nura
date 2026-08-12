import type { Metadata } from "next";
import KirimUndangan from "@/components/KirimUndangan";
import PasscodeGate from "@/components/PasscodeGate";

export const metadata: Metadata = {
  title: "Kirim Undangan — Nura & Dika",
  // Halaman internal pengantin — jangan diindeks mesin pencari
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PasscodeGate>
      <KirimUndangan />
    </PasscodeGate>
  );
}
