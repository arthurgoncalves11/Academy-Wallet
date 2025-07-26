import { PaymentInfoProps } from "@/components/payment/PaymentData";

const TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."; // Your token here

export async function fetchBankSlip(barCode: string) {
    try {
        const response = await fetch(
            `http://localhost:3000/paid-slips/${barCode}`,
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw {
                status: response.status,
                message: errorData.message || "Erro ao processar o boleto.",
            };
        }

        const bankSlip = await response.json();
        return bankSlip.data;
    } catch (error) {
        throw error;
    }
}

export async function fetchUserData() {
    try {
        const response = await fetch(`http://localhost:3000/user/`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw {
                status: response.status,
                message:
                    errorData.message || "Erro ao acessar as informações do usuário.",
            };
        }

        const user = await response.json();
        return user.data;
    } catch (error) {
        throw error;
    }
}

export async function fetchPayment(paymentInfo: PaymentInfoProps) {
    try {
        const response = await fetch(`http://localhost:3000/paid-slips/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
            },
            body: JSON.stringify(paymentInfo),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw {
                status: response.status,
                message: errorData.message || "Erro ao tentar efetuar o pagamento.",
            };
        }

        return await response.json();
    } catch (error) {
        throw error;
    }
}