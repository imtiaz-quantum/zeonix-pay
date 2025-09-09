/* import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions";
import { redirect } from "next/navigation";
import { getAccessToken } from "../../getToken";

export async function getWalletTransactions(page = 1) {
  const session = await getServerSession(authOptions);
  const token = getAccessToken(session);
  if (!token) throw new Error("Not authenticated");

  const baseUrl = process.env.BASE_URL; // e.g. https://api.zeonixpay.com/api/v1
  const url = `${baseUrl}/u/wallet/wallet-transaction/?page=${page}&page_size=10`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    });
  } catch (e) {
    console.error("[getDepositList] upstream fetch failed", e);
    redirect("/server-down");
  }

  if (!res.ok) {
    if (res.status >= 500) {
      console.error("[getDepositList] upstream 5xx", res.status);
      redirect("/server-down");
    }
    const text = await res.text().catch(() => "");
    throw new Error(`Failed to fetch deposits: ${res.status} ${res.statusText} ${text}`);
  }

  // { status, count, next, previous, data: [...] }
  return res.json();
}
 */
/* import { serverGet } from "@/lib/server-get";
import { ApiResponse } from "../../types/all-transaction";

export async function getWalletTransactions(page = 1) {
  return serverGet<ApiResponse>(
    `/u/wallet/wallet-transaction/?page=${page}&page_size=10`
  );
} */

import { serverGet } from "@/lib/server-get";
import { AllTransctionResponse } from "../../types/all-transaction";
 
 
 export type WalletTransactionsFilters = {
   page?: number;
   page_size?: number;
   method?: string;
   status?: string;
   tran_type?: string;
   search?: string;               
   created_at_before?: string;  
   created_at_after?: string;    
 };
 
 export async function getWalletTransactions(filters: WalletTransactionsFilters) {
   const qs = new URLSearchParams();
   if (filters.method) qs.set("method", filters.method);
   if (filters.status) qs.set("status", filters.status);
   if (filters.search) qs.set("search", filters.search);
   if (filters.tran_type) qs.set("tran_type", filters.tran_type);
   if (filters.created_at_before) qs.set("created_at_before", filters.created_at_before);
   if (filters.created_at_after) qs.set("created_at_after", filters.created_at_after);
   qs.set("page", String(filters.page ?? 1));
   qs.set("page_size", String(filters.page_size ?? 10));
 
   return serverGet<AllTransctionResponse>(`/u/wallet/wallet-transaction/?${qs.toString()}`, { cache: "no-cache" });
 } 