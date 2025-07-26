import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = searchParams.get("page") || "1";
        const size = searchParams.get("size") || "10";

        const response = await fetch(`http://localhost:3000/market-share?page=${page}&size=${size}`);
        if (!response.ok) {
            throw new Error("Erro ao buscar investimentos");
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
    }
}
