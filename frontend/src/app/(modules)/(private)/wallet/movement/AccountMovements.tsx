import React, { useEffect, useState } from "react";
import NoMovements from "./NoMovements";
import ContainsMovements from "./ContainsMovements";
import { Transaction } from "./models";
import { fetchWithAuth } from "@/api-interceptor";

// Função para extrair o idWallet do token JWT armazenado nos cookies
const getTokenFromCookies = () => {
  try {
    const cookieObj = document.cookie
      .split(';')
      .map(cookie => cookie.trim())
      .reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);

    const token = cookieObj.token;

    if (!token) {
      throw new Error('Token não encontrado nos cookies');
    }

    const payload = JSON.parse(atob(token.split('.')[1]));

    const idWallet = payload.idWallet;


    if (payload.exp * 1000 < Date.now()) {
      throw new Error('Token expirado');
    }

    return { token, idWallet };
  } catch (error) {
    console.error('Erro ao recuperar token:', error);
    return { token: null, idWallet: null };
  }
};

interface AccountMovementsProps {
  isHidden: boolean;
}

const AccountMovements: React.FC<AccountMovementsProps> = ({ isHidden }) => {
  const [loading, setLoading] = useState(true);
  const [listaDeMovimentacoes, setListaDeMovimentacoes] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchMovements = async () => {
      try {
        const { idWallet } = getTokenFromCookies(); 
        if (!idWallet) {
          throw new Error('idWallet não encontrado no token');
        }

        const url = `/api/transaction/all/${idWallet}`;  
        const data = await fetchWithAuth(url);
        console.log("Dados recebidos:", data);

        if (data && Array.isArray(data.data)) {
          setListaDeMovimentacoes(data.data);
          localStorage.setItem("movimentacoes", JSON.stringify(data.data));
        } else {
          throw new Error("Formato de resposta inválido");
        }
      } catch (error) {
        console.error("Erro ao buscar movimentações:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovements();
  }, []);

  return (
    <div className="flex flex-col mt-[30px] mr-[20px] ml-[20px] sm:mb-[22px]">
      <div className="flex justify-center items-center flex-col lg:mb-[10px] w-full bg-white">
        <div className="screen movements border-[1.1px] border-lightGray rounded-[8px] w-full h-full">
          <h1 className="text-sm leading-[19.36px] text-titleFont md:text-[16px] mt-[20px] lg:text-[20px] xl:text-[22px] 2xl:text-[24px] ml-[12px]">
            <strong>Últimas movimentações</strong>
          </h1>

          {loading ? (
            <div className="text-titleFont ml-[10px] mt-[15px] sm:text-[12px] md:text-[12px] lg:text-[14px] xl:text-[16px] 2xl:text-[18px]">
              Carregando transações, isso pode levar alguns instantes...
            </div>
          ) : listaDeMovimentacoes.length === 0 ? (
            <div className="flex justify-center">
              <NoMovements loading={loading} />
            </div>
          ) : (
            <div className="mt-6">
              <ContainsMovements
                listaDeMovimentacoes={listaDeMovimentacoes}
                isHidden={isHidden}
                isExtractComplete={false}
                loading={loading}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountMovements;
