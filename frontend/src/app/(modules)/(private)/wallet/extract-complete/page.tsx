"use client";

import { useState } from "react";
import ExtractComplete from "./ExtractComplete";

export default function Page() {
  const [isHidden, setIsHidden] = useState(true);

  const toggleVisibility = () => {
    setIsHidden((prev) => !prev);
  };

  return (
    <div className="border border-lightGray rounded-3rem bg-white mt-[5px] mr-[0px] ml-[0px] min-h-[85%] 2xl:[95%]">
      <ExtractComplete
        isHidden={isHidden}
        toggleVisibility={toggleVisibility}
        listaDeMovimentacoes={[]}
      />
    </div>
  );
}
