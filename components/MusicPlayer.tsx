"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { Music, Pause } from "lucide-react";
import type { EditableSettings } from "@/config/wedding";

export interface MusicPlayerHandle {
  /** Mulai memutar musik (dipanggil setelah user menekan "Buka Undangan"). */
  play: () => void;
}

interface MusicPlayerProps {
  settings: EditableSettings;
  /** Tombol hanya tampil setelah undangan dibuka */
  visible: boolean;
}

/**
 * Floating music player. Hidden ketika music.enabled false / URL kosong.
 * Tidak pernah autoplay — parent memanggil play() setelah user interaction.
 */
const MusicPlayer = forwardRef<MusicPlayerHandle, MusicPlayerProps>(
  function MusicPlayer({ settings, visible }, ref) {
  const { music } = settings;
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  useImperativeHandle(ref, () => ({
    play: () => {
      audioRef.current?.play().catch(() => {
        /* browser menolak play — biarkan user memakai tombol */
      });
    },
  }));

  if (!music.enabled || !music.url) return null;

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={music.url}
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      {visible && (
        <>
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Jeda musik" : "Putar musik"}
            className="btn-brutal fixed bottom-20 right-4 z-40 h-12 w-12 rounded-full bg-bubblegum p-0 sm:bottom-6 sm:right-6"
          >
            {playing ? (
              <Pause aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Music aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
          <span className="sr-only" aria-live="polite">
            {playing ? "PLAYING" : "PAUSED"}
          </span>
        </>
      )}
    </>
  );
  },
);

export default MusicPlayer;
