"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowRight,
  Check,
  Copy,
  Link as LinkIcon,
  MessageCircle,
  Pencil,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { weddingConfig } from "@/config/wedding";
import {
  buildInvitationLink,
  invitationId,
  type StoredInvitation,
} from "@/lib/invitation";
import type { StoredRsvp } from "@/lib/records";

function waShareUrl(guestName: string, link: string): string {
  const { bride, groom } = weddingConfig.couple;
  const text =
    `Kepada Yth. ${guestName},\n\n` +
    `Dengan penuh kebahagiaan, kami mengundang Anda untuk hadir di hari pernikahan kami, ${bride.name} & ${groom.name}.\n\n` +
    `Undangan lengkap dapat dibuka di:\n${link}\n\n` +
    `Merupakan suatu kehormatan bagi kami apabila Anda berkenan hadir. Terima kasih.`;
  return `https://wa.me/?text=${encodeURIComponent(text)}`;
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

/** Halaman internal: generate link undangan personal + rekap RSVP. */
export default function KirimUndangan() {
  const [name, setName] = useState("");
  const [invitations, setInvitations] = useState<StoredInvitation[]>([]);
  const [rsvps, setRsvps] = useState<StoredRsvp[]>([]);
  const [latest, setLatest] = useState<StoredInvitation | null>(null);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/invitations")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { invitations?: StoredInvitation[] } | null) => {
        if (data?.invitations) setInvitations(data.invitations);
      })
      .catch(() => {});

    fetch("/api/rsvp")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { rsvps?: StoredRsvp[] } | null) => {
        if (data?.rsvps) setRsvps(data.rsvps);
      })
      .catch(() => {});
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const clean = name.trim();
    if (!clean || sending) return;

    setSending(true);
    setError(null);
    try {
      const res = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: clean }),
      });
      const data = (await res.json().catch(() => null)) as {
        invitation?: StoredInvitation;
        error?: string;
      } | null;
      if (!res.ok || !data?.invitation) {
        throw new Error(data?.error ?? "Gagal menyimpan undangan.");
      }

      setLatest(data.invitation);
      setInvitations((cur) => [data.invitation!, ...cur]);
      setName("");
    } catch (err) {
      // Storage belum dikonfigurasi? Tetap tampilkan link agar bisa dipakai.
      setLatest({
        name: clean,
        link: buildInvitationLink(clean),
        createdAt: new Date().toISOString(),
      });
      setError(
        err instanceof Error
          ? `${err.message} (Link tetap dibuat, tetapi tidak tersimpan.)`
          : "Terjadi kesalahan.",
      );
    } finally {
      setSending(false);
    }
  };

  const onCopy = async (link: string) => {
    if (await copyToClipboard(link)) {
      setCopiedLink(link);
      setTimeout(() => setCopiedLink(null), 2000);
    }
  };

  const startEdit = (inv: StoredInvitation) => {
    setEditingId(invitationId(inv));
    setEditName(inv.name);
    setDeletingId(null);
    setListError(null);
  };

  const saveEdit = async () => {
    const clean = editName.trim();
    if (!clean || !editingId || busyId) return;

    setBusyId(editingId);
    setListError(null);
    try {
      const res = await fetch("/api/invitations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, name: clean }),
      });
      const data = (await res.json().catch(() => null)) as {
        invitation?: StoredInvitation;
        error?: string;
      } | null;
      if (!res.ok || !data?.invitation) {
        throw new Error(data?.error ?? "Gagal mengubah undangan.");
      }

      const updated = data.invitation;
      setInvitations((cur) =>
        cur.map((inv) => (invitationId(inv) === editingId ? updated : inv)),
      );
      if (latest && invitationId(latest) === editingId) setLatest(updated);
      setEditingId(null);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async (id: string) => {
    if (busyId) return;

    setBusyId(id);
    setListError(null);
    try {
      const res = await fetch("/api/invitations", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error ?? "Gagal menghapus undangan.");
      }

      setInvitations((cur) => cur.filter((inv) => invitationId(inv) !== id));
      if (latest && invitationId(latest) === id) setLatest(null);
      setDeletingId(null);
    } catch (err) {
      setListError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setBusyId(null);
    }
  };

  const totalGuests = rsvps
    .filter((r) => r.attendance === "hadir")
    .reduce((sum, r) => sum + r.guestCount, 0);

  return (
    <main className="min-h-screen px-6 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <header className="text-center">
          <span className="sticker bg-lemon -rotate-2 text-xs sm:text-sm">
            Halaman pengantin
          </span>
          <h1 className="mt-5 font-display text-4xl uppercase leading-[0.95] sm:text-5xl">
            Kirim Undangan
          </h1>
          <p className="mx-auto mt-4 max-w-md text-sm text-ink/75 sm:text-base">
            Tulis nama penerima, dapatkan link undangan personal, lalu bagikan
            lewat WhatsApp.
          </p>
        </header>

        {/* Form generate */}
        <form onSubmit={onSubmit} className="card-brutal mt-10 px-6 py-8 sm:px-10">
          <label className="block">
            <span className="font-heading text-sm font-bold uppercase tracking-widest">
              Nama Penerima
            </span>
            <input
              type="text"
              required
              maxLength={100}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="cth. Bapak Ahmad & Keluarga"
              className="input-brutal mt-2"
            />
          </label>

          <button
            type="submit"
            disabled={sending}
            className="btn-brutal mt-6 w-full bg-lemon px-6 py-4 text-sm uppercase disabled:opacity-70 sm:text-base"
          >
            {sending ? "Membuat..." : "Generate Link"}
            <ArrowRight aria-hidden="true" className="h-5 w-5" />
          </button>

          {error && (
            <p
              role="alert"
              className="mt-4 border-[3px] border-ink bg-coral px-4 py-3 text-sm font-bold text-cream"
            >
              {error}
            </p>
          )}
        </form>

        {/* Hasil terbaru */}
        {latest && (
          <div className="card-brutal mt-8 bg-bubblegum px-6 py-6 sm:-rotate-1">
            <p className="font-heading text-sm font-bold uppercase tracking-widest">
              Link untuk {latest.name}
            </p>
            <p className="mt-2 break-all border-[3px] border-ink bg-paper px-3 py-2 font-mono text-xs sm:text-sm">
              {latest.link}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onCopy(latest.link)}
                className="btn-brutal bg-paper px-4 py-2 text-xs uppercase sm:text-sm"
              >
                {copiedLink === latest.link ? (
                  <>
                    Copied! <Check aria-hidden="true" className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Salin Link <Copy aria-hidden="true" className="h-4 w-4" />
                  </>
                )}
              </button>
              <a
                href={waShareUrl(latest.name, latest.link)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brutal bg-teal px-4 py-2 text-xs uppercase text-cream sm:text-sm"
              >
                Kirim via WhatsApp
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
              </a>
            </div>
          </div>
        )}

        {/* Rekap RSVP */}
        <section className="mt-14">
          <h2 className="flex items-center gap-3 font-display text-2xl uppercase sm:text-3xl">
            <Users aria-hidden="true" className="h-6 w-6" />
            Rekap Kehadiran
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              [rsvps.filter((r) => r.attendance === "hadir").length, "Hadir", "bg-lemon"],
              [rsvps.filter((r) => r.attendance === "tidak").length, "Berhalangan", "bg-coral text-cream"],
              [totalGuests, "Total Tamu", "bg-teal text-cream"],
            ].map(([value, label, tone]) => (
              <div
                key={label as string}
                className={`card-brutal px-2 py-4 text-center ${tone}`}
              >
                <p className="font-display text-2xl sm:text-3xl">{value}</p>
                <p className="mt-1 font-heading text-[10px] font-bold uppercase tracking-widest sm:text-xs">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {rsvps.length > 0 && (
            <ul className="mt-5 flex flex-col gap-2">
              {rsvps.map((r, i) => (
                <li
                  key={`${r.name}-${i}`}
                  className="flex items-center justify-between gap-3 border-[3px] border-ink bg-paper px-4 py-2 text-sm"
                >
                  <span className="font-bold">{r.name}</span>
                  <span className="font-heading text-xs font-bold uppercase">
                    {r.attendance === "hadir"
                      ? `Hadir · ${r.guestCount} tamu`
                      : "Berhalangan"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Riwayat link */}
        <section className="mt-14">
          <h2 className="flex items-center gap-3 font-display text-2xl uppercase sm:text-3xl">
            <LinkIcon aria-hidden="true" className="h-6 w-6" />
            Undangan Terkirim
          </h2>

          {listError && (
            <p
              role="alert"
              className="mt-4 border-[3px] border-ink bg-coral px-4 py-3 text-sm font-bold text-cream"
            >
              {listError}
            </p>
          )}

          {invitations.length === 0 ? (
            <p className="mt-4 border-[3px] border-dashed border-ink/40 px-4 py-6 text-center text-sm text-ink/60">
              Belum ada link undangan yang dibuat.
            </p>
          ) : (
            <ul className="mt-5 flex flex-col gap-3">
              {invitations.map((inv) => {
                const id = invitationId(inv);
                const busy = busyId === id;

                return (
                  <li
                    key={id}
                    className={`border-[3px] border-ink bg-paper px-4 py-3 shadow-[4px_4px_0_0_#141414] ${
                      busy ? "opacity-60" : ""
                    }`}
                  >
                    {editingId === id ? (
                      /* --- Mode edit --- */
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          maxLength={100}
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && saveEdit()}
                          aria-label={`Ubah nama untuk ${inv.name}`}
                          className="input-brutal min-w-0 flex-1 py-2! text-sm"
                          autoFocus
                        />
                        <button
                          type="button"
                          onClick={saveEdit}
                          disabled={busy || !editName.trim()}
                          aria-label="Simpan perubahan"
                          className="btn-brutal bg-teal p-2 text-cream disabled:opacity-60"
                        >
                          <Check aria-hidden="true" className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          disabled={busy}
                          aria-label="Batal edit"
                          className="btn-brutal bg-paper p-2"
                        >
                          <X aria-hidden="true" className="h-4 w-4" />
                        </button>
                      </div>
                    ) : deletingId === id ? (
                      /* --- Konfirmasi hapus --- */
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="font-heading text-sm font-bold">
                          Hapus undangan untuk {inv.name}?
                        </span>
                        <span className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => confirmDelete(id)}
                            disabled={busy}
                            className="btn-brutal bg-coral px-3 py-2 text-xs uppercase text-cream disabled:opacity-60"
                          >
                            {busy ? "Menghapus..." : "Ya, Hapus"}
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingId(null)}
                            disabled={busy}
                            className="btn-brutal bg-paper px-3 py-2 text-xs uppercase"
                          >
                            Batal
                          </button>
                        </span>
                      </div>
                    ) : (
                      /* --- Tampilan normal --- */
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="font-heading text-sm font-bold">
                          {inv.name}
                        </span>
                        <span className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => onCopy(inv.link)}
                            aria-label={`Salin link untuk ${inv.name}`}
                            className="btn-brutal bg-lemon p-2"
                          >
                            {copiedLink === inv.link ? (
                              <Check aria-hidden="true" className="h-4 w-4" />
                            ) : (
                              <Copy aria-hidden="true" className="h-4 w-4" />
                            )}
                          </button>
                          <a
                            href={waShareUrl(inv.name, inv.link)}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Kirim ke ${inv.name} via WhatsApp`}
                            className="btn-brutal bg-teal p-2 text-cream"
                          >
                            <MessageCircle
                              aria-hidden="true"
                              className="h-4 w-4"
                            />
                          </a>
                          <button
                            type="button"
                            onClick={() => startEdit(inv)}
                            aria-label={`Edit undangan untuk ${inv.name}`}
                            className="btn-brutal bg-periwinkle p-2"
                          >
                            <Pencil aria-hidden="true" className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingId(id);
                              setEditingId(null);
                            }}
                            aria-label={`Hapus undangan untuk ${inv.name}`}
                            className="btn-brutal bg-coral p-2 text-cream"
                          >
                            <Trash2 aria-hidden="true" className="h-4 w-4" />
                          </button>
                        </span>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
