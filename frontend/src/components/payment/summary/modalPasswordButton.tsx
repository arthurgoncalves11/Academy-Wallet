"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import Image from "next/image";
import PaymentData from "../PaymentData";

export function PaymentButton() {
  const [randomPairs, setRandomPairs] = useState<number[][]>([]);
  const [password, setPassword] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

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

  const handleNumberClick = (num: number) => {
    if (password.length < 6) {
      setPassword([...password, num]);
    }
  };

  const handleDelete = () => {
    setPassword(password.slice(0, -1));
  };

  return (
    <PaymentData>
      {({  }) => (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-[#00253F] hover:bg-[#00225C] text-[#FFFFFF] hover:text-white md:mr-[1.125rem] lg:mr-[1.5rem]"
              variant="outline"
              onClick={() => setIsOpen(true)}
              title="Realizar pagamento"
            >
              Realizar pagamento
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white rounded-lg">
            <DialogTitle>
              <div className="flex justify-between items-center px-[1.125rem] py-[1.5rem] bg-[#FAFAFA] rounded-t-lg">
                <h2 className="text-[#141E28] font-semibold">Senha</h2>
              </div>
            </DialogTitle>
            <div className="flex flex-col items-start p-[1.125rem] gap-4">
              {/* Password input boxes */}
              <div className="flex gap-2 mb-4">
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

              {/* Number buttons */}
              <div className="grid grid-cols-3 gap-2">
                {randomPairs.map(([num1, num2], index) => (
                  <button
                    key={index}
                    onClick={() => handleNumberClick(num1)}
                    className="px-4 py-2 border rounded-md h-[3.125rem] bordet-2 hover:bg-gray-300"
                  >
                    {num1} ou {num2}
                  </button>
                ))}
                <button
                  onClick={handleDelete}
                  className=" px-2 py-2 border bordet-2 h-[3.125rem] flex items-center justify-center rounded-md"
                >
                  <Image
                    src="/deleteButton.svg"
                    alt=""
                    width={30}
                    height={30}
                  />
                </button>
              </div>

              {/* Delete button */}
            </div>

            <DialogFooter className="flex justify-end gap-[0.25rem] px-[1.125rem] pb-[2rem] pt-[0.875rem]">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="hover:bg-white"
              >
                Cancelar
              </Button>
              <Button
                className={`transition-opacity ${
                  isComplete
                    ? "opacity-100 bg-[#00253F] hover:bg-[#00253F]"
                    : "opacity-50 bg-[#00253F] pointer-events-none"
                }`}
                title="Confirmar pagamento"
              >
                Confirmar pagamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </PaymentData>
  );
}
