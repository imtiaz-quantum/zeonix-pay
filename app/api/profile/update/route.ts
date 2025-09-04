import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { getAccessToken } from "@/app/lib/getToken";
import { apiRequest } from "@/lib/apiRequest";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
const BASE = process.env.BASE_URL!;


/** PUT: JSON-only profile updates (no file) */
export async function PUT(req: Request) {
  const payload = await req.json();

  const { data, status } = await apiRequest("/user/merchant-profile/", {
    method: "PUT",
    body: JSON.stringify(payload),
  });

  return NextResponse.json(data, { status },);
}


/** POST: multipart/form-data for logo upload — proxied to upstream */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const token = getAccessToken(session);

    console.log("dataaaaaaaaaaaaaaaa");
    const ct = req.headers.get("content-type") || "";
    if (!ct.includes("multipart/form-data")) {
      return NextResponse.json(
        { message: "Expected multipart/form-data in POST" },
        { status: 400 },
      );
    }

    // Parse form so we can validate presence of "logo"
    const form = await req.formData();
    const logo = form.get("brand_logo");
    if (!logo || !(logo instanceof File)) {
      return NextResponse.json(
        { message: "Missing file field 'logo'" },
        { status: 400 },
      );
    }

    // Forward original form-data to upstream (do not set Content-Type)
    const upstream = await fetch(`${BASE}/user/merchant-profile/`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: form,
      cache: "no-store",
    });

    const text = await upstream.text();
    let data: unknown = null;
    try { data = text ? JSON.parse(text) : null; } catch { data = text; }

    if (!upstream.ok) {
      return NextResponse.json(
        { message: "Upstream error", details: data },
        { status: upstream.status },
      );
    }

    // Your backend may return different shapes; just pass it through.
    return NextResponse.json(data ?? { ok: true }, { status: upstream.status || 200 });
  } catch (e: unknown) {
    if (e instanceof Response) return e; // thrown unauthorized
    return NextResponse.json({ message: "Server error", details: String(e) }, { status: 500 });
  }
}



export async function PATCH(req: Request) {
  const payload = await req.json();

  const { data, status } = await apiRequest("/user/profile/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });

  return NextResponse.json(data, { status },);
}


export async function GET() {
  return NextResponse.json({ ok: true, hint: "profile/update route alive" });
}
