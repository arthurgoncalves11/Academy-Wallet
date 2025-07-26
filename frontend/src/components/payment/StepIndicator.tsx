import Image from "next/image";

interface StepIndicatorProps {
  pageNumber: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ pageNumber }) => {
  if (pageNumber === 1) {
    return (
      <div className="flex items-center justify-center h-[1.5rem] md:w-[6.375rem] w-[8.5rem] lg:w-[8.5rem]">
        <div className="flex items-center justify-between md:w-[6.375rem] w-[8.5rem] lg:w-[8.5rem] absolute">
          <p id="step-1" title="página 1" className="bg-[#00253F] text-[#FFFFFF] font-semibold flex items-center justify-center h-[1.5rem] w-[1.5rem] rounded-[3rem]">
            1
          </p>
          <p id="step-2" className="bg-[#CBD5E1] text-[#FFFFFF] font-semibold flex items-center justify-center h-[1.5rem] w-[1.5rem] rounded-[3rem]">
            2
          </p>
          <p id="step-3" className="bg-[#CBD5E1] text-[#FFFFFF] font-semibold flex items-center justify-center h-[1.5rem] w-[1.5rem] rounded-[3rem]">
            3
          </p>
        </div>
        <Image
          src="smaller-dashed-line.svg"
          alt="smaller dashed line"
          width={88}
          height={88}
        />
      </div>
    );
  } else if (pageNumber === 2) {
    return (
      <div className="flex items-center justify-center h-[1.5rem] md:w-[6.375rem] w-[8.5rem] lg:w-[8.5rem]">
        <div className="flex items-center justify-between md:w-[6.375rem] w-[8.5rem] lg:w-[8.5rem] absolute">
          <p id="step-1" className="bg-[#0055E7] text-[#FFFFFF] font-semibold flex items-center justify-center h-[1.5rem] w-[1.5rem] rounded-[3rem]">
            <Image src="/check.svg" alt="check" width={18} height={18}></Image>
          </p>
          <p id="step-2" title="página 2" className="bg-[#00253F] text-[#FFFFFF] font-semibold flex items-center justify-center h-[1.5rem] w-[1.5rem] rounded-[3rem]">
            2
          </p>
          <p id="step-3" className="bg-[#CBD5E1] text-[#FFFFFF] font-semibold flex items-center justify-center h-[1.5rem] w-[1.5rem] rounded-[3rem]">
            3
          </p>
        </div>
        <Image
          src="/smaller-dashed-line.svg"
          alt="smaller dashed line"
          width={88}
          height={88}
        />
      </div>
    );
  } else if (pageNumber === 3) {
    return (
      <div className="flex items-center justify-center h-[1.5rem] md:w-[6.375rem] w-[8.5rem] lg:w-[8.5rem]">
        <div
          id="Steps"
          className="flex items-center justify-between md:w-[6.375rem] w-[8.5rem] lg:w-[8.5rem] absolute"
        >
          <p
            id="step-1"
            className="bg-[#0055E7] text-[#FFFFFF] font-semibold flex items-center justify-center h-[1.5rem] w-[1.5rem] rounded-[3rem]"
          >
            <Image src="/check.svg" alt="check" width={18} height={18}></Image>
          </p>
          <p
            id="step-2"
            className="bg-[#0055E7] text-[#FFFFFF] font-semibold flex items-center justify-center h-[1.5rem] w-[1.5rem] rounded-[3rem]"
          >
            <Image src="/check.svg" alt="check" width={18} height={18}></Image>
          </p>
          <p
            id="step-3" title="página 3"
            className="bg-[#00253F] text-[#FFFFFF] font-semibold flex items-center justify-center h-[1.5rem] w-[1.5rem] rounded-[3rem]"
          >
            3
          </p>
        </div>
        <Image
          src="/smaller-dashed-line.svg"
          alt="smaller dashed line"
          width={88}
          height={88}
        />
      </div>
    );
  }
};
export default StepIndicator;
