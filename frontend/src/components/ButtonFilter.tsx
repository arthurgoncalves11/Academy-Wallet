import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface FilterDropdownProps {
  options: string[]; 
  selectedOptions: string[]; 
  setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>; 
  buttonText: string; 
}

export function FilterDropdown({
  options,
  selectedOptions,
  setSelectedOptions,
  buttonText,
}: FilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);


  const handleOptionSelect = (option: string) => {
    setSelectedOptions([option]);
    setIsOpen(false); 
  };

  const clearFilter = () => {
    setSelectedOptions([]); 
    setIsOpen(false);
  };


useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  }

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

  return (
    <div className="relative">
      <Button
      id="button-filter"
        variant="outline"
        className="flex items-center bg-white px-4 border-[1px] rounded-md
                   border-gray-300 text-gray-500 
                   h-[50px] md:h-[42px] lg:h-[55px] sm:w-[100px] md:w-[97px]  lg:w-[125px] sm:gap-0 md:gap-0 lg:gap-1
                   transition-all duration-120 active:scale-90  hover:bg-lightGray"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src="/icon-filter.svg"
          alt="Ícone de filtro"
          className="mr-2"
          width={24}
          height={24}
        />
        {buttonText}

        {selectedOptions.length > 0 && (
  <span className="ml-2 inline-flex items-center justify-center w-5 h-5 min-w-[22px] min-h-[22px] rounded-full bg-titleFont text-white text-[0.8rem] font-semibold">
  {selectedOptions.length}
</span>
        )}
      </Button>

      {isOpen && (
        <div ref={filterRef} 
        className="absolute top-[100%] right-0 w-[16rem] p-2 mt-2 bg-white border rounded-lg shadow-lg z-10">
          <h2 className="text-xs pl-2 font-semibold pt-2">
            Selecione um filtro
          </h2>
          <div className="flex flex-wrap gap-2 my-2">
            {options.map((option, index) => (
              <button
              id={`filter-${index + 1}`} 

                key={option}
                onClick={() => handleOptionSelect(option)}
                className={`p-2 rounded-full border text-center text-xs
                            min-w-[2rem] max-w-[6rem] w-full sm:w-auto
                            ${
                              selectedOptions.includes(option)
                                ? "border-[#8FB8FF] bg-[#F1F6FF] border-[2px]"
                                : "border-2 border-[#F1F5F9] bg-[#F1F5F9]"
                            }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="relative p-2 flex">
            <Button
            id="clear-filter"
              type="button"
              onClick={clearFilter}
              disabled={selectedOptions.length === 0}
              className={`text-base px-2 py-1 rounded h-[35px] w-[115px]
                          ${
                            selectedOptions.length > 0
                              ? "bg-[#00253F] text-white hover:bg-[#00172B]"
                              : "bg-white text-[#00253F] border border-[#00253F] opacity-50 cursor-not-allowed"
                          }`}
            >
              Limpar filtro
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
