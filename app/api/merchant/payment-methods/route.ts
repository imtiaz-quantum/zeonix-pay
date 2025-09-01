import { apiRequest } from "@/lib/apiRequest";
import { NextResponse } from "next/server";

// GET all payment methods
export async function GET() {
  const { data, status, ok } = await apiRequest("/u/wallet/payment-methods/", {
    method: "GET",
  });

  return NextResponse.json(data, { status });
}

// CREATE new method
export async function POST(req: Request) {
  const payload = await req.json();

  const { data, status, ok } = await apiRequest("/u/wallet/payment-methods/", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return NextResponse.json(data, { status });
}
