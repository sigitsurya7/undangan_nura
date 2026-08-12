import { listItems, pushItem, cleanText } from "@/lib/storage";
import type { StoredWish } from "@/lib/records";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const wishes = await listItems<StoredWish>("wishes");
    return Response.json({ wishes });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Gagal memuat ucapan." },
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

  const { name, message } = (body ?? {}) as Record<string, unknown>;
  const wish: StoredWish = {
    name: cleanText(name, 100),
    message: cleanText(message, 500),
    createdAt: new Date().toISOString(),
  };

  if (!wish.name || !wish.message) {
    return Response.json(
      { error: "Nama dan ucapan wajib diisi." },
      { status: 400 },
    );
  }

  try {
    await pushItem("wishes", wish);
    return Response.json({ ok: true, wish }, { status: 201 });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Gagal menyimpan ucapan." },
      { status: 503 },
    );
  }
}
