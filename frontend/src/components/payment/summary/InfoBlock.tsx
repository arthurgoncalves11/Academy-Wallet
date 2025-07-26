interface InfoBlockProps {
  label: string,
  value: string
}

const InfoBlock: React.FC<InfoBlockProps> = ({ label, value }) => (
  <div className="w-1/2 md:pl-[1.125rem] lg:pl-[1.5rem]">
    <p title={label} className="text-[#64748B] font-medium">{label}</p>
    <p title={value === "-" ? "" : value} className="text-[#00253F] font-medium">{value}</p>
  </div>
)
export default InfoBlock