"use client";

import {
  BankSlipProvider,
  UserProvider,
  PaymentResultProvider,
} from "@/contexts/paymentContext";
import { ToastContainer } from "react-toastify";

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BankSlipProvider>
      <UserProvider>
        <PaymentResultProvider>
          {children}
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </PaymentResultProvider>
      </UserProvider>
    </BankSlipProvider>
  );
}
