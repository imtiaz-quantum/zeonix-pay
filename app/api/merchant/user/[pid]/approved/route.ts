import { apiRequest } from "@/lib/apiRequest";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
type Params = { pid: string };


export async function POST(req: Request, context: { params: Promise<Params> }) {

    const { pid } = await context.params;
    const payload = await req.json();
    
    const { data, status } = await apiRequest(`/user/approved/${pid}/`, {
        method: "POST",
        body: JSON.stringify(payload),
    });
    return NextResponse.json(data, { status });
}

