import { listItems, pushItem, cleanText } from "@/lib/storage";
import type { StoredRsvp } from "@/lib/records";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rsvps = await listItems<StoredRsvp>("rsvps", 500);
    return Response.json({ rsvps });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Gagal memuat RSVP." },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body harus JSON." }, { status: 400 });
  }

  const { name, attendance, guestCount } = (body ?? {}) as Record<
    string,
    unknown
  >;

  const cleanName = cleanText(name, 100);
  const cleanAttendance = attendance === "tidak" ? "tidak" : "hadir";
  const count =
    cleanAttendance === "hadir"
      ? Math.min(10, Math.max(1, Number(guestCount) || 1))
      : 0;

  if (!cleanName) {
    return Response.json({ error: "Nama wajib diisi." }, { status: 400 });
  }

  const rsvp: StoredRsvp = {
    name: cleanName,
    attendance: cleanAttendance,
    guestCount: count,
    createdAt: new Date().toISOString(),
  };

  try {
    await pushItem("rsvps", rsvp);
    return Response.json({ ok: true, rsvp }, { status: 201 });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Gagal menyimpan RSVP." },
      { status: 503 },
    );
  }
}
