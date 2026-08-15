import type { Metadata } from "next";
import UndanganSettings from "@/components/UndanganSettings";
import PasscodeGate from "@/components/PasscodeGate";

export const metadata: Metadata = {
  title: "Pengaturan Undangan — Nura & Dika",
  // Halaman internal pengantin — jangan diindeks mesin pencari
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <PasscodeGate>
      <UndanganSettings />
    </PasscodeGate>
  );
}
