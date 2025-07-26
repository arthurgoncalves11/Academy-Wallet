interface SmallerInfoBlockProps {
  label1: string;
  value1: string;
  label2: string;
  value2: string;
  label3: string;
  value3: string;
  label4: string;
  value4: string;
}

const SmallerInfoBlock: React.FC<SmallerInfoBlockProps> = ({
  label1,
  value1,
  label2,
  value2,
  label3,
  value3,
  label4,
  value4,
}) => (
  <div className="flex w-full md:mb-[1.125rem] lg:mb-[1.5rem]">
  <div className="w-1/4 md:pl-[1.125rem] lg:pl-[1.5rem]">
    <p className="text-[#64748B] font-medium" title={label1}>{label1}</p>
    <p className="text-[#00253F] font-medium" title={value1}>{value1}</p>
  </div>
  <div className="w-1/4 md:pl-[1.125rem] lg:pl-[1.5rem]">
    <p className="text-[#64748B] font-medium" title={label2}>{label2}</p>
    <p className="text-[#00253F] font-medium" title={value2}>{value2}</p>
  </div>
  <div className="w-1/4 md:pl-[1.125rem] lg:pl-[1.5rem]">
    <p className="text-[#64748B] font-medium" title={label3}>{label3}</p>
    <p className="text-[#00253F] font-medium" title={value3}>{value3}</p>
  </div>
  <div className="w-1/4 md:pl-[1.125rem] lg:pl-[1.5rem]">
    <p className="text-[#64748B] font-medium" title={label4}>{label4}</p>
    <p className="text-[#00253F] font-medium" title={value4}>{value4}</p>
  </div>
</div>

);
export default SmallerInfoBlock;
