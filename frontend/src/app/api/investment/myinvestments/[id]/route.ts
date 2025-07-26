import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        
        const { searchParams } = new URL(req.url);
        const walletId = searchParams.get('id');


        const response = await fetch(`http://localhost:3000/investment/summary/${walletId}`, { cache: "no-store" });
        console.log(response);

        if (!response.ok) {
            throw new Error("Erro ao buscar meu investimento");
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
    }
}
