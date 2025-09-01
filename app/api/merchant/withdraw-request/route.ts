import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/apiRequest";


export async function POST(req: Request) {
  const payload = await req.json();

  const { data, status, ok } = await apiRequest("/u/wallet/withdraw-request/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return NextResponse.json(data, { status }, );
}
export async function GET() {
  return NextResponse.json({ ok: true, hint: "route-aliveeeeeeeeeee" });
}