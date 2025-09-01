import { authOptions } from "@/app/lib/authOptions";
import { getAccessToken } from "@/app/lib/getToken";
import { getServerSession } from "next-auth";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function apiRequest(path: string, options: RequestInit = {}) {
  const session = await getServerSession(authOptions);
  const token = getAccessToken(session);

  if (!token) {
    return { data: { message: "Unauthorized" }, status: 401, ok: false };
  }

  const baseUrl = process.env.BASE_URL!;
  const upstream = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  const text = await upstream.text();
  let data: unknown;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  return { data, status: upstream.status, ok: upstream.ok };
}
