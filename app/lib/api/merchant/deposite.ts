import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions";
import { redirect } from "next/navigation";
import { getAccessToken } from "../../getToken";

export async function getDepositList(page = 1) {
  const session = await getServerSession(authOptions);
  const token = getAccessToken(session);
  if (!token) throw new Error("Not authenticated");

  const baseUrl = process.env.BASE_URL; // e.g. https://api.zeonixpay.com/api/v1
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
