import { NextResponse } from "next/server";


export async function GET() {
    try {
        const response = await fetch(`${process.env.API_URL}/transaction/crypt_key`);
        if (!response) {
            throw new Error('Erro ao buscar investimento')
        }
        const data = await response.json()

        return NextResponse.json(data, { status: 200 });
    } catch (e) {
        console.log(e)
        return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
    }
}