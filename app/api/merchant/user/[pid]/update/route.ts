import { apiRequest } from "@/lib/apiRequest";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
type Params = { pid: string };


export async function PATCH(req: Request, context: { params: Promise<Params> }) {
    const { pid } = await context.params;
    const payload = await req.json();

    const { data, status } = await apiRequest(`/admin/merchant/${pid}/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
    });
    return NextResponse.json(data, { status });
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: "route-aliveeeeeeeeeee" });
}