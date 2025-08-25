// app/api/profile/update/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/authOptions";
import { getAccessToken } from "@/app/lib/getToken";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BASE = process.env.BASE_URL!; // e.g., https://api.example.com

async function requireToken() {
  const session = await getServerSession(authOptions);
  const token = getAccessToken(session);
  if (!token) {
    // Throw a Response so callers can `return` it easily
    throw NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return token;
}

/** PUT: JSON-only profile updates (no file) */
export async function PUT(req: Request) {
  try {
    const token = await requireToken();

    const ct = req.headers.get("content-type") || "";
    if (!ct.includes("application/json")) {
      return NextResponse.json(
        { message: "Expected application/json in PUT" },
        { status: 400 },
      );
    }

    let payload: unknown = null;
    try {
      payload = await req.json();
    } catch (e) {
      return NextResponse.json(
        { message: "Invalid JSON payload", details: String(e) },
        { status: 400 },
      );
    }

    const upstream = await fetch(`${BASE}/user/merchant-profile/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
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

    return NextResponse.json(data ?? { ok: true }, { status: upstream.status || 200 });
  } catch (e: unknown) {
    if (e instanceof Response) return e; // thrown unauthorized
    return NextResponse.json({ message: "Server error", details: String(e) }, { status: 500 });
  }
}

/** POST: multipart/form-data for logo upload — proxied to upstream */
export async function POST(req: Request) {
  try {
    const token = await requireToken();

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
console.log("dataaaaaaaaaaaaaaaa",form);

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
  const baseUrl = process.env.BASE_URL;
  const session = await getServerSession(authOptions);
   const token = getAccessToken(session);

  if (!token) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const payload = await req.json();
  console.log(payload)
  const upstream = await fetch(`${baseUrl}/user/profile/`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(payload),
    cache: "no-store",
  });
  console.log(upstream);
  

  const text = await upstream.text();
  let data: unknown = null; try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!upstream.ok) {
    return NextResponse.json({ message: "Upstream error", details: data }, { status: upstream.status });
  }
  return NextResponse.json(data ?? { ok: true }, { status: 200 });
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: "profile/update route alive" });
}
