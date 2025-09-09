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

/* import { serverGet } from "@/lib/server-get";
import { ApiResponse } from "../../types/withdraw-request";

export async function getWithdrawRequests(page = 1) {
  return serverGet<ApiResponse>(
    `/u/wallet/withdraw-request/?page=${page}&page_size=10`
  );
} */



  
import { serverGet } from "@/lib/server-get";
import { WithdrawReqListResponse } from "../../types/withdraw-request";


  
  export type WithdrawFilters = {
    page?: number;
    page_size?: number;
    method?: string;
    status?: string;
    search?: string;                  // global search
    created_at_before?: string;       // YYYY-MM-DD
    created_at_after?: string;        // YYYY-MM-DD
  };
  
  export async function getWithdrawRequests(filters: WithdrawFilters) {
    const qs = new URLSearchParams();
    if (filters.method) qs.set("method", filters.method);
    if (filters.status) qs.set("status", filters.status);
    if (filters.search) qs.set("search", filters.search);
    if (filters.created_at_before) qs.set("created_at_before", filters.created_at_before);
    if (filters.created_at_after) qs.set("created_at_after", filters.created_at_after);
    qs.set("page", String(filters.page ?? 1));
    qs.set("page_size", String(filters.page_size ?? 10));
  
    return serverGet<WithdrawReqListResponse>(`/u/wallet/withdraw-request/?${qs.toString()}`, { cache: "no-cache" });
  }
  