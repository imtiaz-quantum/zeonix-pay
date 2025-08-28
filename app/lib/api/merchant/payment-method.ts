import { getServerSession } from "next-auth";
import { authOptions } from "../../authOptions";
import { getAccessToken } from "../../getToken";


export async function getPaymentMethodList() {

    const session = await getServerSession(authOptions);
    const baseUrl = process.env.BASE_URL;
    const token = getAccessToken(session);

    if (!token) throw new Error("Not authenticated");

    const res = await fetch(`${baseUrl}/u/wallet/payment-methods/?all=true`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
        cache: "no-store",
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Upstream failed: ${res.status} ${res.statusText} ${text}`);
    }
    return res.json();
}


