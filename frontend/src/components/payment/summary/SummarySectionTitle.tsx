interface SummarySectionTitleProps {
  title1: string,
  title2?: string
}

const SummarySectionTitle: React.FC<SummarySectionTitleProps> = ({ title1, title2 }) => (
  <div className="flex w-full">
    <h1 title={title1} className="w-1/2 md:pl-[1.125rem] lg:pl-[1.5rem] text-[#334155] font-normal">
      {title1}
    </h1>
    <h1 title={title2} className="w-1/2 md:pl-[1.125rem] lg:pl-[1.5rem] text-[#334155] font-normal">
      {title2}
    </h1>
  </div>
);

export default SummarySectionTitle