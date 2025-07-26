"use client";
import { useState } from "react";
import { If } from "./IF";
// import { MyInvestments } from "./MyInvestments";
import Investment from "./Investment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FilterDropdown } from "../ModelFilter";
import { useInvestment } from "@/contexts/investmentContext";
import RefundRedemption from "./RefundRedemption";
import FundOfInvestments from "./FundOfInvestments";
import { MyInvestments } from "./MyInvestments";

const InvestmentBody = () => {
    const { selectedInvestment } = useInvestment();
    const [activeTab, setActiveTab] = useState<"investment" | "myInvestment">(
        "investment"
    );
    const [activeTabFund, setActiveTabFund] = useState<
        "fundInvestment" | "myFund"
    >("fundInvestment");
    const [selectedRisks, setSelectedRisks] = useState<string[]>([]); // Gerencia o filtro de risco
    const [nameFilter, setNameFilter] = useState<string>("");
    const risks = ["Muito baixo", "Baixo", "Moderado", "Alto", "Muito alto"];
    const [tempSelectedRisks, setTempSelectedRisks] = useState<string[]>([]);

    const clearFilters = () => {
        setTempSelectedRisks([]); // Limpa o estado temporário
        setSelectedRisks([]); // Limpa o estado selectedRisks
    };
    const applyFilters = () => {
        setSelectedRisks(tempSelectedRisks); // Atualiza o estado selectedRisks
    };

    return (
        <>
            {selectedInvestment?.id ? (
                <div className="rounded-md p-3 w-full bg-white">
                    <div className="flex w-full border-b border-gray-200">
                        <button
                            className={`px-4 py-2 ${activeTabFund === "fundInvestment"
                                ? "border-b-2 border-black text-black"
                                : "text-gray-500"
                                }`}
                            onClick={() => setActiveTabFund("fundInvestment")}
                        >
                            Fundo de investimento
                        </button>
                        <button
                            className={`px-4 py-2 ${activeTabFund === "myFund"
                                ? "border-b-2 border-black text-black"
                                : "text-gray-500"
                                }`}
                            onClick={() => setActiveTabFund("myFund")}
                        >
                            Resgatar meu fundo
                        </button>
                    </div>
                    <>
                        <If condition={activeTabFund === "fundInvestment"}>
                            <FundOfInvestments
                                setActiveTab={function (): void {
                                    throw new Error("Function not implemented.");
                                }}
                            />
                        </If>
                        <If condition={activeTabFund === "myFund"}>
                            <RefundRedemption selectedRisks={[]} nameFilter={""} />

                        </If>
                    </>
                </div>
            ) : (
                <div className=" w-full bg-white rounded-md p-3">
                    <section className="flex  flex-wrap justify-between  items-center gap-4 w-full">
                        {/* Botões de tabs */}
                        <div className="flex border-b border-gray-200 w-full md:w-auto">
                            <button
                                className={`px-6 py-2 text-base ${activeTab === "investment"
                                    ? "border-b-2 border-black text-black font-semibold"
                                    : "text-gray-500"
                                    }`}
                                onClick={() => setActiveTab("investment")}
                            >
                                Investir
                            </button>
                            <button
                                className={`px-6 py-2 text-base ${activeTab === "myInvestment"
                                    ? "border-b-2 border-black text-black font-semibold"
                                    : "text-gray-500"
                                    }`}
                                onClick={() => setActiveTab("myInvestment")}
                            >
                                Meus investimentos
                            </button>
                        </div>

                        {/* Filtros */}
                        <div className="flex lg:gap-4 xl:justify-around xl:w-[25rem]  md:gap-2 lg:w-2/6 lg:px-3 lg:justify-between  md:w-3/6">
                            {/* Dropdown para o filtro de risco */}
                            <FilterDropdown
                                options={risks}
                                selectedOptions={tempSelectedRisks}
                                setSelectedOptions={setTempSelectedRisks}
                                title="Filtrar"
                                filterLabel="Risco de investimento"
                                applyFilters={applyFilters}
                                clearFilters={clearFilters} // Passa a função clearFilters como prop
                            />
                            {/* Input para buscar pelo nome */}
                            <div className="border rounded-md border-gray-300 h-10 flex items-center gap-2">
                                <FontAwesomeIcon
                                    icon={faMagnifyingGlass}
                                    className="ml-2 w-4 h-4 "
                                />
                                <input
                                    id="NameOfInvestmentFund"
                                    type="text"
                                    placeholder="Nome do fundo"
                                    value={nameFilter}
                                    onChange={(e) => setNameFilter(e.target.value)}
                                    className="placeholder-gray-400 md:text-[0.7rem] lg:text-[0.9rem] px-2 md:w-5/6"
                                />
                            </div>
                        </div>
                    </section>
                    <>
                        <If condition={activeTab === "investment"}>
                            <Investment
                                selectedRisks={selectedRisks}
                                nameFilter={nameFilter}
                            />
                        </If>
                        <If condition={activeTab === "myInvestment"}>
                            <MyInvestments
                                selectedRisks={selectedRisks}
                                nameFilter={nameFilter}
                            />
                        </If>
                    </>
                </div>
            )}
        </>
    );
};

export default InvestmentBody;

