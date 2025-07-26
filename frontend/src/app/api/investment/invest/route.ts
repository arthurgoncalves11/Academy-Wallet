import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const payload = await req.json();


        const response = await fetch(`${process.env.API_URL}/investment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });


        if (!response.ok) {
            throw new Error(`Erro ao fazer o investimento: ${response.statusText}`);
        }

        const data = await response.json();

        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error("Erro no servidor:", error);
        return NextResponse.json(
            { error: "Erro ao processar a requisição" },
            { status: 500 }
        );
    }
}