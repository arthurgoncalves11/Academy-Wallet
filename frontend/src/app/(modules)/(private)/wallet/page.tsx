"use client"; 

import React, { useState } from "react";
import BalanceCard from "./BalanceCard";
import AccountMovements from "./movement/AccountMovements";

export default function Page() {
  const [isHidden, setIsHidden] = useState(true);

  const toggleVisibility = () => {
    setIsHidden((prev) => !prev);
  };

  return (
    <div className="border border-lightGray rounded-3rem bg-white mt-[5px] !mr-[10px] !ml-[30px] sm:w-[390px] md:w-[90%] lg:md:w-[93%] xl:md:w-[95%] 2xl:w-[96%] h-full">
      <BalanceCard isHidden={isHidden} toggleVisibility={toggleVisibility} />
      <AccountMovements isHidden={isHidden} />
    </div>
  );
}
