"use client";

import { useEffect, useRef, useState } from "react";
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

/** Root client shell: cover overlay → open → music + scroll to content. */
export default function Invitation() {
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
      <Cover opened={opened} onOpen={handleOpen} />

      <Hero />
      <Verse />
      <Couple />
      <Story />
      <EventDetails />
      <Venue />
      <Countdown />
      <Gallery />
      <Rsvp />
      <Wishes />
      <Gift />
      <GiftAddress />
      <Streaming />
      <DressCode />
      <Closing />

      {opened && <FloatingNav />}
      <MusicPlayer ref={musicRef} visible={opened} />
    </main>
  );
}
