import React, { useEffect, useState } from "react";
import LoadingWrapper from "./movement/LoadingWrapper";
import WalletCard from "./WalletCard";
import VisibilityToggleButton from "./VisibilityToggleButton";
import { fetchWithAuth, getTokenFromCookies } from "@/api-interceptor";

interface BalanceCardProps {
  isHidden: boolean; 
  toggleVisibility: () => void;
}

const BalanceCard: React.FC<BalanceCardProps> = ({ isHidden, toggleVisibility }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    name: "-",
    accountBalance: 0,
    investmentBalance: 0,
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const tokenData = getTokenFromCookies();
        const idWallet = tokenData?.idWallet;

        if (!idWallet) {
          throw new Error("idWallet não encontrado.");
        }

        const responseData = await fetchWithAuth(`/api/wallet/${idWallet}`);
        setData({
          name: responseData.data.name,
          accountBalance: responseData.data.balanceCurrentAccount,
          investmentBalance: responseData.data.balanceInvestments,
        });
      } catch (error) {
        console.error("Erro ao buscar dados da carteira:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center mx-auto w-full">
      <main className="flex flex-col w-full">
        <div className="flex items-center justify-between h-[40px] xl:h-[45px] 2xl:h-[55px] mt-[10px] mb-[10px] ml-[25px] mr-[2%]">
          <h1 className="font-semibold text-sm text-titleFont text-[16px] xl:text-[19px] 2xl:text-[22px]">
            <LoadingWrapper
              loading={loading}
              skeletonWidth="215px"
              skeletonHeight="35px"
            >
              Olá, {data.name.split(" ")[0]}
            </LoadingWrapper>
          </h1>

          <VisibilityToggleButton
            isHidden={isHidden}
            toggleVisibility={toggleVisibility}
            loading={loading}
          />
        </div>

        <div className="border-t border-backgroundIncome opacity-100 ml-[1%] mr-[1%] mb-[25px]"></div>

        <section className="flex gap-4 mr-[20px] ml-[20px] mb-[20px]">
          <WalletCard
            bgColor="bg-backgroundLogoBlue"
            title="Conta corrente"
            subtitle="Saldo total"
            value={data.accountBalance}
            isHidden={isHidden}
            flag={true}
            id="total-balance"
            loading={loading}
          />

          <WalletCard
            bgColor="bg-backgroundLogoDark"
            title="Meus investimentos"
            subtitle="Total investido"
            value={data.investmentBalance}
            isHidden={isHidden}
            flag={false}
            id="total-investment"
            loading={loading}
          />
        </section>
      </main>
    </div>
  );
}

export default BalanceCard;
