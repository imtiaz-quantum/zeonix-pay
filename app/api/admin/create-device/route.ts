import { apiRequest } from "@/lib/apiRequest";
import { NextResponse } from "next/server";

// CREATE new device
export async function POST(req: Request) {
  const payload = await req.json();
console.log(payload)
  const { data, status } = await apiRequest("/admin/sms-device-keys/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return NextResponse.json(data, { status });
}


export async function GET() {
  return NextResponse.json({ ok: true, hint: "profile/update route alive" });
}
