import { listItems, pushItem, replaceItems, cleanText } from "@/lib/storage";
import {
  buildInvitationLink,
  invitationId,
  type StoredInvitation,
} from "@/lib/invitation";

export const dynamic = "force-dynamic";

async function readBody(request: Request): Promise<Record<string, unknown>> {
  const body = (await request.json().catch(() => null)) as Record<
    string,
    unknown
  > | null;
  return body ?? {};
}

export async function GET() {
  try {
    const invitations = await listItems<StoredInvitation>("invitations", 500);
    return Response.json({ invitations });
  } catch (err) {
    return Response.json(
      {
        error:
          err instanceof Error ? err.message : "Gagal memuat daftar undangan.",
      },
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

  const { name } = (body ?? {}) as Record<string, unknown>;
  const cleanName = cleanText(name, 100);

  if (!cleanName) {
    return Response.json(
      { error: "Nama penerima wajib diisi." },
      { status: 400 },
    );
  }

  const invitation: StoredInvitation = {
    id: crypto.randomUUID(),
    name: cleanName,
    link: buildInvitationLink(cleanName),
    createdAt: new Date().toISOString(),
  };

  try {
    await pushItem("invitations", invitation);
    return Response.json({ ok: true, invitation }, { status: 201 });
  } catch (err) {
    return Response.json(
      {
        error:
          err instanceof Error ? err.message : "Gagal menyimpan undangan.",
      },
      { status: 503 },
    );
  }
}

/** Edit nama penerima — link dibuat ulang dari nama baru. */
export async function PATCH(request: Request) {
  const { id, name } = await readBody(request);
  const cleanName = cleanText(name, 100);

  if (typeof id !== "string" || !id) {
    return Response.json({ error: "id wajib diisi." }, { status: 400 });
  }
  if (!cleanName) {
    return Response.json(
      { error: "Nama penerima wajib diisi." },
      { status: 400 },
    );
  }

  try {
    const invitations = await listItems<StoredInvitation>("invitations", 500);
    let updated: StoredInvitation | null = null;

    const next = invitations.map((inv) => {
      if (invitationId(inv) !== id) return inv;
      updated = {
        ...inv,
        id: inv.id ?? crypto.randomUUID(),
        name: cleanName,
        link: buildInvitationLink(cleanName),
      };
      return updated;
    });

    if (!updated) {
      return Response.json(
        { error: "Undangan tidak ditemukan." },
        { status: 404 },
      );
    }

    await replaceItems("invitations", next);
    return Response.json({ ok: true, invitation: updated });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Gagal mengubah undangan." },
      { status: 503 },
    );
  }
}

/** Hapus satu undangan berdasarkan id. */
export async function DELETE(request: Request) {
  const { id } = await readBody(request);

  if (typeof id !== "string" || !id) {
    return Response.json({ error: "id wajib diisi." }, { status: 400 });
  }

  try {
    const invitations = await listItems<StoredInvitation>("invitations", 500);
    const next = invitations.filter((inv) => invitationId(inv) !== id);

    if (next.length === invitations.length) {
      return Response.json(
        { error: "Undangan tidak ditemukan." },
        { status: 404 },
      );
    }

    await replaceItems("invitations", next);
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Gagal menghapus undangan." },
      { status: 503 },
    );
  }
}
