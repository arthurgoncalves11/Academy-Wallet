import { useEffect, useRef, useState } from "react";

interface OtpCodeProps {
  onComplete: (complete: boolean, password: string) => void;
}

export function OtpCodeInput({ onComplete }: OtpCodeProps) {
  const [values, setValues] = useState(Array(4).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const onCompleteRef = useRef(onComplete);

  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newValues = [...values];
    newValues[index] = value;
    setValues(newValues);
    
    const complete = newValues.every((digit) => digit !== "");
    const password = newValues.join('');
    if (complete) {  
      
        onCompleteRef.current(complete, password);
     
    }

    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      const newValues = [...values];
      newValues[index - 1] = '';
      setValues(newValues);
      inputsRef.current[index - 1]?.focus();
    
    }
  };

  const handleBlur = (index: number) => {
    if (index === 3) {
      const complete = values.every((digit) => digit !== "");
      const password = values.join('');
      onCompleteRef.current(complete, password);
    }
  };

  return (
    <div className="flex gap-3">
      {values.map((value, index) => (
        <input
          key={index}
          type="password"
          maxLength={1}
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onBlur={() => handleBlur(index)}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          className="w-10 h-[50px] border border-[#E4E4E4] rounded-lg outline-[#5895FF] p-0 text-center text-2xl leading-[50px] font-normal"
        />
      ))}
    </div>
  );
}