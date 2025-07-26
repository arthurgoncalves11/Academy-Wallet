import InvestmentBody from "@/components/investment/InvestmentBody";
import InvestmentHeader from "@/components/investment/InvestmentHeader";
import { InvestmentProvider } from "@/contexts/investmentContext";
import React from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { PaymentResultProvider } from "@/contexts/paymentContext";

function Investment() {
  return (
    <div className="flex flex-col justify-center">
      <InvestmentProvider>
        <PaymentResultProvider>
          <InvestmentHeader />
          <InvestmentBody />
          <ToastContainer />
        </PaymentResultProvider>
      </InvestmentProvider>
    </div>
  );
}

export default Investment;
