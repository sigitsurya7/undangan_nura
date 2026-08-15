"use client";

import { useState } from "react";
import { Check, Copy, Package } from "lucide-react";
import type { EditableSettings } from "@/config/wedding";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";

interface GiftAddressProps {
  settings: EditableSettings;
}

/** SEND A GIFT — physical gift address with copy-to-clipboard. */
export default function GiftAddress({ settings }: GiftAddressProps) {
  const { giftAddress } = settings;
  const [copied, setCopied] = useState(false);

  if (!giftAddress.enabled) return null;

  const fullAddress = `${giftAddress.recipient}\n${giftAddress.address}\n${giftAddress.phone}`;

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard tidak tersedia — abaikan */
    }
  };

  return (
    <section className="px-6 pb-16 sm:pb-24">
      <div className="mx-auto max-w-xl">
        <SectionTitle
          sticker="Kado fisik"
          stickerColor="bg-periwinkle"
          title="Send a Gift"
        />

        <Reveal className="mt-10 sm:mt-12">
          <div className="card-brutal px-6 py-8 text-center sm:rotate-1 sm:px-10">
            <span className="mx-auto flex h-12 w-12 items-center justify-center border-[3px] border-ink bg-bubblegum shadow-[4px_4px_0_0_#141414]">
              <Package aria-hidden="true" className="h-6 w-6" />
            </span>

            <p className="mt-5 font-heading text-lg font-bold">
              {giftAddress.recipient}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-ink/75 sm:text-base">
              {giftAddress.address}
            </p>
            <p className="mt-2 font-heading text-sm font-bold">
              {giftAddress.phone}
            </p>

            <button
              type="button"
              onClick={onCopy}
              className={`btn-brutal mt-6 px-6 py-3 text-sm uppercase ${
                copied ? "bg-teal text-cream" : "bg-lemon"
              }`}
            >
              {copied ? (
                <>
                  Copied! <Check aria-hidden="true" className="h-4 w-4" />
                </>
              ) : (
                <>
                  Salin Alamat <Copy aria-hidden="true" className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
