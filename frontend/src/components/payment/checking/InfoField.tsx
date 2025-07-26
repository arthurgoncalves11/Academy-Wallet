import { Input } from "@/components/ui/input";
import LoadingWrapper from "./SkeletonWrapper";

interface InfoFieldProps {
  label1: string;
  value1: string;
  label2: string;
  value2: string;
  label3?: string;
  value3?: string;
  loading: boolean;
  contentFlag: number;
}

const InfoField: React.FC<InfoFieldProps> = ({
  label1,
  value1,
  label2,
  value2,
  label3,
  value3,
  loading,
  contentFlag,
}) => {
  if (contentFlag === 2) {
    return (
      <div className="w-1/2 md:pr-[0.939rem] pr-[1.25rem] lg:pr-[1.25rem] md:pl-[0.563rem] pl-[0.75rem] lg:pl-[0.75rem]">
        <p className="text-[#00253F] font-medium" id={label1} title={label1}>{label1}</p>
        <LoadingWrapper
          loading={loading}
          mdSkeletonWidth="md:max-w-full"
          mdSkeletonHeight="md:h-[2.5rem]"
          skeletonWidth="lg:max-w-full"
          skeletonHeight="lg:h=[2.5rem]"
        >
          <Input
            className="border-[#CBD5E1] text-[#94A3B8] font-normal md:mb-[0.563rem] mb-[0.75rem] lg:mb-[0.75rem]"
            defaultValue={value1}
            title={value1 === "-" ? "" : value1}
            id={value1 === "-" ? "" : value1}
            readOnly
          ></Input>
        </LoadingWrapper>
        <p className="text-[#00253F] font-medium" id={label2} title={label2}>{label2}</p>
        <LoadingWrapper
          loading={loading}
          mdSkeletonWidth="md:max-w-full"
          mdSkeletonHeight="md:h-[2.5rem]"
          skeletonWidth="lg:max-w-full"
          skeletonHeight="lg:h=[2.5rem]"
        >
          <Input
            className="border-[#CBD5E1] text-[#94A3B8] font-normal md:mb-[0.563rem] mb-[0.75rem] lg:mb-[0.75rem]"
            defaultValue={value2}
            title={value2 === "-" ? "" : value2}
            id={value2 === "-" ? "" : value2}
            readOnly
          ></Input>
        </LoadingWrapper>
      </div>
    );
  } else if (contentFlag === 3) {
    return (
      <div className="w-1/2 md:pr-[0.939rem] pr-[1.25rem] lg:pr-[1.25rem] md:pl-[0.563rem] pl-[0.75rem] lg:pl-[0.75rem]">
        <p className="text-[#00253F] font-medium" id={label1} title={label1}>{label1}</p>
        <LoadingWrapper
          loading={loading}
          mdSkeletonWidth="md:max-w-full"
          mdSkeletonHeight="md:h-[2.5rem]"
          skeletonWidth="lg:max-w-full"
          skeletonHeight="lg:h=[2.5rem]"
        >
          <Input
            className="border-[#CBD5E1] text-[#94A3B8] font-normal md:mb-[0.563rem] mb-[0.75rem] lg:mb-[0.75rem]"
            defaultValue={value1}
            title={value1 === "-" ? "" : value1}
            id={value1 === "-" ? "" : value1}
            readOnly
          ></Input>
        </LoadingWrapper>
        <p className="text-[#00253F] font-medium" id={label2} title={label2}>{label2}</p>
        <LoadingWrapper
          loading={loading}
          mdSkeletonWidth="md:max-w-full"
          mdSkeletonHeight="md:h-[2.5rem]"
          skeletonWidth="lg:max-w-full"
          skeletonHeight="lg:h=[2.5rem]"
        >
          <Input
            className="border-[#CBD5E1] text-[#94A3B8] font-normal md:mb-[0.563rem] mb-[0.75rem] lg:mb-[0.75rem]"
            defaultValue={value2}
            title={value2 === "-" ? "" : value2}
            id={value2 === "-" ? "" : value2}
            readOnly
          ></Input>
        </LoadingWrapper>
        <p className="text-[#00253F] font-medium" id={label3} title={label3}>{label3}</p>
        <LoadingWrapper
          loading={loading}
          mdSkeletonWidth="md:max-w-full"
          mdSkeletonHeight="md:h-[2.5rem]"
          skeletonWidth="lg:max-w-full"
          skeletonHeight="lg:h=[2.5rem]"
        >
          <Input
            className="border-[#CBD5E1] text-[#94A3B8] font-normal md:mb-[0.563rem] mb-[0.75rem] lg:mb-[0.75rem]"
            defaultValue={value3}
            title={value3 === "-" ? "" : value3}
            id={value3 === "-" ? "" : value3}
            readOnly
          ></Input>
        </LoadingWrapper>
      </div>
    );
  }
};

export default InfoField;
