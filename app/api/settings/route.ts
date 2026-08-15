import { isAuthorized, unauthorizedResponse } from "@/lib/admin-auth";
import {
  getEffectiveSettings,
  saveSettings,
  sanitizeSettings,
} from "@/lib/wedding-settings";

export const dynamic = "force-dynamic";

export async function GET() {
  const settings = await getEffectiveSettings();
  return Response.json({ settings });
}

export async function PUT(request: Request) {
  if (!isAuthorized(request)) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Body harus JSON." }, { status: 400 });
  }

  const result = sanitizeSettings(body);
  if (!result.ok) {
    return Response.json({ error: result.error }, { status: 400 });
  }

  try {
    await saveSettings(result.data);
    return Response.json({ ok: true, settings: result.data });
  } catch (err) {
    return Response.json(
      { error: err instanceof Error ? err.message : "Gagal menyimpan pengaturan." },
      { status: 503 },
    );
  }
}
