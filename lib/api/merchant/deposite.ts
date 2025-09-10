/* import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions";
import { redirect } from "next/navigation";
import { getAccessToken } from "../../getToken";

export async function getDepositList(page = 1) {
  const session = await getServerSession(authOptions);
  const token = getAccessToken(session);
  if (!token) throw new Error("Not authenticated");

  const baseUrl = process.env.BASE_URL; 
  const url = `${baseUrl}/u/invoice/invoices/?page=${page}&page_size=10`;

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
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
import { ApiResponse } from "../../types/deposit";

export async function getDepositList(page = 1) {
  return serverGet<ApiResponse>(
    `/u/invoice/invoices/?page=${page}&page_size=10`,
    { cache: "no-cache" }
  );
} */

import { serverGet } from "@/lib/server-get";
import { DepositListResponse } from "../../types/deposit";

export type DepositFilters = {
  page?: number;
  page_size?: number;
  method?: string;
  pay_status?: string;
  search?: string;                  // global search
  created_at_before?: string;       // YYYY-MM-DD
  created_at_after?: string;        // YYYY-MM-DD
};

export async function getDepositList(filters: DepositFilters) {
  const qs = new URLSearchParams();
  if (filters.method) qs.set("method", filters.method);
  if (filters.pay_status) qs.set("pay_status", filters.pay_status);
  if (filters.search) qs.set("search", filters.search);
  if (filters.created_at_before) qs.set("created_at_before", filters.created_at_before);
  if (filters.created_at_after) qs.set("created_at_after", filters.created_at_after);
  qs.set("page", String(filters.page ?? 1));
  qs.set("page_size", String(filters.page_size ?? 10));

  return serverGet<DepositListResponse>(`/u/invoice/invoices/?${qs.toString()}`, { cache: "no-cache" });
}
