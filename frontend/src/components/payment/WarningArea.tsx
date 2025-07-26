import Image from "next/image";

const WarningArea = () => (
  <div
    id="warning-area"
    className="md:hidden lg:hidden xl:block xl:w-[24.813rem] md:py-[0.75rem] md:px-[0.75rem] py-[1rem] px-[1rem] pr-[2.5rem] lg:py-[1rem] lg:px-[1rem] border border-[#F1F5F9] rounded-[0.5rem]"
  >
    <h1
      id="warning-title" title="Atenção"
      className="text-[#1E293B] font-semibold md:mb-[0.563rem] mb-[0.75rem] lg:mb-[0.75rem]"
    >
      Atenção
    </h1>
    <Image
      className="md:mb-[0.938rem] mb-[1.25rem] lg:mb-[1.25rem]"
      src="/bigger-dashed-line.svg"
      alt="bigger dashed line"
      width="366"
      height="366"
    ></Image>
    <div
      id="warning-text"
      className="flex md:gap-[0.375rem] gap-[0.5rem] lg:gap-[0.5rem] "
    >
      <Image
        src="/info-icon.svg"
        alt="info"
        width={20}
        height={20}
        className="self-start"
      />
      <p className="text-[#1E293B] font-normal" title="No momento, só é possível realizar pagamento de tributos sem leitor de
        código de barras.">
        No momento, só é possível realizar pagamento de tributos sem leitor de
        código de barras.
      </p>
    </div>
  </div>
);

export default WarningArea;
