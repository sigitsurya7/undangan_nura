import { isAuthorized, unauthorizedResponse } from "@/lib/admin-auth";
import { listItems, replaceItems } from "@/lib/storage";
import { deleteImage } from "@/lib/blob";
import type { StoredMedia } from "@/app/api/settings/upload/route";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const media = await listItems<StoredMedia>("media", 200);
    return Response.json({ media });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Gagal memuat galeri foto." },
      { status: 503 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  const body = (await request.json().catch(() => null)) as { id?: unknown } | null;
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id) {
    return Response.json({ error: "id wajib diisi." }, { status: 400 });
  }

  try {
    const media = await listItems<StoredMedia>("media", 500);
    const target = media.find((m) => m.id === id);
    if (!target) {
      return Response.json({ error: "Foto tidak ditemukan." }, { status: 404 });
    }

    await replaceItems(
      "media",
      media.filter((m) => m.id !== id),
    );
    await deleteImage(target.url);

    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Gagal menghapus foto." },
      { status: 503 },
    );
  }
}
