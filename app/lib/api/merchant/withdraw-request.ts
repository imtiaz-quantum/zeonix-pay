import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions";
import { getAccessToken } from "../../getToken";
import { redirect } from "next/navigation";
/* 
export async function getWithdrawRequests() {
  const baseUrl = process.env.BASE_URL;
  const session = await getServerSession(authOptions);
  const token = getAccessToken(session);

  if (!token) throw new Error("Not authenticated");

  const res = await fetch(`${baseUrl}/u/wallet/withdraw-request/`, {
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Upstream failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}
 */



/* export async function getWithdrawRequests(page = 1) {
  const session = await getServerSession(authOptions);
  const token = getAccessToken(session);
  if (!token) throw new Error("Not authenticated");

  const baseUrl = process.env.BASE_URL; 
  const url = `${baseUrl}/u/wallet/withdraw-request/?page=${page}&page_size=10`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
  } catch (e) {
    console.error("[getWithdrawRequests] upstream fetch failed", e);
    redirect("/server-down");
  }

  if (!res.ok) {
    if (res.status >= 500) {
      console.error("[getWithdrawRequests] upstream 5xx", res.status);
      redirect("/server-down");
    }
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch withdraw requests: ${res.status} ${res.statusText} ${text}`);
  }

  // Expecting shape: { status, count, next, previous, data: [...] }
  return res.json();
} */

import { serverGet } from "@/lib/server-get";
import { ApiResponse } from "../../types/withdraw-request";

export async function getWithdrawRequests(page = 1) {
  return serverGet<ApiResponse>(
    `/u/wallet/withdraw-request/?page=${page}&page_size=10`
  );
}