import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/apiRequest";


 // POST handler for generating API key
export async function POST() {
  const { data, status } = await apiRequest("/app/keys/", {
    method: "POST",
  });

  return NextResponse.json(data, { status }, );
}

// PATCH handler for toggling API key active status
export async function PATCH(req: Request) {
  const { is_active } = await req.json();

  const { data, status } = await apiRequest("/app/keys/", {
    method: "PATCH",
    body: JSON.stringify({is_active}),
  });

  return NextResponse.json(data, { status }, );
}
   

// GET handler for checking route health
export async function GET() {
    return NextResponse.json({ ok: true, hint: "route-aliveeeeeeeeeee" });
}
