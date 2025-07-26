import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";

interface VisibilityToggleButtonProps {
  isHidden: boolean;
  toggleVisibility: () => void;
  loading?: boolean;
}

const VisibilityToggleButton: React.FC<VisibilityToggleButtonProps> = ({
  isHidden,
  toggleVisibility,
  
}) => {
  return (
   
      <button
        onClick={toggleVisibility}
        className="w-[40px] h-[42px] lg:w-[55px] lg:h-[55px] bg-backgroundButtonEye border-[1.1px] border-lightGray flex justify-center items-center 
        rounded-[8px] transition-all duration-200 hover:bg-white active:scale-90"
        id="show-information"
      >
        <FontAwesomeIcon
          icon={isHidden ? faEyeSlash : faEye}
          className="text-[16px] xl:text-[20px] 2xl:text-[25px]"
    style={{ maxWidth: "25px", maxHeight: "25px", minWidth: "16px", minHeight: "16px" }}           />
      </button>
   
  );
};

export default VisibilityToggleButton;
