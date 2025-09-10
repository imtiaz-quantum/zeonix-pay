import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { getAccessToken } from "@/lib/getToken";


export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = process.env.BASE_URL;

  // If your health endpoint requires auth, attach token
  let headers: HeadersInit = { Accept: "application/json" };
  try {
    const session = await getServerSession(authOptions);
     const token = getAccessToken(session);;

    if (token) headers = { ...headers, Authorization: `Bearer ${token}` };
  } catch {}

  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 4000); // 4s timeout
    const upstream = await fetch(`${baseUrl}/health/`, { headers, signal: controller.signal, cache: "no-store" })
      .catch(() => null);
    clearTimeout(id);

    if (!upstream || !upstream.ok) {
      return NextResponse.json({ ok: false }, { status: 503 });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 503 });
  }
}
