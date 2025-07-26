import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
        }

        const decoded = jwt.decode(token) as JwtPayload;
        const walletId = decoded?.idWallet;

        if (!walletId) {
            return NextResponse.json(
                { error: "Wallet ID não encontrado no token" },
                { status: 400 }
            );
        }

        const response = await fetch(`${process.env.API_URL}/wallet/${walletId}`, {
            cache: "no-store",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Erro na API externa: ${errorText}`);
        }

        const data = await response.json();
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error("Erro ao buscar carteira:", error);
        return NextResponse.json({ error: "Erro ao buscar dados" }, { status: 500 });
    }
}
