import { siteConfig } from "@/config/wedding";

/** Header dikirim oleh adminFetch() (lib/admin-session.ts) setelah PIN benar. */
const HEADER = "x-admin-passcode";

/** Cek server-side untuk endpoint yang mengubah data (POST/PATCH/DELETE). */
export function isAuthorized(request: Request): boolean {
  return request.headers.get(HEADER) === siteConfig.admin.passcode;
}

export function unauthorizedResponse(): Response {
  return Response.json({ error: "Passcode tidak valid." }, { status: 401 });
}
