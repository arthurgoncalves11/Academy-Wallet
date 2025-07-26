import { useState, useEffect } from "react";
import { X } from 'lucide-react';

interface NotificationProps {
  marginTop: string;
  textColor: string;
  bgColor: string;
  progressBarColor?: string;
  borderColor: string;
  xColor: string;
  xHoverColor: string;
  message: string;
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ marginTop, message, onClose, textColor, bgColor, progressBarColor, borderColor, xColor, xHoverColor }) => {

  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (visible) {
      timer = setTimeout(() => {
        setVisible(false);
        onClose();
      }, 4900);

      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prevProgress + 0.25 // Ajuste a velocidade da barra de progresso aqui
        });
      }, 12.5); // Ajuste o intervalo para a velocidade da barra de progresso

      return () => {
        clearTimeout(timer);
        clearInterval(interval);
      };
    }
  }, [visible, onClose]);


  const handleClose = () => {
    setVisible(false);
    onClose();
  };

  if (!visible) return null;

  return (
    <div className={`fixed ${marginTop} z-20 right-4 border-l-4 ${borderColor} rounded-lg flex items-center px-2 justify-between md:w-[16.40625rem] lg:w-[21.875rem] md:min-h-[3.188rem] lg:min-h-[4.25rem] md:px-[0.75rem] lg:px-[1rem] ${bgColor} 
      shadow-md transition-all duration-500 ease-in-out animate-slide-in-left`} > {/* Classes de animação adicionadas */}
      <div className={`absolute bottom-0 left-0 w-[98%] ${bgColor} h-1 rounded-lg`}> {/* Barra de progresso */}
        <div className={`${progressBarColor} h-1`} style={{ width: `${progress}%` }}></div>
      </div>
      <span title={message} className={`${textColor} font-normal text-sm break-words md:max-w-[13.031rem] lg:max-w-[17.375rem]`}>
        {message}
      </span>
      <button onClick={handleClose} className={`${xColor} ${xHoverColor} md:mr-[0.187rem] lg:mr-[0.25rem]`}>
        <X size={24}></X>
      </button>
    </div>
  );
};
