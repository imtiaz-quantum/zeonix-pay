import { NextResponse } from "next/server";
import { apiRequest } from "@/lib/apiRequest";
export const dynamic = "force-dynamic";

type Params = { id: string };

export async function PATCH(
  req: Request,
  context: { params: Promise<Params> }
) {
  try {
    const { id } = await context.params;
    const payload = await req.json();

    const { data, status } = await apiRequest(`/admin/sms-device-keys/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    console.log(payload)
    return NextResponse.json(data, { status });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ message }, { status: 500 });
  }
}