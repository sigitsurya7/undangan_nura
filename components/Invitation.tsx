"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import type { EditableSettings } from "@/config/wedding";
import Cover from "@/components/sections/Cover";
import Hero from "@/components/sections/Hero";
import Verse from "@/components/sections/Verse";
import Couple from "@/components/sections/Couple";
import Story from "@/components/sections/Story";
import EventDetails from "@/components/sections/EventDetails";
import Venue from "@/components/sections/Venue";
import Countdown from "@/components/sections/Countdown";
import Gallery from "@/components/sections/Gallery";
import Rsvp from "@/components/sections/Rsvp";
import Wishes from "@/components/sections/Wishes";
import Gift from "@/components/sections/Gift";
import GiftAddress from "@/components/sections/GiftAddress";
import Streaming from "@/components/sections/Streaming";
import DressCode from "@/components/sections/DressCode";
import Closing from "@/components/sections/Closing";
import FloatingNav from "@/components/FloatingNav";
import MusicPlayer, { type MusicPlayerHandle } from "@/components/MusicPlayer";

interface InvitationProps {
  settings: EditableSettings;
}

/** Root client shell: cover overlay → open → music + scroll to content. */
export default function Invitation({ settings }: InvitationProps) {
  const [opened, setOpened] = useState(false);
  const musicRef = useRef<MusicPlayerHandle>(null);

  // Kunci scroll selama cover masih tertutup
  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  const handleOpen = () => {
    setOpened(true);
    musicRef.current?.play();
    requestAnimationFrame(() => {
      document.getElementById("home")?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <main className="relative min-h-screen">
      {/* Suspense wajib: Cover membaca ?to= via useSearchParams */}
      <Suspense fallback={null}>
        <Cover settings={settings} opened={opened} onOpen={handleOpen} />
      </Suspense>

      <Hero settings={settings} />
      <Verse settings={settings} />
      <Couple settings={settings} />
      <Story settings={settings} />
      <EventDetails settings={settings} />
      <Venue settings={settings} />
      <Countdown settings={settings} />
      <Gallery settings={settings} />
      <Rsvp settings={settings} />
      <Wishes settings={settings} />
      <Gift settings={settings} />
      <GiftAddress settings={settings} />
      <Streaming settings={settings} />
      <DressCode settings={settings} />
      <Closing settings={settings} />

      {opened && <FloatingNav />}
      <MusicPlayer ref={musicRef} settings={settings} visible={opened} />
    </main>
  );
}
