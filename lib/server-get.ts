import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { getAccessToken } from "@/app/lib/getToken";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type GetOpts = {
  cache?: RequestCache; // e.g. "no-store" | "force-cache"
  signal?: AbortSignal;
};

export async function serverGet<T = unknown>(path: string, opts: GetOpts = {}): Promise<T> {
  const baseUrl = process.env.BASE_URL!;
  const session = await getServerSession(authOptions);
  const token = getAccessToken(session);
  if (!token) throw new Error("Not authenticated");

  const controller = !opts.signal ? new AbortController() : undefined;
  const timeout = controller ? setTimeout(() => controller.abort(), 10000) : undefined; // 10s safety

  let res: Response;
  try {
    res = await fetch(`${baseUrl}${path}`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: opts.cache ?? "no-store",
      signal: opts.signal ?? controller?.signal,
    });
  } catch (e) {
    if (timeout) clearTimeout(timeout);
    console.error("[serverGet] network failure", e);
    redirect("/server-down");
  }
  if (timeout) clearTimeout(timeout);

  if (!res.ok) {
    // Treat 5xx as outage
    if (res.status >= 500) {
      console.error("[serverGet] upstream 5xx", res.status);
      redirect("/server-down");
    }
    
    const text = await res.text().catch(() => "");
    throw new Error(`Request failed: ${res.status} ${res.statusText} ${text}`);
  }

  return res.json() as Promise<T>;
}
