"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image"
interface FilterDropdownProps {
  options: string[];
  selectedOptions: string[];
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
  title?: string;
  filterLabel?: string;
  applyFilters: () => void;
  clearFilters: () => void; // Adiciona clearFilters como prop
}

export function FilterDropdown({
  options,
  selectedOptions,
  setSelectedOptions,
  title = "Filtrar",
  filterLabel = "Selecione uma opção",
  applyFilters,
  clearFilters, // Recebe a função clearFilters como prop
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  const handleOptionSelect = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const handleClearFilter = () => {
    clearFilters(); // Chama a função clearFilters do componente pai
    setIsOpen(false); // Fecha o dropdown
  };

  const handleApplyFilters = () => {
    applyFilters(); // Chama a função applyFilters ao clicar em "Aplicar"
    setIsOpen(false); // Fecha o dropdown
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center transition-all duration-200 active:scale-90  md:text-[0.8rem] lg:text-[0.9rem] bg-white hover:bg-white text-[#334155] h-10 px-4 border rounded-md border-gray"
        >
          <Image
            src="bars-filter.svg"
            width={24}
            height={24}
            alt="icone de filtro"
            className="mr-2 text-[#334155]"
          />

          {title}
          {selectedOptions.length > 0 && (
            <span className="ml-2 flex items-center justify-center w-5 h-5 p-4 text-white lg:text-[0.7rem] md:text-[0.6rem] md:w-3 md:h-3 md:p-2 font-bold bg-[#00253F] rounded-full">
              {selectedOptions.length}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-[18rem] p-2">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <h2 className="text-xs pl-2 font-semibold pt-2">{filterLabel}</h2>
        <div className="flex flex-wrap gap-2 my-2">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => handleOptionSelect(option)}
              className={`p-2 rounded-full border min-w-[2rem] text-center text-xs
                ${selectedOptions.includes(option)
                  ? "border-[#8FB8FF] bg-[#F1F5F9]"
                  : "border-2 border-[#F1F5F9] bg-[#F1F5F9]"
                } hover:none focus:none`}
            >
              {option}
            </button>
          ))}
        </div>

        <div className="p-2 flex justify-between">
          <Button
            type="button"
            onClick={handleClearFilter} // Chama handleClearFilter ao clicar
            disabled={selectedOptions.length === 0}
            className={`text-base px-2 py-1 rounded 
              ${selectedOptions.length === 0
                ? "opacity-50 cursor-not-allowed bg-white text-[#00253F]"
                : "bg-white text-[#00253F] hover:bg-white"
              }`}
          >
            Limpar
          </Button>
          <Button
            type="button"
            onClick={handleApplyFilters} // Chama handleApplyFilters ao clicar
            disabled={selectedOptions.length === 0}
            className={`text-base px-2 w-[6rem] py-1 rounded 
              ${selectedOptions.length === 0
                ? "opacity-50 cursor-not-allowed bg-[#00253F]"
                : "bg-[#00253F] text-white"
              }`}
          >
            Aplicar
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}