import LoadingWrapper from "./LoadingWrapper";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { Skeleton } from "@/components/ui/skeleton";

interface WalletCardProps {
  bgColor: string;
  title: string;
  subtitle: string;
  value: number;
  flag: boolean;
  isHidden: boolean;
  id: string;
  loading: boolean;

}

export function SkeletonDemo() {
  return (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export const WalletCard: React.FC<WalletCardProps> = ({
  title,
  bgColor,
  subtitle,
  value,
  flag,
  isHidden,
  id,
  loading,
}) => {

  
  return (
    <div className="w-full">
      <div className="card account balance w-full">
        <div className="Card flex flex-col h-[144px] xl:h-[190px] 2xl:h-[210px] bg-backgroundCardBalance pt-[12px] 2xl:pt-[18px] pb-[16px] md:pl-[8px] lg:pl-[12px]  
        border-[1.1px] border-lightGray w-[98%] rounded-[8px]">
          {!flag ? (
            <Link href="/investment" className="block w-full">
              <div className="header-card group w-full h-[30px] xl:h-[45px] flex items-center justify-between">
                <div className="flex items-center space-x-2 md:h-[40px]">
                  <LoadingWrapper
                    loading={loading}
                    skeletonWidth="50px"
                    skeletonHeight="50px"
                  >
                    <div
                      className={`w-[40px] h-[40px] xl:w-[50px] xl:h-[50px] 2xl:w-[60px] 2xl:h-[60px] ${bgColor} rounded-[6px] flex items-center justify-center transition-all duration-200 active:scale-90`}
                    >
                      <Image
                        src="/logo-hat-white.svg"
                        alt="Academy Hat"
                        width={24}
                        height={20}
                        className="w-[28px] h-[24px] xl:w-[34px] xl:h-[28px] 2xl:w-[38px] 2xl:h-[32px]"
                      />
                    </div>
                  </LoadingWrapper>

                  <LoadingWrapper
                    loading={loading}
                    skeletonWidth="95px"
                    skeletonHeight="36px"
                  >
                    <h1 className="font-semibold text-sm leading-[16.94px] text-titleFont text-[14px] xl:text-[16px] 2xl:text-[18px]">
                      {title}
                    </h1>
                  </LoadingWrapper>
                </div>

                <div className="md:mr-[1px] xl:mr-[15px] 2xl:mr-[20px]">
                  <LoadingWrapper
                    loading={loading}
                    skeletonWidth="50px"
                    skeletonHeight="38px"
                  >
                    <div className="investments items-center w-100px">
                      <button
                        className="bg-transparent border-none flex justify-center items-center transition-all duration-200 w-[25px] md:w-[26px] h-[40px] group-active:scale-90"
                        id="show-investments"
                        tabIndex={-1}
                      >
                        <FontAwesomeIcon
                          icon={faChevronRight}
                          className="text-[14px] xl:text-[18px] 2xl:text-[25px] text-iconRightArrow ml-[0px] md:mr-3px lg:mr-15px md:pr-[3px] xl:pr-[15px] 2xl:pr-[25px] group-hover:text-titleFont"
                        />
                      </button>
                    </div>
                  </LoadingWrapper>
                </div>
              </div>
            </Link>
          ) : (
            <div className="header-card group w-full h-[30px] xl:h-[45px] flex items-center justify-between">
              <div className="flex items-center space-x-2 md:h-[40px]">
                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="50px"
                  skeletonHeight="50px"
                >
                  <div
                    className={`w-[40px] h-[40px] xl:w-[50px] xl:h-[50px] 2xl:w-[60px] 2xl:h-[60px] ${bgColor} rounded-[6px] flex items-center justify-center transition-all duration-200 active:scale-90`}
                    >
                  
                    <Image
                      src="/logo-hat-white.svg"
                      alt="Academy Hat"
                      width={24}
                      height={20}
                      className="md:w-[28px] md:h-[28px] xl:w-[34px] xl:h-[28px] 2xl:w-[38px] 2xl:h-[32px]"
                    />
                  </div>
                </LoadingWrapper>

                <LoadingWrapper
                  loading={loading}
                  skeletonWidth="115px"
                  skeletonHeight="36px"
                >
                  <h1 className="font-semibold text-sm leading-[16.94px] text-titleFont text-[14px] xl:text-[16px] 2xl:text-[18px]">
                    {title}
                  </h1>
                </LoadingWrapper>
              </div>
            </div>
          )}

          <div className="total balance mt-[36px] xl:mt-[50px] 2xl:mt-[62px]">
            <LoadingWrapper
              loading={loading}
              skeletonWidth="120px"
              skeletonHeight="30px"
            >
              <h2 className="font-regular text-sm leading-[16.94px] text-titleFont text-[14px] xl:text-[16px] 2xl:text-[18px]">
                {subtitle}
              </h2>
            </LoadingWrapper>

            <div className=" mt-[5px]">
              <LoadingWrapper
                loading={loading}
                skeletonWidth="95px"
                skeletonHeight="30px"
              >
                <p
  className="font-inter text-[14px] xl:text-[16px] 2xl:text-[18px] font-normal leading-[19.36px] text-left decoration-skip-ink mt-[5px] xl:mt-[7px] 2xl:mt-[10px]"
  id={id}
>
  <strong>R$ </strong>
  {isHidden
    ? "••••••"
    : Number(value).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}
</p>
              </LoadingWrapper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
