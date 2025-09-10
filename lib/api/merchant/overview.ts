/* import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions";
import { redirect } from "next/navigation";
import { getAccessToken } from "../../getToken";

export async function getOverview() {
  const baseUrl = process.env.BASE_URL;
  const session = await getServerSession(authOptions);
  const token = getAccessToken(session);

  if (!token) throw new Error("Not authenticated");

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/u/wallet/wallet-overview/?page_size=10`, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: 'force-cache',
    });
  } catch (e) {
    // Network failure / server down
    console.error("[getDepositList] upstream fetch failed", e);
    redirect("/server-down"); // <-- show the server-down page
  }

  // If backend is up but returning 5xx, also send users to server-down
  if (!res.ok) {
    if (res.status >= 500) {
      console.error("[getDepositList] upstream 5xx", res.status);
      redirect("/server-down");
    }
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch deposits: ${res.status} ${res.statusText} ${text}`);
  }

  return res.json();
}
 */

// app/lib/api/merchant/overview.ts

import type { UserRole, WalletOverviewResponse } from "@/lib/types/wallet-overview";
import { serverGet } from "@/lib/server-get";

export async function getOverview<R extends UserRole>(role: R) {
  // same endpoint for all roles; typing depends on role
  return serverGet<WalletOverviewResponse<R>>("/u/wallet/wallet-overview/", {
    cache: "force-cache",
  });
}
