"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { publicEncrypt } from "crypto";
import { useEffect, useState } from "react";
import jwt, { JwtPayload } from "jsonwebtoken";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { usePaymentResult } from "@/contexts/paymentContext";
import { useAuth } from "@/contexts/AuthContext";
import { fetchPublicKey } from "@/app/api/payment/route";
import Image from "next/image";

interface PinInputDialogProps {
  triggerButton: React.ReactNode;
  initialValue?: number;
  marketShareId?: string;
  onError?: (message: string) => void;
  onConfirmInvestment?: (
    encryptedPassword: string,
    walletId: string,
    initialValue?: number,
    marketShareId?: string
  ) => Promise<void>;
  onConfirmBuyInvestment?: (
    encryptedPassword: string,
    walletId: string,
    amount?: number,
    marketShareId?: string
  ) => Promise<void>;
  onConfirmPayment?: (
    encryptedPassword: string,
    walletId: string,
    barcode?: string,
    name?: string,
    value?: number
  ) => Promise<void>;
  confirmButtonText: string;
  barcode?: string;
  name?: string;
  value?: number;
  amount?: number;
}

export function PinInputDialog({
  triggerButton,
  initialValue,
  marketShareId,
  onConfirmInvestment,
  confirmButtonText,
  onConfirmBuyInvestment,
  amount,
  barcode,
  name,
  value,
  onConfirmPayment,
}: PinInputDialogProps) {
  const { paymentResult, setPaymentResult } = usePaymentResult();

  const [randomPairs, setRandomPairs] = useState<number[][]>([]);
  const [password, setPassword] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuth();

  let walletId: string;

  if (token) {
    const decoded = jwt.decode(token) as JwtPayload;
    walletId = decoded?.idWallet;
  }

  useEffect(() => {
    if (isOpen) {
      setRandomPairs(generateRandomPairs());
      setPassword([]);
    }
  }, [isOpen]);

  useEffect(() => {
    setIsComplete(password.length === 6);
  }, [password]);

  const generateRandomPairs = () => {
    const availableNumbers = Array.from({ length: 10 }, (_, i) => i);
    const pairs: number[][] = [];

    for (let i = 0; i < 5; i++) {
      if (availableNumbers.length < 2) break;

      availableNumbers.sort(() => Math.random() - 0.5);

      const num1 = availableNumbers.pop()!;
      const num2 = availableNumbers.pop()!;

      pairs.push([num1, num2]);
    }

    return pairs;
  };

  const handleNumberClick = (num1: number, num2: number) => {
    if (password.length < 6) {
      setPassword([...password, `${num1}${num2}`]);
    }
  };

  const handleDelete = () => {
    setPassword(password.slice(0, -1));
  };

  const encrypt = async () => {
    const publicKey = await fetchPublicKey(token);

    const encryptedKey = publicEncrypt(
      publicKey,
      Buffer.from(password.join(""), "utf8")
    ).toString("base64");

    return encryptedKey;
  };

  const handleConfirm = async () => {
    const encryptedPassword = await encrypt();

    if (onConfirmInvestment) {
      try {
        await onConfirmInvestment(
          encryptedPassword,
          walletId,
          initialValue,
          marketShareId
        );
        setIsLoading(false);
      } catch {
        setIsLoading(false);
        console.log("entraou")
        setIsOpen(false)

      }
    } else if (onConfirmPayment) {
      try {
        await onConfirmPayment(
          encryptedPassword,
          walletId,
          barcode,
          name,
          value
        );
      } catch (error) {
        console.error("Erro ao confirmar a operação:", error);
      }
    } else if (onConfirmBuyInvestment) {
      try {
        await onConfirmBuyInvestment(
          encryptedPassword,
          walletId,
          amount,
          marketShareId,
        );

      } catch (error) {
        console.error("Erro ao confirmar a operação:", error);
      }
    }
  };

  useEffect(() => {
    if (paymentResult.error) {
      console.log("entrou no use", paymentResult.error)
      setIsLoading(false);
    }
  }, [paymentResult.error]);

  useEffect(() => {
    if (paymentResult.message !== "Senha inválida" && paymentResult.message !== "" && onConfirmInvestment) {
      console.log("entrou no use message", paymentResult.message)
      setIsOpen(false)
    }
  }, [paymentResult.message]);


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger id="button-to-open" asChild>{triggerButton}</DialogTrigger>
      <DialogContent className="bg-white rounded-lg">
        <DialogTitle>
          <div id="dialog-title" className="flex justify-between items-center px-[1.125rem] py-[1.5rem] bg-[#FAFAFA] rounded-t-lg">
            <h2 className="text-[#141E28] font-semibold">Senha</h2>
          </div>
        </DialogTitle>
        <div
          className={`flex flex-col items-start p-[1.125rem] ${paymentResult.error ? "gap-2" : "gap-4"
            }`}
        >
          {/* Password input boxes */}
          <div className="flex flex-col">
            <div
              id="password-input-boxes"
              className={`flex gap-2 ${paymentResult.error ? "mb-1" : "mb-4"}`}
            >
              {[...Array(6)].map((_, i) => (
                <input
                  key={i}
                  type="text"
                  value={password[i] !== undefined ? "•" : ""}
                  readOnly
                  className="w-10 h-[3.125rem] border rounded-md text-center"
                />
              ))}
            </div>
            {paymentResult.error && (
              <span id="error-text" className="text-[#E21B0C] font-normal text-sm">
                {paymentResult.message}
              </span>
            )}
          </div>

          {/* Number buttons */}
          <div id="number-buttons" className="grid grid-cols-3 gap-2">
            {randomPairs.map(([num1, num2], index) => (
              <button
                key={index}
                onClick={() => handleNumberClick(num1, num2)}
                className="px-4 py-2 border rounded-md h-[3.125rem] bordet-2 hover:bg-gray-300"
              >
                {num1} ou {num2}
              </button>
            ))}
            <button
              id="delete-button"
              onClick={handleDelete}
              className=" px-2 py-2 border bordet-2 h-[3.125rem] flex items-center justify-center rounded-md"
            >
              <Image className="pt-[0.98px]" src="delete-button.svg" alt="Delete" width={30} height={30} />
            </button>
          </div>

          {/* Delete button */}
        </div>

        <DialogFooter className="flex justify-end gap-[0.25rem] px-[1.125rem] pb-[2rem] pt-[0.875rem]">
          <Button
            id="quit-button"
            variant="outline"
            onClick={() => setIsOpen(false)}
            className="bg-white hover:bg-[#F8FAFC]"
          >
            Cancelar
          </Button>
          <Button
            id="confirm-button"
            disabled={isLoading}
            className={`transition-opacity ${isComplete
              ? "opacity-100 bg-[#00253F] hover:bg-[#00253F]"
              : "opacity-50 bg-[#00253F] pointer-events-none"
              }`}
            onClick={() => {
              handleConfirm();
              setIsLoading(true)
              setPaymentResult((prevPaymentResult) => ({
                ...prevPaymentResult,
                error: false,
                message: "",
              }));
            }}
          >
            {isLoading ? (
              <div className="flex gap-3">
                <p>Carregando</p>
                <FontAwesomeIcon
                  icon={faSpinner}
                  className="h-4 w-4 animate-spin"
                />
              </div>
            ) : (
              confirmButtonText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
