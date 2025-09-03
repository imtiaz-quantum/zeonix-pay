import { apiRequest } from "@/lib/apiRequest";
import { NextResponse } from "next/server";


export const dynamic = "force-dynamic";

/* // GET all payment methods
export async function GET() {
  const { data, status, ok } = await apiRequest("/u/wallet/payment-methods/", {
    method: "GET",
  });

  return NextResponse.json(data, { status });
} */

// CREATE new method
export async function POST(req: Request) {
  const payload = await req.json();

  const { data, status, ok } = await apiRequest("/auth/admin/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return NextResponse.json(data, { status });
}


export async function GET() {
  return NextResponse.json({ ok: true, hint: "profile/update route alive" });
}
