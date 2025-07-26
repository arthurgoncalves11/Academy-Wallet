import { BankSlipResult } from "@/contexts/paymentContext";

export async function fetchBankSlip(barCode: string, token: string | null): Promise<BankSlipResult> {
  try {
    const response = await fetch(
      `http://localhost:3000/paid-slips/${barCode}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        status: response.status,
        message:
          errorData.message || "Erro ao acessar as informações do usuário.",
      };
    }
    const bankSlip = await response.json()

    return bankSlip.data
  } catch (error) {
    throw error;
  }
}

export async function fetchUserData(token: string | null) {
  try {
    const response = await fetch(`http://localhost:3000/user/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        status: response.status,
        message:
          errorData.message || "Erro ao acessar as informações do usuário.",
      };
    }

    const user = await response.json()

    return user.data
  } catch (error) {
    throw error;
  }
}

export async function fetchPayment(paymentInfo: object, token: string | null) {
  try {
    const response = await fetch(`http://localhost:3000/paid-slips/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(paymentInfo),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        status: response.status,
        message:
          errorData.message || "Erro ao tentar efetuar o pagamento.",
      };
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function fetchPublicKey(token: string | null) {
  try {
    const response = await fetch(`http://localhost:3000/transaction/crypt/key`, {
      headers: {
        Authorization: `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw {
        status: response.status,
        message:
          errorData.message || "Erro ao tentar efetuar o pagamento.",
      };
    }

    const publicKey = await response.json()
    return publicKey.data.cryptKey
  } catch (error) {
    throw error;
  }
}