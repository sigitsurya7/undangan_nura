"use client";

import { useState } from "react";
import { Copy, Check, QrCode } from "lucide-react";
import type { EditableSettings } from "@/config/wedding";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";

interface GiftProps {
  settings: EditableSettings;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** SEND YOUR LOVE — bank accounts + QRIS with copy-to-clipboard. */
export default function Gift({ settings }: GiftProps) {
  const { gift } = settings;
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!gift.enabled || gift.accounts.length === 0) return null;

  const onCopy = async (text: string, index: number) => {
    if (await copyText(text)) {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto max-w-xl">
        <SectionTitle
          sticker="With love"
          stickerColor="bg-bubblegum"
          title="Send Your Love"
        />

        <Reveal className="mx-auto mt-6 max-w-md text-center text-sm text-ink/75 sm:text-base">
          <p>
            Doa restu Anda adalah hadiah terbaik. Namun jika ingin memberi tanda
            kasih, kami sediakan cara berikut.
          </p>
        </Reveal>

        <div className="mt-10 flex flex-col gap-8 sm:mt-12">
          {gift.accounts.map((account, i) => (
            <Reveal key={`${account.bank}-${i}`} delay={i * 100}>
              <div className={`card-brutal overflow-hidden ${i % 2 === 0 ? "sm:-rotate-1" : "sm:rotate-1"}`}>
                {/* Card header seperti kartu bank */}
                <div className="flex items-center justify-between border-b-[3px] border-ink bg-teal px-6 py-4">
                  <span className="font-display text-xl uppercase text-cream sm:text-2xl">
                    {account.bank}
                  </span>
                  <span className="sticker bg-lemon rotate-2 text-[10px]">
                    E-Gift
                  </span>
                </div>

                <div className="px-6 py-6 text-center">
                  <p className="font-display text-xl tracking-wider sm:text-2xl">
                    {account.number}
                  </p>
                  <p className="mt-1 text-sm text-ink/75">{account.holder}</p>

                  <button
                    type="button"
                    onClick={() => onCopy(account.number, i)}
                    className={`btn-brutal mt-5 px-6 py-3 text-sm uppercase ${
                      copiedIndex === i ? "bg-teal text-cream" : "bg-lemon"
                    }`}
                  >
                    {copiedIndex === i ? (
                      <>
                        Copied! <Check aria-hidden="true" className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Salin Nomor Rekening
                        <Copy aria-hidden="true" className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                {/* QR area */}
                <div className="flex flex-col items-center gap-3 border-t-[3px] border-ink bg-cream px-6 py-6">
                  {account.qr ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={account.qr}
                      alt={`QRIS ${account.bank} ${account.holder}`}
                      loading="lazy"
                      className="h-40 w-40 border-[3px] border-ink object-contain shadow-[4px_4px_0_0_#141414]"
                    />
                  ) : (
                    <div
                      role="img"
                      aria-label="Placeholder QRIS / QR code"
                      className="flex h-40 w-40 flex-col items-center justify-center gap-2 border-[3px] border-ink bg-paper shadow-[4px_4px_0_0_#141414]"
                    >
                      <QrCode aria-hidden="true" className="h-10 w-10" />
                      <span className="font-heading text-xs font-bold uppercase tracking-widest">
                        [QRIS / QR Code]
                      </span>
                    </div>
                  )}
                  <p className="font-heading text-xs font-bold uppercase tracking-widest text-ink/60">
                    Scan untuk kirim hadiah
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
