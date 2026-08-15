import { isAuthorized, unauthorizedResponse } from "@/lib/admin-auth";
import { uploadImage } from "@/lib/blob";
import { pushItem } from "@/lib/storage";

export const dynamic = "force-dynamic";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export interface StoredMedia {
  id: string;
  url: string;
  filename: string;
  uploadedAt: string;
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return Response.json(
      { error: "Body harus multipart/form-data." },
      { status: 400 },
    );
  }

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return Response.json({ error: "File tidak ditemukan." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return Response.json(
      { error: "Hanya file gambar yang diperbolehkan." },
      { status: 400 },
    );
  }
  if (file.size > MAX_SIZE) {
    return Response.json(
      { error: "Ukuran file maksimal 5MB." },
      { status: 400 },
    );
  }

  try {
    const url = await uploadImage(file);
    const media: StoredMedia = {
      id: crypto.randomUUID(),
      url,
      filename: file.name,
      uploadedAt: new Date().toISOString(),
    };
    await pushItem("media", media);
    return Response.json({ ok: true, media }, { status: 201 });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Gagal mengunggah foto." },
      { status: 503 },
    );
  }
}
