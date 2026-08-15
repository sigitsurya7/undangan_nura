"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AlertTriangle, Check, Loader2, Save } from "lucide-react";
import { defaultSettings, type EditableSettings } from "@/config/wedding";
import { adminFetch } from "@/lib/admin-session";
import PhotoPicker from "@/components/settings/PhotoPicker";
import StoryEditor from "@/components/settings/StoryEditor";
import GalleryEditor from "@/components/settings/GalleryEditor";
import GiftAccountsEditor from "@/components/settings/GiftAccountsEditor";
import DressCodeColorsEditor from "@/components/settings/DressCodeColorsEditor";
import {
  Field,
  SettingsSection,
  TextArea,
  TextInput,
  ToggleField,
} from "@/components/settings/fields";

/** Set satu bagian dari settings secara immutable. */
function useSettingsState() {
  const [settings, setSettings] = useState<EditableSettings>(defaultSettings);

  function set<K extends keyof EditableSettings>(
    key: K,
    patch: Partial<EditableSettings[K]>,
  ) {
    setSettings((cur) => ({ ...cur, [key]: { ...cur[key], ...patch } }));
  }

  return { settings, setSettings, set };
}

export default function UndanganSettings() {
  const { settings, setSettings, set } = useSettingsState();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { settings?: EditableSettings } | null) => {
        if (data?.settings) setSettings(data.settings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [setSettings]);

  const onSave = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveStatus("idle");
    setSaveError(null);
    try {
      const res = await adminFetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = (await res.json().catch(() => null)) as {
        settings?: EditableSettings;
        error?: string;
      } | null;
      if (!res.ok) throw new Error(data?.error ?? "Gagal menyimpan pengaturan.");
      if (data?.settings) setSettings(data.settings);
      setSaveStatus("saved");
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (err) {
      setSaveStatus("error");
      setSaveError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="flex items-center gap-2 font-heading text-sm font-bold uppercase">
          <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
          Memuat pengaturan...
        </p>
      </main>
    );
  }

  const localDateTime = settings.event.dateTime.slice(0, 16);

  return (
    <main className="min-h-screen px-6 py-12 sm:py-16">
      <form onSubmit={onSave} className="mx-auto max-w-3xl">
        {/* Header */}
        <header className="text-center">
          <span className="sticker bg-lemon -rotate-2 text-xs sm:text-sm">
            Halaman pengantin
          </span>
          <h1 className="mt-5 font-display text-4xl uppercase leading-[0.95] sm:text-5xl">
            Pengaturan Undangan
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-ink/75 sm:text-base">
            Ubah semua konten yang tampil di undangan, lalu simpan.
          </p>
        </header>

        {/* Sticky save bar */}
        <div className="sticky top-4 z-30 mt-8 flex items-center justify-between gap-3 border-[3px] border-ink bg-paper px-4 py-3 shadow-brutal-sm">
          <span className="text-xs text-ink/60 sm:text-sm">
            {saveStatus === "saved"
              ? "Tersimpan ✦"
              : saveStatus === "error"
                ? "Gagal disimpan"
                : "Perubahan belum disimpan"}
          </span>
          <button
            type="submit"
            disabled={saving}
            className="btn-brutal bg-coral px-4 py-2 text-xs uppercase text-cream disabled:opacity-70 sm:text-sm"
          >
            {saving ? (
              <>
                <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : saveStatus === "saved" ? (
              <>
                <Check aria-hidden="true" className="h-4 w-4" />
                Tersimpan
              </>
            ) : (
              <>
                <Save aria-hidden="true" className="h-4 w-4" />
                Simpan Semua Perubahan
              </>
            )}
          </button>
        </div>

        {saveError && (
          <p
            role="alert"
            className="mt-4 flex items-center gap-2 border-[3px] border-ink bg-coral px-4 py-3 text-sm font-bold text-cream"
          >
            <AlertTriangle aria-hidden="true" className="h-4 w-4 shrink-0" />
            {saveError}
          </p>
        )}

        {/* Mempelai */}
        <SettingsSection title="Mempelai" sticker="The Couple">
          {(["bride", "groom"] as const).map((role) => (
            <div key={role} className="border-[3px] border-ink bg-paper p-4">
              <p className="font-heading text-xs font-bold uppercase tracking-widest text-ink/60">
                {role === "bride" ? "Pengantin Wanita" : "Pengantin Pria"}
              </p>
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="Nama Panggilan">
                  <TextInput
                    type="text"
                    maxLength={60}
                    value={settings.couple[role].name}
                    onChange={(e) =>
                      set("couple", {
                        [role]: { ...settings.couple[role], name: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="Nama Lengkap">
                  <TextInput
                    type="text"
                    maxLength={100}
                    value={settings.couple[role].fullName}
                    onChange={(e) =>
                      set("couple", {
                        [role]: { ...settings.couple[role], fullName: e.target.value },
                      })
                    }
                  />
                </Field>
                <Field label="Nama Ayah">
                  <TextInput
                    type="text"
                    maxLength={100}
                    value={settings.couple[role].parents.father}
                    onChange={(e) =>
                      set("couple", {
                        [role]: {
                          ...settings.couple[role],
                          parents: { ...settings.couple[role].parents, father: e.target.value },
                        },
                      })
                    }
                  />
                </Field>
                <Field label="Nama Ibu">
                  <TextInput
                    type="text"
                    maxLength={100}
                    value={settings.couple[role].parents.mother}
                    onChange={(e) =>
                      set("couple", {
                        [role]: {
                          ...settings.couple[role],
                          parents: { ...settings.couple[role].parents, mother: e.target.value },
                        },
                      })
                    }
                  />
                </Field>
              </div>
              <div className="mt-3">
                <PhotoPicker
                  label="Foto"
                  value={settings.couple[role].photo}
                  onChange={(photo) =>
                    set("couple", { [role]: { ...settings.couple[role], photo } })
                  }
                  aspect="aspect-[4/5]"
                />
              </div>
            </div>
          ))}
        </SettingsSection>

        {/* Ayat */}
        <SettingsSection title="Ayat Pembuka" sticker="QS. Ar-Rum 21">
          <Field label="Teks Arab">
            <TextArea
              rows={2}
              maxLength={1000}
              value={settings.verse.arabic}
              onChange={(e) => set("verse", { arabic: e.target.value })}
              dir="rtl"
            />
          </Field>
          <Field label="Terjemahan">
            <TextArea
              rows={3}
              maxLength={1000}
              value={settings.verse.translation}
              onChange={(e) => set("verse", { translation: e.target.value })}
            />
          </Field>
          <Field label="Sumber">
            <TextInput
              type="text"
              maxLength={100}
              value={settings.verse.source}
              onChange={(e) => set("verse", { source: e.target.value })}
            />
          </Field>
        </SettingsSection>

        {/* Kisah cinta */}
        <SettingsSection title="Kisah Cinta" sticker="Our Story">
          <StoryEditor items={settings.story} onChange={(story) => setSettings((c) => ({ ...c, story }))} />
        </SettingsSection>

        {/* Acara & lokasi */}
        <SettingsSection title="Acara & Lokasi" sticker="Save the Date">
          <Field label="Tanggal & Jam Mulai (WIB)">
            <TextInput
              type="datetime-local"
              value={localDateTime}
              onChange={(e) => set("event", { dateTime: `${e.target.value}:00+07:00` })}
            />
          </Field>
          <Field label="Keterangan Selesai">
            <TextInput
              type="text"
              maxLength={50}
              value={settings.event.timeEnd}
              onChange={(e) => set("event", { timeEnd: e.target.value })}
            />
          </Field>
          <Field label="Nama Tempat">
            <TextInput
              type="text"
              maxLength={150}
              value={settings.event.venue}
              onChange={(e) => set("event", { venue: e.target.value })}
            />
          </Field>
          <Field label="Alamat Lengkap">
            <TextArea
              rows={2}
              maxLength={300}
              value={settings.event.address}
              onChange={(e) => set("event", { address: e.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Latitude">
              <TextInput
                type="number"
                step="any"
                value={settings.event.coordinates.lat}
                onChange={(e) =>
                  set("event", {
                    coordinates: {
                      ...settings.event.coordinates,
                      lat: Number(e.target.value),
                    },
                  })
                }
              />
            </Field>
            <Field label="Longitude">
              <TextInput
                type="number"
                step="any"
                value={settings.event.coordinates.lng}
                onChange={(e) =>
                  set("event", {
                    coordinates: {
                      ...settings.event.coordinates,
                      lng: Number(e.target.value),
                    },
                  })
                }
              />
            </Field>
          </div>
          <p className="text-xs text-ink/60">
            Tips: buka lokasi di Google Maps, klik kanan titiknya, salin
            angka koordinat yang muncul (mis. -6.910056, 107.611139), lalu
            tempel ke kolom latitude &amp; longitude di atas.
          </p>
        </SettingsSection>

        {/* Galeri */}
        <SettingsSection title="Galeri — Our Moments" sticker="Photos">
          <GalleryEditor
            items={settings.gallery}
            onChange={(gallery) => setSettings((c) => ({ ...c, gallery }))}
          />
        </SettingsSection>

        {/* RSVP */}
        <SettingsSection title="RSVP" sticker="Will You Join Us?">
          <ToggleField
            label="Tampilkan section RSVP"
            checked={settings.rsvp.enabled}
            onChange={(enabled) => set("rsvp", { enabled })}
          />
        </SettingsSection>

        {/* Wishes */}
        <SettingsSection title="Ucapan & Doa" sticker="Wishes & Prayers">
          <ToggleField
            label="Tampilkan section ucapan & doa"
            checked={settings.wishes.enabled}
            onChange={(enabled) => set("wishes", { enabled })}
          />
        </SettingsSection>

        {/* Hadiah digital */}
        <SettingsSection
          title="Hadiah Digital"
          sticker="Send Your Love"
          toggle={
            <ToggleField
              label="Aktif"
              checked={settings.gift.enabled}
              onChange={(enabled) => set("gift", { enabled })}
            />
          }
        >
          <GiftAccountsEditor
            items={settings.gift.accounts}
            onChange={(accounts) => set("gift", { accounts })}
          />
        </SettingsSection>

        {/* Alamat kado */}
        <SettingsSection
          title="Alamat Kado"
          sticker="Send a Gift"
          toggle={
            <ToggleField
              label="Aktif"
              checked={settings.giftAddress.enabled}
              onChange={(enabled) => set("giftAddress", { enabled })}
            />
          }
        >
          <Field label="Nama Penerima">
            <TextInput
              type="text"
              maxLength={100}
              value={settings.giftAddress.recipient}
              onChange={(e) => set("giftAddress", { recipient: e.target.value })}
            />
          </Field>
          <Field label="Alamat Lengkap">
            <TextArea
              rows={2}
              maxLength={300}
              value={settings.giftAddress.address}
              onChange={(e) => set("giftAddress", { address: e.target.value })}
            />
          </Field>
          <Field label="Nomor Telepon">
            <TextInput
              type="text"
              maxLength={30}
              value={settings.giftAddress.phone}
              onChange={(e) => set("giftAddress", { phone: e.target.value })}
            />
          </Field>
        </SettingsSection>

        {/* Live streaming */}
        <SettingsSection
          title="Live Streaming"
          sticker="Can't Make It?"
          toggle={
            <ToggleField
              label="Aktif"
              checked={settings.streaming.enabled}
              onChange={(enabled) => set("streaming", { enabled })}
            />
          }
        >
          <Field label="URL Streaming">
            <TextInput
              type="url"
              maxLength={500}
              placeholder="https://youtube.com/..."
              value={settings.streaming.url}
              onChange={(e) => set("streaming", { url: e.target.value })}
            />
          </Field>
        </SettingsSection>

        {/* Dress code */}
        <SettingsSection
          title="Dress Code"
          sticker="What to Wear"
          toggle={
            <ToggleField
              label="Aktif"
              checked={settings.dressCode.enabled}
              onChange={(enabled) => set("dressCode", { enabled })}
            />
          }
        >
          <Field label="Keterangan">
            <TextInput
              type="text"
              maxLength={200}
              placeholder="mis. Earth Tone / Batik Coklat"
              value={settings.dressCode.text}
              onChange={(e) => set("dressCode", { text: e.target.value })}
            />
          </Field>
          <DressCodeColorsEditor
            colors={settings.dressCode.colors}
            onChange={(colors) => set("dressCode", { colors })}
          />
        </SettingsSection>

        {/* Musik */}
        <SettingsSection
          title="Musik Latar"
          sticker="Now Playing"
          toggle={
            <ToggleField
              label="Aktif"
              checked={settings.music.enabled}
              onChange={(enabled) => set("music", { enabled })}
            />
          }
        >
          <Field label="URL Musik (mp3)">
            <TextInput
              type="url"
              maxLength={500}
              placeholder="https://.../lagu.mp3"
              value={settings.music.url}
              onChange={(e) => set("music", { url: e.target.value })}
            />
          </Field>
        </SettingsSection>

        <button
          type="submit"
          disabled={saving}
          className="btn-brutal mt-10 w-full bg-coral px-6 py-4 text-sm uppercase text-cream disabled:opacity-70 sm:text-base"
        >
          {saving ? "Menyimpan..." : "Simpan Semua Perubahan"}
          <Save aria-hidden="true" className="h-5 w-5" />
        </button>
      </form>
    </main>
  );
}
