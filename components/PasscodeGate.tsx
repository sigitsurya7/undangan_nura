"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { KeyRound } from "lucide-react";
import { weddingConfig } from "@/config/wedding";

const STORAGE_KEY = "kirim-undangan-unlocked";

interface PasscodeGateProps {
  children: ReactNode;
}

/**
 * Gerbang passcode bergaya PIN modal untuk halaman internal.
 * Salah `maxAttempts` kali berturut-turut → diarahkan ke halaman awal.
 * Status buka disimpan di sessionStorage agar refresh tidak menanyakan ulang.
 */
export default function PasscodeGate({ children }: PasscodeGateProps) {
  const { passcode, maxAttempts } = weddingConfig.admin;
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const [unlocked, setUnlocked] = useState(false);
  const [value, setValue] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [shake, setShake] = useState(false);

  // Cek sessionStorage setelah mount (async agar aman untuk hydration & lint)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") setUnlocked(true);
      else inputRef.current?.focus();
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  if (unlocked) return <>{children}</>;

  const length = passcode.length;

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const next = e.target.value.replace(/[^a-zA-Z0-9]/g, "").slice(0, length);
    setValue(next);

    if (next.length !== length) return;

    if (next.toLowerCase() === passcode.toLowerCase()) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
      return;
    }

    const failed = attempts + 1;
    if (failed >= maxAttempts) {
      router.push("/");
      return;
    }
    setAttempts(failed);
    setValue("");
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-cream px-6">
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Masukkan passcode"
        className={`card-brutal w-full max-w-sm px-6 py-10 text-center sm:px-10 ${
          shake ? "animate-shake" : ""
        }`}
      >
        <span className="mx-auto flex h-14 w-14 items-center justify-center border-[3px] border-ink bg-lemon shadow-[4px_4px_0_0_#141414]">
          <KeyRound aria-hidden="true" className="h-7 w-7" />
        </span>

        <h1 className="mt-6 font-display text-2xl uppercase sm:text-3xl">
          Halaman Pengantin
        </h1>
        <p className="mt-2 text-sm text-ink/70">
          Masukkan passcode untuk melanjutkan.
        </p>

        {/* Kotak PIN — klik memfokuskan input tersembunyi di bawah */}
        <label className="mt-8 block cursor-text">
          <span className="sr-only">Passcode</span>
          <span className="flex justify-center gap-2" aria-hidden="true">
            {Array.from({ length }).map((_, i) => (
              <span
                key={i}
                className={`flex h-12 w-10 items-center justify-center border-[3px] border-ink font-display text-xl shadow-[3px_3px_0_0_#141414] ${
                  i < value.length
                    ? "bg-bubblegum"
                    : i === value.length
                      ? "bg-lemon"
                      : "bg-paper"
                }`}
              >
                {i < value.length ? "•" : ""}
              </span>
            ))}
          </span>
          <input
            ref={inputRef}
            type="password"
            autoComplete="off"
            inputMode="text"
            value={value}
            onChange={onChange}
            className="sr-only"
          />
        </label>

        <p
          role="status"
          className={`mt-5 min-h-5 text-sm font-bold ${
            attempts > 0 ? "text-coral" : "text-transparent"
          }`}
        >
          {attempts > 0
            ? `Passcode salah. Sisa percobaan: ${maxAttempts - attempts}`
            : " "}
        </p>
      </div>
    </div>
  );
}
