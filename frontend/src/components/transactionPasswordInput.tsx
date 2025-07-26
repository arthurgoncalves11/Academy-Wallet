import { useEffect, useRef, useState } from "react";

interface TransactionPasswordProps {
  onComplete: (complete: boolean, password: string) => void;
}

export function TransactionPasswordInput({ onComplete }: TransactionPasswordProps) {
  const [values, setValues] = useState(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const complete = values.every((digit) => digit !== "");
    const password = values.join('');

    if (complete) {
      onCompleteRef.current(complete, password); // Use the ref instead of onComplete
    }
  }, [values]); // No need to include onComplete in the dependency array

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <>
      {values.map((value, index) => (
        <input
          key={index}
          type="password"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          className="w-10 h-[50px] border border-[#E4E4E4] rounded-lg outline-[#5895FF] p-0 text-center text-2xl leading-[50px] font-normal"
        />
      ))}
    </>
  );
}