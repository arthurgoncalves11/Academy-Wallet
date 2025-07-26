import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        const response = await fetch(`${process.env.API_URL}/market-share/${id}`, { cache: "no-store" });


        if (!response.ok) {
            throw new Error("Erro ao buscar investimento");
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
    }
}
