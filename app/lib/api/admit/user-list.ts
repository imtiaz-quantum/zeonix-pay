/* import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { redirect } from "next/navigation";
import { getAccessToken } from "@/app/lib/getToken";

function extractDetail(body: unknown): string | undefined {
  if (typeof body === "object" && body !== null && "detail" in body) {
    const d = (body as Record<string, unknown>).detail;
    if (typeof d === "string") return d;
  }
  return undefined;
}

export async function getUserList(page = 1) {
  const session = await getServerSession(authOptions);
  const baseUrl = process.env.BASE_URL;
  const token = getAccessToken(session);
  if (!token) throw new Error("Not authenticated");

  const url = `${baseUrl}/admin/merchant/?page=${page}&page_size=10`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
  } catch (e) {
    console.error("[getUserList] upstream fetch failed", e);
    redirect("/server-down");
  }

  if (!res.ok) {
    // 5xx → server down
    if (res.status >= 500) {
      console.error("[getUserList] upstream 5xx", res.status);
      redirect("/server-down");
    }

    // Try to read body for detail
    let body: unknown = null;
    try { body = await res.json(); } catch { 
      try { body = await res.text(); } catch { body = null; }
    }

    // 400/404 → invalid page, go to dedicated page with reason
    if (res.status === 404 || res.status === 400) {
      const reason = typeof body === "string" ? body : (extractDetail(body) ?? "Invalid page.");
      const qs = new URLSearchParams({ page: String(page), reason }).toString();
      redirect(`/admin/invalid?${qs}`);
    }

    // Other non-OK → throw to global error boundary
    const msg =
      (typeof body === "string" && body) ||
      extractDetail(body) ||
      `Failed to fetch users: ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  // OK
  return res.json();
}
 */

import { serverGet } from "@/lib/server-get";
import { InitialPayload } from "../../types/userList";

export async function getUserList(page = 1) {
  return serverGet<InitialPayload>(
    `/admin/merchant/?page=${page}&page_size=10`
  );
}